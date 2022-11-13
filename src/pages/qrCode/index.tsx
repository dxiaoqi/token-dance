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
import { NFTStorage  } from 'nft.storage'

interface TicketInfo {
  description: string, 
  external_url: string, 
  image: string, 
  name: string,
  location: string
  time: string;
}
let req = {} as Etherabi
const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJERDdDNDljMzRjN0IxMDVGNDdDNzA0MDI3YTRkZDhBNEU3MzdiMDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODA2OTU4NDE1MCwibmFtZSI6InRva2VuLWRhbmNlLWlwZnMta2V5In0.7D7Ea8v2FqTHNxa_4AQA-VEzsGdPbvjvtiQF8Squ5Kk'
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
const Qr = () => {
  const search = querystring.parse(window.location.href.split('?')[1]);
  const cid = '0x5254D72BB5604D0Ddc916ed7A45306ca88f9DeCB'; //search.cid; // 用户信息，可以用来，不传默认打开自己的
  const tid = '0xd7a277E83F7bC2dC3fA21b80dA964651bEe5C3a4';//search.tid; // 票据信息
  const hid = search.hid; // 主办方的地址
  const mode = search.mode; // 票据详情 ticket 加入票据 mint 验证 sign
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false);
  const [uid, setUid] = useState('');
  const [info, setInfo] = useState<TicketInfo>();
  const [caninvite, setCanInvite] = useState(false);

  const [_canSign, setSign] = useState(false);

  const [_isSign, setIsSign] = useState(false);
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
    // cid 参赛人的id
    const url = window.location.origin + `/#/qrcode?mode=sign&tid=${tid}&cid=242442432`
    setTimeout(() => {
      if (ref.current) {
        genQr(ref.current, url);
      }
    }, 300)
  }
  const canInvite = async () => {
    // 判断当前用户是否可以邀请, 票id,当前id
    const can = await req?.CanInvite?.()
    console.log('可以邀请', can);
    setCanInvite(can as boolean);
  }
  const copy = () => {
    const url = window.location.origin + `/#/qrcode?mode=mint&tid=${tid}&cid=242442432`
    Dialog.alert({
      content: url,
      onConfirm: () => {
        console.log('Confirmed')
      },
    })
  }

  const canSign = async () => {
    const can = await req.CanSign?.(tid, cid);
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
    req?.Sign?.(tid);
    Toast.show({
      icon: 'success',
      content: '验证成功',
    })
    localStorage.setItem(`${cid}-${tid}`.toString().toLowerCase(), "true")
  }

  const _fissionMint = () => {
    // 加入
    req?._fissionMint?.((hid?.toString() || ''));
    Toast.show({
      icon: 'success',
      content: '加入成功，3s中后跳转首页',
    })
    setTimeout(() => {
      // 跳转首页
    }, 3000)

  }
  const initTicket = async () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts =await  web3Provider.send("eth_requestAccounts", []);
    const contract = new ethers.Contract((tid || '')?.toString(), INymphabi, web3Provider);
    const ipfsUri = await contract?.tokenURI?.(1)
    const { data } = await axios.get(ipfsUri)
    const time = await contract?.HoldTime();
    setInfo({
      ...data,
      time
    })
    setUid(accounts?.[0]);

    canInvite();
    canSign();
    isSign();
    console.log(data, time.toString(), accounts)
  //   initProvide().then(async ({ web3Provider }) => {
  //     if (web3Provider) {
  //       const contract = new ethers.Contract((tid || '')?.toString(), INymphabi, web3Provider);
  //       console.log(contract);
  //       req = contract as unknown as Etherabi;
  //       const ipfsUri = req?.tokenURI?.(0)
  //       const data = client.storeCar(ipfsUri);
  //       cons
  //       // setInfo({

  //       // })
  //         // const accounts =await  web3Provider.send("eth_requestAccounts", []);
  //         // user.setUser({ address: accounts[0] });
  //         // navigate("/list"); 
  //         getTicket();
  //     }
  // }).catch((err)=>{
  //     console.log("please install metamask");
  // })
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
            _canSign && <img onClick={gen} width={20} height={20} src={qrCode} alt="" />
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
        mode === 'sign' && _canSign && !_isSign && (
          <Button onClick={Sign} block color='primary' size='large'>
            Sign
          </Button>
        )
      }
      {
        // 可以加入&没有登记过
        mode === 'sign' && _canSign && _isSign && (
          "您已经登记过了"
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