import { useEffect, useRef, RefObject, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { FormInstance } from 'antd-mobile/es/components/form'

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
  Checkbox,
} from "antd-mobile";
import { NFTStorage } from "nft.storage";
import { BigNumber, ethers } from "ethers";

import dayjs from "dayjs";
import deepai from 'deepai';
import styles from "./index.module.scss";
import './index.scss';

import ImageCrop from "./imageCrop";
import type { DatePickerRef } from "antd-mobile/es/components/date-picker";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { IJunoabi, INymphabi } from "../../utils/ether";
import { Etherabi } from "../../types/index";
import config from "../../config/app";

import createTicketBgImage from '../../assert/create-ticket-bg.png';
import createTicketButtonBg from '../../assert/create-ticket-button-bg.png';
// import { FormInstance } from "rc-field-form";

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJERDdDNDljMzRjN0IxMDVGNDdDNzA0MDI3YTRkZDhBNEU3MzdiMDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODA2OTU4NDE1MCwibmFtZSI6InRva2VuLWRhbmNlLWlwZnMta2V5In0.7D7Ea8v2FqTHNxa_4AQA-VEzsGdPbvjvtiQF8Squ5Kk";
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
let uploading = false;
let cropperBlob: Blob;
let fileName = "";
let fileType = "";
const CreateTicket = () => {
  const navigate = useNavigate();
  const [createPercent, setCreatePercent] = useState(0);
  const [cropperUrl, setCropperUrl] = useState<string>("");
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [showCropper, setShowCropper] = useState<Boolean>(false);
  const [showLoading, setShowLoading] = useState<Boolean>(false);

  const clickSubmit = function() {
    formRef?.current?.submit();
  }

  const [uploadMode, setUploadMode] = useState<string>('user');
  const [aigcText, setAigcText] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<FormInstance>(null);
  const handler = useRef<any>()

  const confirmCb = function (blob: Blob) {
    setShowCropper(false);
    cropperBlob = blob;
    uploading = false;
  };

  const createSuccess = function () {
    setShowLoading(false);
    Toast.show({
      icon: "success",
      content: "created successfully",
    });
    setTimeout(() => {
      navigate({
        pathname: "/list",
      });
    }, 200);
  };

  const createFailed = function () {
    setShowLoading(false);
    Toast.show({
      icon: "fail",
      content: "Creation failed",
    });
  };

  const inputError = function () {
    Toast.show({
      icon: "fail",
      content: "Please fill in the message correctly",
    });
  };
  async function uploadFun(file: File) {
    console.log("file", file);
    fileName = file.name;
    fileType = file.type;
    const url = URL.createObjectURL(file);
    setCropperUrl(url);
    setShowCropper(true);
    uploading = true;
    await new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        if (!uploading) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    const newFile = new File([cropperBlob], fileName, { type: fileType });
    const newUrl = URL.createObjectURL(newFile);

    return { url: newUrl };
  }

  const onFinish = async (values: any) => {
    setShowLoading(true);
    console.log("finish", values);
    console.log(values.time, Math.floor(values.time.getTime() / 100));
    console.log("fileType", fileType);
    console.log("cropperBlob", cropperBlob, cropperBlob.size, cropperBlob.type);
    const newFile = new File([cropperBlob], fileName, { type: fileType });
    console.log("newFile", newFile);
    setCreatePercent(25);

    const metadata = await client
      .store({
        name: values.title,
        description: values.detail || "",
        image: newFile,
        location: values.address,
      })
      .catch((e: Error) => e);
    console.log("metadata:", metadata);
    setCreatePercent(50);
    if (!(metadata as any).ipnft) {
      return createFailed();
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await web3Provider.send("eth_requestAccounts", []);
    let signer = web3Provider.getSigner();
    // 0x3dea2B63093956728D72438c4cC0ED8386b98cA0
    const contract = new ethers.Contract(
      config.CONTRACT_ADRESS,
      IJunoabi,
      signer
    );
    // 会议名，会议缩写，metadata url，举办时间（秒级时间戳），人数限制，会议类型，票价
    console.log("before hold");
    const holdMeetingResp = await contract
      ?.HoldMeeting(
        values.title,
        values.shortTitle || "",
        `https://${(metadata as any).ipnft}.ipfs.nftstorage.link/metadata.json`,
        Math.floor(values.time.getTime() / 1000),
        Number(values.maxInvite),
        Number(values.type),
        Number(values.price)
      )
      .catch((e: Error) => e);
    console.log("holdMeetingResp", holdMeetingResp);
    setCreatePercent(75);

    if (!holdMeetingResp.wait) {
      return createFailed();
    }

    const holdResult = await holdMeetingResp.wait().catch((e: Error) => e);
    setCreatePercent(100);
    setShowLoading(false);
    if (holdResult.status !== undefined) {
      // success
      navigate("/list");
      createSuccess();
    } else {
      // failed
      createFailed();
    }
    // const event = holdResult.events.find((event: any) => event.event as string === "NewMeeting");
    console.log("event", holdResult);
    // const [from, ticketAddress] = event.args;
    // console.log(from, ticketAddress);
  };

  const genAiGc = async () => {
    deepai.setApiKey('32956a3c-7416-4d1d-8053-ae68223630e7');
    handler.current = Toast.show({
      content: 'generating...',
      icon: 'loading',
      duration: 0
    })
    try {
      var resp = await deepai.callStandardApi('text2img', {
        text: aigcText,
      });
      console.log(resp)
      const url = resp.output_url;
      handler.current.close();
      setCropperUrl(url);
      setShowCropper(true);
      uploading = true;
      await new Promise<void>((resolve, reject) => {
        const interval = setInterval(() => {
          if (!uploading) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
      fileType = 'image/jpeg'
      fileName=  `${dayjs().unix()}${Math.floor(Math.random()*10)}.jpg`;
      const newFile = new File([cropperBlob], fileName, { type: fileType });
      const newUrl = URL.createObjectURL(newFile);
      if (formRef.current) {
        // @ts-ignore: Unreachable code error
        formRef.current.setFieldValue('image', [{
          url: newUrl,
        }])
      }
      console.log(resp);
      // 生成图片
    } catch (e) {
      handler.current.close();
      setTimeout(() => {
        Toast.show({
          icon: 'error',
          content: 'please check your input',
        })
      }, 1000);
    }
  }
  return (
    <div className={styles.container} ref={ref}>
      <img src={createTicketBgImage} alt="" className={styles.bg} />
      <div className="create-ticket-form-wrap">
        <Form
          ref={formRef}
          name="form"
          onFieldsChange={d => console.log(d)}
          onFinish={onFinish}
          onFinishFailed={inputError}
          footer={
            <div onClick={clickSubmit} className={styles.buttonBox}>
              submit
            </div>
          }
        >
          <Form.Header>Please fill in the usage rules of the ticket</Form.Header>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="" style={{'--color': '#fff'}}  />
          </Form.Item>
          <Form.Item name="shortTitle" label="Symbol">
            <Input placeholder="" style={{'--color': '#fff'}}  />
          </Form.Item>

          <Selector
              columns={3}
              value={[uploadMode]}
              onChange={type => setUploadMode(type[0])}
              options={[
                { label: 'Upload', value: 'user' },
                { label: 'AIGC', value: 'aigc' }
              ]}
            />
            {
                            uploadMode === 'aigc' ? (
                              <div>
                                <Form.Item
                                  extra={
                                    <div className={styles.extraPart}>
                                      <a onClick={genAiGc}>Generate</a>
                                    </div>
                                  }
                                >
                                  <Input onChange={setAigcText} placeholder='input the text that generated image' clearable />
                                </Form.Item>
                                <Form.Item
                                  name="image"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please generate a face picture",
                                    },
                                  ]}
                                >
                                  <ImageUploader
                                    value={fileList}
                                    onChange={setFileList}
                                    upload={uploadFun}
                                    deletable={false}
                                    maxCount={1}
                                    imageFit="contain"
                                    showUpload={false}
                                    onCountExceed={(exceed) => {}}
                                  />
                                </Form.Item>
                              </div>
                            ) : (
                              <Form.Item
                                name="image"
                                label="Upload Image"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please upload a face picture",
                                  },
                                ]}
                              >
                                <ImageUploader
                                  value={fileList}
                                  onChange={setFileList}
                                  upload={uploadFun}
                                  maxCount={1}
                                  imageFit="contain"
                                  showUpload={fileList.length < 1}
                                  onCountExceed={(exceed) => {}}
                                />
                              </Form.Item>
                            ) 
            }

          <Form.Item
            name="time"
            label="Hold Time"
            trigger="onConfirm"
            onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
              datePickerRef.current?.open();
            }}
            rules={[
              {
                required: true,
                message: "Please select a event time",
              },
            ]}
          >
            <DatePicker precision="minute">
              {(value) => {
                return value
                  ? dayjs(value).format("YYYY-MM-DD HH:mm")
                  : "";
              }}
            </DatePicker>
          </Form.Item>
          <Form.Item
            name="address"
            label="Location"
            rules={[
              {
                required: true,
                message: "Please enter event location",
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="detail" label="Description">
            <TextArea maxLength={500} rows={3} showCount style={{'--color': '#fff'}}  />
          </Form.Item>
          <Form.Item
            name="type"
            label="Select your activite type"
            rules={[
              {
                required: true,
                message: "Please select a event type",
              },
            ]}
          >
                  <Selector
                    columns={2}
                    style={{
                      '--border-radius': '8px',
                      '--border': 'solid rgba(255, 255, 255, 0.5) 1px',
                      '--checked-border': 'solid #3E89DF 1px',
                      '--padding': '10px 24px',
                      '--color': 'transparent',
                      '--checked-color': 'rgba(90, 117, 255, 0.2)',
                      '--text-color': '#fff',
                      '--checked-text-color': '#fff'
                    }}
                    showCheckMark={false}
                    options={[
                      {
                        label: 'ordinary',
                        value: '1',
                      },
                      {
                        label: 'fission',
                        value: '2',
                      },
                      {
                        label: 'secret',
                        value: '3',
                      },
                      {
                        label: 'invite',
                        value: '4',
                      },
                    ]}
                    // defaultValue={['1']}
                  />
          </Form.Item>
          <Form.Item
            required
            rules={[
              {
                min: 0,
                type: "integer",
                transform(value) {
                  return Number(value);
                },
                message: "Enter an integer greater or equal than 0",
              },
            ]}
            name="price"
            label="Fare"
          >
            <Input
              placeholder="Enter an integer greater or equal than 0"
              type="integer"
              style={{'--color': '#fff'}} 
            />
          </Form.Item>
          <Form.Item
            required
            rules={[
              {
                min: 1,
                type: "integer",
                transform(value) {
                  return Number(value);
                },
                message: "Enter an integer greater than 0",
              },
            ]}
            name="maxInvite"
            label="total number of people"
          >
            <Input
              placeholder="Please enter the maximum number of invitees"
              type="integer"
              style={{'--color': '#fff'}} 
            />
          </Form.Item>
        </Form>
      </div>
      {showCropper ? (
        <ImageCrop confirmCb={confirmCb} url={cropperUrl}></ImageCrop>
      ) : null}
      {showLoading ? (
        <Mask>
          <div className={styles.loadingBox}>
            {/* <SpinLoading  style={{ '--size': '48px', alignSelf: 'center' }} ></SpinLoading>
             */}
            <ProgressCircle
              percent={createPercent}
              style={{
                "--track-width": "4px",
                "--size": "90px",
              }}
            >
              <span className={styles.loadingText}>{createPercent}%</span>
            </ProgressCircle>
          </div>
        </Mask>
      ) : null}
    </div>
  );
};

export default CreateTicket;
