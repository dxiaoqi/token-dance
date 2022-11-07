import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserMultiFormatReader } from '@zxing/library'
import styles from './index.module.scss';
export default function ScanCode() {
    let num = 0
    let timer: any = null
    const [text, setText] = useState('');
    const codeReader = new BrowserMultiFormatReader()
    useEffect(() => {
        openScan()
        return () => {
            clearTimeout(timer)
            codeReader.reset()// 组件销毁时重置关闭摄像头
        }
    }, [])

    //调用摄像头
    function openScan() {
        codeReader.listVideoInputDevices().then((videoInputDevices) => {
            // 默认获取第一个摄像头设备id
            let firstDeviceId = videoInputDevices[0].deviceId
            const videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label)

            //调用后置摄像头
            if (videoInputDevices.length > 1) {
                // 判断是否后置摄像头
                if (videoInputDeviceslablestr.indexOf('back') > -1) {
                    firstDeviceId = videoInputDevices[0].deviceId
                } else {
                    firstDeviceId = videoInputDevices[1].deviceId
                }
            }

            decodeFromInputVideoFunc(firstDeviceId)
        }).catch(err => { // console.error(err);
        })

    }

    //开始扫码分析
    function decodeFromInputVideoFunc(firstDeviceId: string) {
        // firstDeviceId  为null 时默认选择面向环境的摄像头
        codeReader.decodeFromVideoDevice(firstDeviceId, 'video',
            async (result, err) => {
                if (result) { 
                    num++
                    localStorage.setItem('orderNo', (result as any).text) 
                    setText((result as any).text);      
                    if (num === 1) {
                        timer = setTimeout(() => {
                            num = 0
                            clearTimeout(timer)
                        }, 2500)
                    }
                }
                if (err) {
                    // console.error(err);
                }
            }
        )
    }

    const search = () => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        const selectedDeviceId = videoInputDevices[0].deviceId;

        codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
          if (result) {
            console.log(result);
          }
          if (err && !(err)) {
            console.error(err);
          }
        });
        console.log(`Started continous decode from camera with id ${selectedDeviceId}`);
      })
      .catch((err) => {
        console.error(err);
      });
    }
    return (
        <div className={styles.scancode}>
            <main>
                <div className={styles.code}>
                    <div className={styles.hengxian} />
                    <video  className={styles.vidoe} style={{ width: '100%' }} />
                </div>
            </main>
            {
              text
            }
            <footer>
                <div onClick={() => window.location.reload()}>重新扫描</div>
                <button onClick={search}>开始扫描</button>
            </footer>
            <video
                id="video"
                width="300"
                height="200"
            ></video>

        </div>
    )
}