import { useEffect, useRef, RefObject, useState } from 'react';
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Dialog,
  ImageUploader,
  TextArea,
  DatePicker,
  Mask,
  Picker,
  ProgressCircle,
  Radio,
  Selector,
  Slider,
  Space,
  SpinLoading,
  Stepper,
  Switch,
  Toast,
  Checkbox
} from 'antd-mobile'
import { NFTStorage } from 'nft.storage'
import { BigNumber, ethers } from 'ethers';

import dayjs from 'dayjs'
import styles from './index.module.scss';
import ImageCrop from './imageCrop';
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker'
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import { IJunoabi, INymphabi } from '../../utils/ether';
import { Etherabi } from '../../types/index'
import config from '../../config/app'


const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJERDdDNDljMzRjN0IxMDVGNDdDNzA0MDI3YTRkZDhBNEU3MzdiMDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODA2OTU4NDE1MCwibmFtZSI6InRva2VuLWRhbmNlLWlwZnMta2V5In0.7D7Ea8v2FqTHNxa_4AQA-VEzsGdPbvjvtiQF8Squ5Kk'
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
let uploading = false;
let cropperBlob: Blob;
let fileName = '';
let fileType = '';
const CreateTicket = () => {
  const [createPercent, setCreatePercent] = useState(0);
  const [cropperUrl, setCropperUrl] = useState<string>('');
  const [fileList, setFileList] = useState<ImageUploadItem[]>([])
  const [showCropper, setShowCropper] = useState<Boolean>(false);
  const [showLoading, setShowLoading] = useState<Boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const confirmCb = function(blob: Blob) {
    setShowCropper(false);
    cropperBlob = blob;
    uploading = false;
  }

  const createSuccess = function() {
    setShowLoading(false);
    Toast.show({
      icon: 'success',
      content: '创建成功',
    })
    setTimeout(() => {
        navigate({
          pathname: '/list'
        });
    }, 200)
  }

  const createFailed = function() {
    setShowLoading(false);
    Toast.show({
      icon: 'fail',
      content: '创建失败',
    })
  }

  const inputError = function() {
    Toast.show({
      icon: 'fail',
      content: '请正确填写消息',
    })
  }
  async function uploadFun(file: File) {
    console.log('file', file)
    fileName = file.name;
    fileType = file.type;
    const url = URL.createObjectURL(file);
    setCropperUrl(url);
    setShowCropper(true);
    uploading = true;
    await new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        if(!uploading) {
          clearInterval(interval);
          resolve();
        }
      }, 100)
    })

    const newFile = new File([cropperBlob], fileName, {type: fileType})
    const newUrl = URL.createObjectURL(newFile);

    return {url: newUrl}
  }

  const onFinish = async (values: any) => {
    setShowLoading(true);
    console.log('finish', values)
    console.log(values.time, Math.floor(values.time.getTime() / 100))
    console.log('fileType', fileType);
    console.log('cropperBlob',cropperBlob, cropperBlob.size, cropperBlob.type);
    const newFile = new File([cropperBlob], fileName, {type: fileType})
    console.log('newFile', newFile)
    setCreatePercent(25);

    const metadata = await client.store({
      name: values.title,
      description: values.detail || '',
      image: newFile,
      location: values.address,
    }).catch((e: Error) => e);
    console.log('metadata:', metadata)
    setCreatePercent(50);
    if(!(metadata as any).ipnft) {
      return createFailed();
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts =await  web3Provider.send("eth_requestAccounts", []);
    let signer = web3Provider.getSigner();
    // 0x3dea2B63093956728D72438c4cC0ED8386b98cA0
    const contract = new ethers.Contract(config.CONTRACT_ADRESS, IJunoabi, signer);
    // 会议名，会议缩写，metadata url，举办时间（秒级时间戳），人数限制，会议类型，票价
    console.log('before hold')
    const holdMeetingResp = await contract?.HoldMeeting(
      values.title,
      values.shortTitle || '',
      `https://${(metadata as any).ipnft}.ipfs.nftstorage.link/metadata.json`,
      Math.floor(values.time.getTime() / 1000),
      Number(values.maxInvite),
      Number(values.type),
      Number(values.price)
    ).catch((e: Error) => e);
    console.log('holdMeetingResp', holdMeetingResp);
    setCreatePercent(75);

    if(!holdMeetingResp.wait) {
      return createFailed();
    }
    
    const holdResult = await holdMeetingResp.wait().catch((e: Error) => e);
    setCreatePercent(100);
    setShowLoading(false);
    if(holdResult.status !== undefined) {
      // success
      createSuccess();
    } else {
      // failed
      createFailed();
    }
    // const event = holdResult.events.find((event: any) => event.event as string === "NewMeeting");
    console.log('event', holdResult);
    // const [from, ticketAddress] = event.args;
    // console.log(from, ticketAddress);

  }
  return (
    <div className={styles.container} ref={ref}>
      <Form
        name='form'
        onFinish={onFinish}
        onFinishFailed={inputError}
        footer={
          <Button block type='submit' color='primary' size='large'>
            提交
          </Button>
        }
      >
        <Form.Header>请填写票的使用规则</Form.Header>
        <Form.Item name='title' label='会议标题' rules={[{ required: true }]}>
          <Input placeholder='' />
        </Form.Item>
        <Form.Item name='shortTitle' label='会议缩写'>
          <Input placeholder='' />
        </Form.Item>
        <Form.Item
          name='image'
          label='上传票面图片（尺寸为）'
          rules={[
            {
              required: true,
              message: '请上传票面图片'
            }
          ]}
        >
          <ImageUploader
            value={fileList}
            onChange={setFileList}
            upload={uploadFun}
            maxCount={1}
            imageFit="contain"
            showUpload={fileList.length < 1}
            onCountExceed={exceed => {
            }}
          />
        </Form.Item>

        <Form.Item
          name='time'
          label='会议时间'
          trigger='onConfirm'
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            datePickerRef.current?.open()
          }}
          rules={[
            {
              required: true,
              message: '请选择会议时间'
            }
          ]}
        >
          <DatePicker
            precision='minute'
          >
            {value => {
              return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '请选择时间'
            }
            }
          </DatePicker>
        </Form.Item>
        <Form.Item
          name='address'
          label='会议地点'
          rules={[
            {
              required: true,
              message: '请输入会议地点'
            }
          ]}
        >
          <Input placeholder='' />
        </Form.Item>
        <Form.Item
          name='detail'
          label='会议描述'
          
        >
          <TextArea
            maxLength={500}
            rows={3}
            showCount
          />
        </Form.Item>
        <Form.Item
          name='type'
          label='选择会议类型'
          rules={[
            {
              required: true,
              message: '请选择会议类型'
            }
          ]}
        >
            <Radio.Group>
              <Space direction='vertical'>
                <Radio value='1'>普通会议</Radio>
                <Radio value='2'>裂变会议</Radio>
                <Radio value='3'>秘密会议</Radio>
                <Radio value='4'>邀请会议</Radio>
              </Space>
            </Radio.Group>
        </Form.Item>
        <Form.Item
          required
          rules={[
            {
              min: 1,
              type: 'integer',
              transform(value) {
                return Number(value);
              },
              message: "请输入0以上的整数"
            }
          ]}
          name='price'
          label='票价设置'
        >
          <Input placeholder='请输入0以上的整数' type="integer"  />
        </Form.Item>
        <Form.Item
          required
          rules={[
            {
              min: 1,
              type: 'integer',
              transform(value) {
                return Number(value);
              },
              message: "请输入0以上的整数"
            }
          ]}
          name='maxInvite'
          label='会议总人数上限'
        >
          <Input placeholder='请输入最大邀请人数' type="integer"  />
        </Form.Item>
      </Form>
      {showCropper ? <ImageCrop confirmCb={confirmCb} url={cropperUrl}></ImageCrop> : null}
      {showLoading ? <Mask>
        <div className={styles.loadingBox}>
          {/* <SpinLoading  style={{ '--size': '48px', alignSelf: 'center' }} ></SpinLoading>
           */}
          <ProgressCircle
            percent={createPercent}
            style={{
              '--track-width': '4px',
              '--size': '90px'
            }}
          >
            <span className={styles.loadingText}>{createPercent}%</span>
          </ProgressCircle>
        </div>
      </Mask> : null}
    </div>)
}

export default CreateTicket;