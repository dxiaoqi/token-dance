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
import dayjs from 'dayjs'
import styles from './index.module.scss';
import Icon from'../../assert/icon.png';
import Where from '../../assert/where.png'
import When from '../../assert/when.png'
import { timeColumns } from './pickerData'
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker'
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'

const Qr = () => {
  const [pickerVisible, setPickVisible] = useState(false);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([])
  const ref = useRef<HTMLDivElement>(null)

  async function sleep(time: number) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => resolve(), time);
    })
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
  const onFinish = (values: Object) => {
    console.log('finish', values)
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
            upload={mockUpload}
            maxCount={1}
            showUpload={fileList.length < 1}
            onCountExceed={exceed => {
              // Toast.show(`最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`)
            }}
          />
        </Form.Item>

        <Form.Item
          name='birthday'
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
          {/* <Picker
            style={{
              // '--title-font-size': '13px',
              // '--header-button-font-size': '13px',
              // '--item-font-size': '13px',
              // '--item-height': '30px',
            }}
            // defaultValue={['Wed', 'pm']}
            columns={timeColumns}
            visible={pickerVisible}
            onClose={() => {
              setPickVisible(false)
            }}
          /> */}

          <DatePicker
            precision='minute'
          >
            {value => {
              // if(value) {
              //   setPickVisible(true) 
              // }

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
        <Form.Item name='detail' label='会议描述'>
          <TextArea
            maxLength={500}
            rows={3}
            showCount
          />
        </Form.Item>
        <Form.Item name='type' label='选择会议类型'>
            <Radio.Group defaultValue='0'>
              <Space direction='vertical'>
                <Radio value='0'>普通会议</Radio>
                <Radio value='1'>裂变会议</Radio>
                <Radio value='2'>秘密会议</Radio>
                <Radio value='3'>邀请会议</Radio>
              </Space>
            </Radio.Group>
          {/* <Selector
            columns={1}
            // multiple
            options={[
              { label: '普通会议', value: '0' },
              { label: '裂变会议', value: '1' },
              { label: '秘密会议', value: '2' },
              { label: '邀请会议', value: '3' },
            ]}
          /> */}
        </Form.Item>
        {/* <Form.Item name='slider-demo' label='滑块选择'>
          <Slider ticks step={10} />
        </Form.Item> */}
        <Form.Item
          // initialValue={1}
          rules={[
            {
              // max: 5,
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

          {/* <Stepper /> */}
        </Form.Item>
        <Form.Item
          // initialValue={1}
          rules={[
            {
              // max: 5,
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

          {/* <Stepper /> */}
        </Form.Item>
      </Form>
    </div>)
}

export default Qr;