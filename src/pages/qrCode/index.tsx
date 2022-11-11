import { useEffect, useRef, useState } from 'react';
import querystring from 'query-string'
import { genQr } from '../../utils/qrcode';
import styles from './index.module.scss';
import Icon from'../../assert/icon.png';
import Where from '../../assert/where.png'
import When from '../../assert/when.png'
import InviteAvatar from '../../assert/invite_avatar.png';
import Avatar from '../../assert/invite-avatar.png';
import InviteBtn from '../../assert/invite-btn.png';
import qrCode from '../../assert/qrcode.png';
import { Button, Dialog, Toast } from 'antd-mobile';
const Qr = () => {
  //  合并
  const search = querystring.parse(window.location.href.split('?')[1]);
  const cid = search.cid; // 用户信息，可以用来，不传默认打开自己的
  const tid = search.tid; // 票据信息
  const mode = search.mode; // 票据详情 ticket 加入票据 mint 验证 sign
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false);
  const getTicket = () => {
    // 拉取票据信息
    return {
      name: '会议名称',
      metaInfo: {
        address: '',
        decs: ''
      },
      holdTimestampInSecord: Date.now()
    }
  }
  const gen = () => {
    setVisible(true);
    setTimeout(() => {
      if (ref.current) {
        genQr(ref.current, '其实我们都知道')
      }
    }, 300)
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

  const canSign = () => {
    return false
  }
  const isSign = () => {
    const status = localStorage.getItem(`${cid}-${tid}`.toString().toLowerCase()) === "true";
    if (status) {
      // 已登记
      return true;
    }
    // return IsSign
    return true;
  }
  const Sign =() => {
    // 验证 Sign(cid)
    Toast.show({
      icon: 'success',
      content: '验证成功',
    })
    localStorage.setItem(`${cid}-${tid}`.toString().toLowerCase(), "true")
  }

  const _fissionMint = () => {
    // 加入
    Toast.show({
      icon: 'success',
      content: '加入成功，3s中后跳转首页',
    })
    setTimeout(() => {
      // 跳转首页
    }, 3000)

  }
  useEffect(() => {
    // 根据当前用户拉票据信息
    getTicket();
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img width={100} height={100} src={Icon} alt="" />
        <div>
          <div className={styles.title}><h1>Token Dance</h1> 
          {
            canSign() && <img onClick={gen} width={20} height={20} src={qrCode} alt="" />
          }
          </div>
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
      {
        mode === 'mint' && (
          <Button onClick={_fissionMint} block color='primary' size='large'>
            Mint
          </Button>
        )
      }
      {
        // 可以加入&没有登记过
        mode === 'sign' && canSign() && !isSign() && (
          <Button onClick={Sign} block color='primary' size='large'>
            Sign
          </Button>
        )
      }
      {
        // 可以加入&没有登记过
        mode === 'sign' && canSign() && isSign() && (
          "您已经登记过了"
        )
      }
      {
        mode === 'invite' && canInvite() && (
          <Button onClick={copy} block color='primary' size='large'>
            Invite
          </Button>
        )
      }
      {/* {
        canInvite() && (
          <div onClick={copy} className={styles.btn}>
            <img width={200} src={InviteBtn} alt="" />
          </div>
        )
      } */}
      <Dialog
        visible={visible}
        style={{
          width: 300
        }}
        content={
          <div ref={ref}>

          </div>
        }
        closeOnAction
        onClose={() => {
          setVisible(false)
        }}
        actions={[
          {
            key: 'confirm',
            text: 'close',
          },
        ]}
      />
    </div>)
}

export default Qr;