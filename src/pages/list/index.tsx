import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import icon from "./../../assert/icon.png";
import stores from "../../store";
import { handleAddress } from "../.././utils/ether";
import TickenCard from "../../components/tickenCard";
import { ethers } from "ethers";
import { IJunoabi, INymphabi } from "../../utils/ether";
import { unitAndunique } from "../../utils/list";
import Settings from "../../config/app";
import axios from "axios";
import { resolve } from "node:path/win32";
import { objType } from "../../types/index";
import InviteAvatar from "../../assert/invite_avatar.png";
import Avatar from "../../assert/invite-avatar.png";
import { Divider, Toast, Button } from "antd-mobile";
import { Meeting, tokenURI, isInWhite, HoldTime, isOwner, init} from '../../utils/plug';
import i18n from '../../i18n';

function List() {
  let navigate = useNavigate();
  const user = stores.user;
  const [curAddress, setCurrentAddress] = useState('');
  let uniqueMeetings: string[] = [];
  const [list, setList] = useState<objType[]>();
  const [isInWhiteList, setIsInWhiteList] = useState(false);

  const getTickensList = async () => {
    const meetings = await Meeting();
    getTicken(meetings as any);
  };

  const getTicken = async (arr: string[]) => {
    const dataArr: objType[] = [];
    const fetchContractInfo = async (item: string) => {
      // 获取ticket的ipfs地址
      const ipfsUri = await tokenURI(item);
      const [{ data }, time, owner] = await Promise.all([
        axios.get(ipfsUri as any),
        HoldTime(item),
        isOwner(item),
      ]);
      dataArr.push({
        ...data,
        time,
        owner,
        tickenAdress: item,
      });
    };
    const fetchList: Promise<void>[] = [];
    for (let item of arr) {
      fetchList.push(fetchContractInfo(item));
    }
    await Promise.all(fetchList);

    setList(dataArr.slice());
  };

  useEffect(() => {
    setTimeout(() => {
      init().then((d: string | null) => {
        setCurrentAddress(d || '');
        getTickensList();
      })
    }, 3000)
  }, []);

  const getWhiteList = async () => {
    const isWhite = await isInWhite();
    setIsInWhiteList(isWhite as any);
  };

  useEffect(() => {
    getWhiteList();
  }, []);

  const copyData = async () => {
    const copyData = curAddress;

    try {
      await navigator.clipboard.writeText(copyData as string);
      Toast.show({
        icon: "success",
        content: i18n.t('list.copySuccess'),
      });
    } catch (err) {
      Toast.show({
        icon: "fail",
        content: i18n.t('list.copyFailure'),
      });
    }
  };

  const mintTicken = () => {
    navigate("/createticket");
  };

  return (
   <div className={styles.containerWrapper}>
    <div className={styles.container}>
      {isInWhiteList && (
        <Button
          color="primary"
          fill="outline"
          className={styles.createBtn}
          onClick={mintTicken}
        >
          {i18n.t('list.publish')}
        </Button>
      )}
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={InviteAvatar} alt="" />
          <img src={Avatar} alt="" />
        </div>
        {curAddress ? (
          <div onClick={copyData} className={styles.address}>
            {handleAddress(curAddress)}
          </div>
        ) : (
          <div onClick={copyData} className={styles.address}>
            {handleAddress(curAddress || '')}
          </div>
        )}
      </div>
      <div className={styles.content}>
        {list &&
          list.map((item, index) => <TickenCard item={item} key={index} />)}
      </div>
    </div>
    </div>
  );
}

export default List;
