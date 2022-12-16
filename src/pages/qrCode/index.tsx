import { useEffect, useRef, useState } from "react";
import querystring from "query-string";
import { genQr } from "../../utils/qrcode";
import styles from "./index.module.scss";
import Icon from "../../assert/icon.png";
import Where from "../../assert/where.png";
import When from "../../assert/when.png";
import InviteAvatar from "../../assert/invite_avatar.png";
import Avatar from "../../assert/invite-avatar.png";
import InviteBtn from "../../assert/invite-btn.png";
import qrCode from "../../assert/qrcode.png";
import { Button, Dialog, Toast, Modal } from "antd-mobile";
import { Etherabi } from "../../types/index";
import { langMap } from '../../utils/help'
import { initProvide, INymphabi } from "../../utils/ether";
import CosmoTool from "../../utils/cosmo/main"
import { Meeting, tokenURI, isInWhite, HoldTime, isOwner, init,  CanInvite, CanSign, IsSign, toSign, balanceOf, fissionMint, tokenIdOf, isSignMan } from '../../utils/plug'
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import dayjs from "dayjs";
import i18n from '../../i18n';
import { useNavigate } from "react-router-dom";
interface TicketInfo {
  en_description: string;
  description: string;
  external_url: string;
  image: string;
  name: string;
  en_name: string;
  location: string;
  en_location: string;
  time: string;
  owner: string;
}
let req = {} as Etherabi;
let uid = "";
let signer = {} as any;
let showQr = false;
const Qr = () => {
  const search = querystring.parse(window.location.href.split("?")[1]);
  const cid: string =
    (search?.cid as string) || "0x5254D72BB5604D0Ddc916ed7A45306ca88f9DeCB"; //search.cid; // 参会人信息
  const tid: string =
    (search?.tid as string) || "0x7eEC270e6ddAF482ada1453f501CB5CBE9A511Eb"; //'0xd7a277E83F7bC2dC3fA21b80dA964651bEe5C3a4';//search.tid; // 票据信息
  const hid: string =
    (search?.hid as string) || "0xd5c8A05d1CdA1caA4956D4AAaE94C6632FC19fc0"; //search.hid; // 主办方的地址
  const mode = search.mode; // 票据详情 ticket 加入票据 mint 验证 sign
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<TicketInfo>();
  const [caninvite, setCanInvite] = useState(false);
  const [_canSign, setSign] = useState(false);

  const [_isSign, setIsSign] = useState(false);

  const [_mint, setCanMint] = useState(false);
  const [_canSigner, setCanSign] = useState(false);
  const [tokenId, setTokenId] = useState('');
  let navigate = useNavigate();
  const gen = () => {
    setVisible(true);
    // cid 参赛人的id
    const url =
      window.location.origin + `/v2/#/qrcode?mode=sign&tid=${tid}&cid=${uid}`;
    console.log(`${JSON.stringify({ data: url })}`);
    setTimeout(() => {
      if (ref.current && !showQr) {
        genQr(ref.current, url);
        showQr = true;
      }
    }, 1000);
  };
  const canInvite = async () => {
    // 判断当前用户是否可以邀请, 票id,当前id
    const can = await CanInvite(tid);
    console.log("可以邀请", can, req);
    setCanInvite(can as any);
  };
  const copy = () => {
    const url =
      window.location.origin + window.location.pathname +
      `#/qrcode?mode=mint&tid=${tid}&cid=${uid}&hid=${uid}`;
    Dialog.alert({
      content: <p style={{ padding: "10px", wordBreak: "break-all" }}>{url}</p>,
      confirmText: i18n.t("qrcode.close"),
      onConfirm: () => {
        console.log("Confirmed");
      },
    });
  };

  const canSign = async () => {
    const can = await CanSign(tid, cid);
    console.log("可以签到", can, req);
    setSign(true);
  };
  const isSign = async () => {
    const status =
      localStorage.getItem(`${cid}-${tid}`.toString().toLowerCase()) === "true";
    if (status) {
      // 已登记
      setIsSign(true);
      return true;
    }
    // return IsSign 参赛者id
    const can = await IsSign(tid, cid);
    console.log(666, can);
    setIsSign(can as any);
    return can;
  };
  const Sign = () => {
    // 验证 Sign(cid)
    toSign(tid, cid)
      .then(() => {
        Toast.show({
          icon: "success",
          content: i18n.t('qrcode.success'),
        });
        localStorage.setItem(`${cid}-${tid}`.toString().toLowerCase(), "true");
        setIsSign(true);
      })
      .catch((err: any) => {
        console.log(err);
        Toast.show({
          icon: "error",
          content: i18n.t("qrcode.error"),
        });
      });
  };
  const canMint = async () => {
    const can = await balanceOf(tid, uid);
    console.log("是否mint", can?.toString());
    setCanMint(Number(can?.toString()) === 0);
  };
  const _fissionMint = () => {
    // 加入
    console.log("fission mint hid", hid);
    console.log("signer address", signer.address);
    fissionMint(tid, hid)
      .then(() => {
        Toast.show({
          icon: "success",
          content: i18n.t("qrcode.joinSuccess"),
        });
        // setTimeout(() => {
        //   // 跳转首页
        //   navigate("/list");
        // }, 3000);
      })
      .catch((err: any) => {
        Toast.show({
          icon: "error",
          content: i18n.t("qrcode.joinError"),
        });
      });
  };
  const initTicket = async () => {
    setTimeout(async () => {
      let accounts =  await CosmoTool.getAccount();
      if (!accounts) {
        await init()
      }
      accounts =  await CosmoTool.getAccount();
      console.log(accounts);
      uid = accounts || '';
      // 获取ticket的ipfs地址
      const ipfsUri = await tokenURI(tid);
      // 去获取ticket的源信息
      const { data } = await axios.get(ipfsUri as any);
      // 获取ticket的举办时间
      const time = await HoldTime(tid);
      // 获取票的主办者
      const owner = await isOwner(tid);

      console.log(data);
      const nftId = await tokenIdOf(tid);

      const signer = await isSignMan(tid);
      setTokenId(nftId as any);
      setCanSign(signer as any);
      setInfo({
        ...data,
        time,
        owner,
      });
      await canInvite();
      await canSign();
      await isSign();
      await canMint();
      console.log(CosmoTool.addressForBech32ToHex(uid || ''));
    }, 3000)
  };
  useEffect(() => {
    // 链接钱包地址，根据当前用户拉票据信息
    async function _init() {
      await initTicket();
      getSignStatus();
    }
    _init();
  }, []);

  const getSignStatus = async () => {
    if (mode === "ticket" && !_isSign) {
      let res = await isSign();
      if (!res) {
        getSignStatus();
      }
    }
  };

  const renderImg = (image: string) => {
    if (image.startsWith("ipfs://")) {
      const idReg = /\/\/.*\//g;
      const match = image!.match(idReg);
      if (match) {
        const idMatch = match[0];
        const id = idMatch.slice(2, idMatch.length - 1);
        const nameIndex = image.lastIndexOf("/");
        const name = image.slice(nameIndex + 1);
        return `https://${id}.ipfs.nftstorage.link/${name}`;
      }
    }
    return image;
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
      <h1>{info?.[`${langMap()}name`]}</h1>
        {_isSign && <div className={styles.written}>{i18n.t("qrcode.writeOff")}</div>}
        <div className={styles.ticket_bg}>
            {_canSign && !_isSign && mode === "ticket" && (
              <img className={styles.qrc} onClick={gen} width={20} height={20} src={qrCode} alt="" />
            )}
          <img style={{ width: '100%' }} src={info?.image && renderImg(info?.image)} alt="" />
        </div>
        <div>
          {/* <div className={styles.title}>
            {_canSign && !_isSign && mode === "ticket" && (
              <img onClick={gen} width={20} height={20} src={qrCode} alt="" />
            )}
          </div> */}
          <p style={{ marginTop: '8px', fontSize: '14px'}}>{info?.[`${langMap()}description`]}</p>
        </div>
      </div>
      <div className={styles.meetInfo}>
        <div style={{ marginBottom: "12px" }} className={styles.infoItem}>
          <label>
            <img width={21} height={21} src={Where} alt="" />
            {i18n.t("qrcode.where")}
          </label>
          <span>{info?.[`${langMap()}location`]}</span>
        </div>

        <div className={styles.infoItem}>
          <label>
            <img width={21} height={21} src={When} alt="" />
            {i18n.t("qrcode.when")}
          </label>
          <span>
            {info?.time &&
              dayjs.unix(Number(info.time)).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.tokenInfo}>
        <p>
          <label>Creator</label>
          <span className={styles.elc}>{info?.owner || "-"}</span>
        </p>
        {/* <p>
          <label>Token Standard</label>
          <span>ERC721</span>
        </p>
        <p>
          <label>Asset contract</label>
          <span>Nymph</span>
        </p> */}
        <p>
          <label style={{ wordBreak: "keep-all", width: "113px" }}>
            Token id
          </label>
          <span className={styles.elc}>{tokenId}</span>
        </p>
        {mode === "sign" && (
          <p>
            <label style={{ wordBreak: "keep-all", width: "113px" }}>
              User id
            </label>
            <span className={styles.elc}>{cid}</span>
          </p>
        )}
      </div>
      <div className={styles.line}></div>
      {/* {mode === "ticket" && (
        <div className={styles.invite}>
          {[11, 22].map((e) => (
            <div className={styles.avatar}>
              <img src={InviteAvatar} alt="" />
              <img src={Avatar} alt="" />
            </div>
          ))}
        </div>
      )} */}
      <div className={styles.footer}>
        {mode === "mint" && _mint && (
          <Button onClick={_fissionMint} block color="primary" size="large">
            {i18n.t("qrcode.getIt")}
          </Button>
        )}
        {
          // 可以加入&没有登记过
          mode === "sign" && _canSign && !_isSign && (_canSigner) && (
            <Button onClick={Sign} block color="primary" size="large">
              {i18n.t("qrcode.writeOff")}
            </Button>
          )
        }
        {
          // 可以加入&没有登记过
          mode === "sign" && _canSign && _isSign && (
            <p className={styles.signTip}>
              {i18n.t("qrcode.Registered")}
            </p>
          )
        }
        {/* {mode === "ticket" && caninvite && (
          <Button onClick={copy} block color="primary" size="large">
            {i18n.t("qrcode.invite")}
          </Button>
        )} */}
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
          width: 300,
        }}
        content={<div ref={ref}></div>}
        closeOnAction
        onClose={() => {
          setVisible(false);
        }}
        closeOnMaskClick={true}
        actions={[
          {
            key: "confirm",
            text: i18n.t("qrcode.close"),
          },
        ]}
      />
    </div>
  );
};

export default Qr;
