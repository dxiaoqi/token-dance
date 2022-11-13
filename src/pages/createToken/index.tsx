import { useEffect, useRef, RefObject, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Dialog,
  ImageUploader,
  TextArea,
  DatePicker,
  Picker,
  Radio,
  Selector,
  Slider,
  Space,
  Stepper,
  Switch,
  Checkbox
} from 'antd-mobile'
import { NFTStorage } from 'nft.storage'
import dayjs from 'dayjs'
import styles from './index.module.scss';
import ImageCrop from './imageCrop';
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker'
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'

const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJERDdDNDljMzRjN0IxMDVGNDdDNzA0MDI3YTRkZDhBNEU3MzdiMDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODA2OTU4NDE1MCwibmFtZSI6InRva2VuLWRhbmNlLWlwZnMta2V5In0.7D7Ea8v2FqTHNxa_4AQA-VEzsGdPbvjvtiQF8Squ5Kk'
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
let uploading = false;
let cropperBlob: Blob;
let fileName = '';
let fileType = '';
const CreateToken = () => {
  const [cropperUrl, setCropperUrl] = useState<string>('');
  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    // {
    //   url:'http://localhost:3000/4a7cde6b-b09d-49b3-bc16-ee5ced89c26b'
    // }
  ])
  const [showCropper, setShowCropper] = useState<Boolean>(false);
  const ref = useRef<HTMLDivElement>(null)

  const confirmCb = function(blob: Blob) {
    setShowCropper(false);
    cropperBlob = blob;
    uploading = false;
  }

  async function sleep(time: number) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => resolve(), time);
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
    // const fileBlobData = new Blob([file]);
    // https://bafkreihsilbagqicdvsm6uwnejahe6fmvsuqarzbkhhzdf3ccc2jelkmcq.ipfs.nftstorage.link/
    // const fileBlobData = cropperBlob;
    // const newFile = new File([cropperBlob], fileName, {type: fileType})
    // console.log('newFile', newFile)
    // const cid = await client.storeBlob(fileBlobData);
    // const metadata = await client.store({
    //   name: 'My sweet NFT',
    //   description: 'Just try to funge it. You can\'t do it.',
    //   image: newFile
    // })
    // debugger
    // return {url: `https://${cid}.ipfs.nftstorage.link/`}
    // return {url: ''}
  }
  async function mockUpload(file: File) {
    console.log('uploading')
    await sleep(3000)
    return {
      url: URL.createObjectURL(file),
    }
  }
  async function mockUploadFail() {
    console.log('uploading')
    await sleep(3000)
    throw new Error('Fail to upload')
  }
  
  useEffect(() => {
    console.log((window as any).QrCode)
  }, [])
  const onFinish = async (values: any) => {
    console.log('finish', values)
    const newFile = new File([cropperBlob], fileName, {type: fileType})
    const metadata = await client.store({
      name: values.title,
      description: values.detail,
      image: newFile,
      location: values.address,
      properties: {
        title: values.title,
        shortTitle: values.shortTitle,
        time: values.time,
        address: values.address,
        detail: values.detail,
        type: values.type,
        price: values.price,
        maxInvite: values.maxInvite

      }
    })
    console.log('metadata:', metadata)
  }
  return (
    <div className={styles.container} ref={ref}>
      <Form
        name='form'
        onFinish={onFinish}
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
                <Radio value='0'>普通会议</Radio>
                <Radio value='1'>裂变会议</Radio>
                <Radio value='2'>秘密会议</Radio>
                <Radio value='3'>邀请会议</Radio>
              </Space>
            </Radio.Group>
        </Form.Item>
        <Form.Item
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
    </div>)
}

export default CreateToken;