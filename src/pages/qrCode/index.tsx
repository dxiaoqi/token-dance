import { useEffect, useRef } from 'react';
import { genQr } from '../../utils/qrcode';
import styles from './index.module.scss';
import Icon from'../../assert/icon.png';
import Where from '../../assert/where.png'
import When from '../../assert/when.png'
import InviteAvatar from '../../assert/invite_avatar.png';
import Avatar from '../../assert/invite-avatar.png';
import InviteBtn from '../../assert/invite-btn.png';
import { Dialog } from 'antd-mobile';
const Qr = () => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    console.log((window as any).QrCode)
  }, [])
  const gen = () => {
    if (ref.current)
    genQr(ref.current, '其实我们都知道')
  }
  const canInvite = () => {
    // 判断当前用户是否可以邀请
    //  CanInvite(ticketAddress address,invitorAddress address) public view returns(bool);
    return true;
  }
  const copy = () => {
    Dialog.alert({
      content: '人在天边月上明',
      onConfirm: () => {
        console.log('Confirmed')
      },
    })
  }
  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.header}>
        <img width={100} height={100} src={Icon} alt="" />
        <div>
          <h1>Token Dance</h1>
          <p>
            111
          </p>
        </div>
      </div>
      <div className={styles.meetInfo}>
        <div style={{ marginBottom: '12px'}} className={styles.infoItem}>
          <label>
            <img width={21} height={21} src={Where} alt="" />
            Where
          </label>
          <span>
              这是一个地方
          </span>
        </div>

        <div className={styles.infoItem}>
          <label>
            <img width={21} height={21} src={When} alt="" />
            When
          </label>
          <span>
              这是一个地方
          </span>
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.tokenInfo}>
        <p>
          <label>主链</label><span>-</span>
        </p>
        <p>
          <label>主链</label><span>-</span>
        </p>
        <p>
          <label>主链</label><span>-</span>
        </p>
        <p>
          <label>主链</label><span>-</span>
        </p>
        <p>
          <label>主链</label><span>2</span>
        </p>
      </div>
      <div className={styles.line}></div>

      <div className={styles.invite}>
        {
          [11,22].map(e => (
            <div className={styles.avatar}>
              <img src={InviteAvatar} alt="" />
              <img src={Avatar} alt="" />
            </div>
          ))
        }
      </div>
      <div onClick={copy} className={styles.btn}>
        <img width={200} src={InviteBtn} alt="" />
      </div>
    </div>)
}

export default Qr;