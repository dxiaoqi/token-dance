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
import { Etherabi } from '../../types/index'
import { initProvide, INymphabi } from '../../utils/ether';
import { BigNumber, ethers } from 'ethers';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
interface TicketInfo {
  description: string, 
  external_url: string, 
  image: string, 
  name: string,
  location: string
  time: string;
  owner: string;
}
let req = {} as Etherabi
let uid = ''
let signer = {} as any;

const Qr = () => {
  const search = querystring.parse(window.location.href.split('?')[1]);
  const cid: string = search?.cid as string || '0x5254D72BB5604D0Ddc916ed7A45306ca88f9DeCB'; //search.cid; // 参会人信息
  const tid: string = search?.tid as string || '0x7eEC270e6ddAF482ada1453f501CB5CBE9A511Eb'//'0xd7a277E83F7bC2dC3fA21b80dA964651bEe5C3a4';//search.tid; // 票据信息
  const hid: string = search?.hid as string || '0xd5c8A05d1CdA1caA4956D4AAaE94C6632FC19fc0' //search.hid; // 主办方的地址
  const mode = search.mode; // 票据详情 ticket 加入票据 mint 验证 sign
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<TicketInfo>();
  const [caninvite, setCanInvite] = useState(false);

  const [_canSign, setSign] = useState(false);

  const [_isSign, setIsSign] = useState(false);

  const [_mint, setCanMint] = useState(false);
  let navigate = useNavigate();
  const gen = () => {
    setVisible(true);
    // cid 参赛人的id
    const url = window.location.origin + `/#/qrcode?mode=sign&tid=${tid}&cid=${uid}`
    console.log(url)
    setTimeout(() => {
      if (ref.current) {
        genQr(ref.current, url);
      }
    }, 300)
  }
  const canInvite = async () => {
    // 判断当前用户是否可以邀请, 票id,当前id
    const can = await req?.CanInvite?.()
    console.log('可以邀请', can, req);
    setCanInvite(can as boolean);
  }
  const copy = () => {
    const url = window.location.origin + `/#/qrcode?mode=mint&tid=${tid}&cid=${uid}&hid=${uid}`
    Dialog.alert({
      content: <p style={{ padding: '10px', wordBreak: 'break-all'}}>{url}</p>,
      onConfirm: () => {
        console.log('Confirmed')
      },
    })
  }

  const canSign = async () => {
    const can = await req.CanSign?.(cid);
    console.log('可以登录', can, req);
    setSign(can as boolean);
  }
  const isSign = async () => {
    const status = localStorage.getItem(`${cid}-${tid}`.toString().toLowerCase()) === "true";
    if (status) {
      // 已登记
      setIsSign(true);
      return true;
    }
    // return IsSign 参赛者id
    const can = await req?.IsSign?.(cid);
    setIsSign(can as boolean);
  }
  const Sign =() => {
    // 验证 Sign(cid)
    signer?.Sign?.(cid).then((d: number) => {
      Toast.show({
        icon: 'success',
        content: '验证成功',
      })
      localStorage.setItem(`${cid}-${tid}`.toString().toLowerCase(), "true")
    }).catch((err: any) => {
      console.log(err);
      Toast.show({
        icon: 'error',
        content: '验证失败'
      })
    })
  }
  const canMint = async () => {
    const can = await req?.balanceOf?.(uid);
    console.log('是否mint', can?.toString());
    setCanMint(Number(can?.toString()) === 0);
  }
  const _fissionMint = () => {
    // 加入
    console.log(signer._fissionMint)
    signer?._fissionMint?.(hid).then(() => {
      Toast.show({
        icon: 'success',
        content: '加入成功，3s中后跳转首页',
      })
      setTimeout(() => {
        // 跳转首页
        navigate("/list"); 
      }, 3000)
    }).catch((err: any) => {
      Toast.show({
        icon: 'error',
        content: 'mint error, please try again',
      })
    })

  }
  const initTicket = async () => {
    if (!window.ethereum) {
      Toast.show({
        icon: 'error',
        content: 'Please install MetaMask!'
      })
      return;
    }
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts =await  web3Provider.send("eth_requestAccounts", []);
    console.log(accounts)
    const contract = new ethers.Contract((tid || '')?.toString(), INymphabi, web3Provider);
    req = contract as unknown as Etherabi;
    signer = web3Provider.getSigner();
    signer = contract.connect(signer);

    // 获取ticket的ipfs地址
    const ipfsUri = await contract?.tokenURI?.(1)
    // 去获取ticket的源信息
    const { data } = await axios.get(ipfsUri)
    // 获取ticket的举办时间
    const time = await contract?.HoldTime();
    // 获取票的主办者
    const owner = await contract?.owner();
    setInfo({
      ...data,
      time,
      owner
    })
    uid = accounts?.[0];
    await canInvite();
    await canSign();
    await isSign();
    await canMint();
    console.log(accounts)
  }
  useEffect(() => {
    // 链接钱包地址，根据当前用户拉票据信息
    initTicket();
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img width={100} height={100} src={Icon} alt="" />
        <div>
          <div className={styles.title}><h1>{info?.name || "Token Dance"}</h1> 
          {
            _canSign && mode === 'ticket' && <img onClick={gen} width={20} height={20} src={qrCode} alt="" />
          }
          </div>
          <p>
           {info?.description}
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
              {info?.location}
          </span>
        </div>

        <div className={styles.infoItem}>
          <label>
            <img width={21} height={21} src={When} alt="" />
            When
          </label>
          <span>
              {info?.time && dayjs.unix(Number(info.time)).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.tokenInfo}>
        <p>
          <label>Creator</label><span className={styles.elc}>{info?.owner || '-'}</span>
        </p>
        <p>
          <label>Token Standard</label><span>ERC721</span>
        </p>
        <p>
          <label>Asset contract</label><span>Nymph</span>
        </p>
        <p>
          <label style={{ wordBreak: 'keep-all', width: '113px'}}>Token id</label><span className={styles.elc}>{tid}</span>
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
      <div className={styles.footer}>
        {
          mode === 'mint' && _mint && (
            <Button onClick={_fissionMint} block color='primary' size='large'>
              Mint
            </Button>
          )
        }
        {
          // 可以加入&没有登记过
          mode === 'sign' && _canSign && !_isSign && (
            <Button onClick={Sign} block color='primary' size='large'>
              Sign
            </Button>
          )
        }
        {
          // 可以加入&没有登记过
          mode === 'sign' && _canSign && _isSign && (
            <p className={styles.signTip}>您已经登记过了</p>
          )
        }
        {
          mode === 'ticket' && caninvite && (
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
      </div>
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