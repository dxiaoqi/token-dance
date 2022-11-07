import { useEffect, useRef } from 'react';
import { genQr } from '../../utils/qrcode';
import styles from './index.module.scss';
import Icon from'../../assert/icon.png';
import Where from '../../assert/where.png'
import When from '../../assert/when.png'
const Qr = () => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    console.log((window as any).QrCode)
  }, [])
  const gen = () => {
    if (ref.current)
    genQr(ref.current, '其实我们都知道')
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
        <div className={styles.add}>
          invite
        </div>
        <div className={styles.add}>
          invite
        </div>
      </div>
      <p className={styles.tip}>
      You can click the invite button to invite 2 people to the conference
      </p>
    </div>)
}

export default Qr;