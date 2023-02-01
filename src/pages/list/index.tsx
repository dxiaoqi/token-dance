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
import { Admin__factory } from '../../utils/typechain-types'

function List() {
  let navigate = useNavigate();
  const user = stores.user;
  const userAddress =
    user.userInfo.address || localStorage.getItem("walletAddress");
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  let uniqueMeetings: string[] = [];
  const [list, setList] = useState<objType[]>();
  const [isInWhiteList, setIsInWhiteList] = useState(false);

  const getTickensList = async () => {
    const contract = new ethers.Contract(
      Settings.CONTRACT_ADRESS,
      IJunoabi,
      web3Provider
    );

    const meetings = await contract.Meetings(userAddress);
    getTicken(meetings);
  };

  const getTicken = async (arr: string[]) => {
    const dataArr: objType[] = [];
    const fetchContractInfo = async (item: string) => {
      const contract = new ethers.Contract(item, INymphabi, web3Provider);
      // 获取ticket的ipfs地址
      const ipfsUri = await contract.tokenURI(1);
      const [{ data }, time, owner] = await Promise.all([
        axios.get(ipfsUri),
        contract?.HoldTime(),
        contract?.owner(),
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
    getTickensList();
  }, []);

  const getWhiteList = async () => {
    const contract = new ethers.Contract(
      Settings.CONTRACT_ADRESS,
      INymphabi,
      web3Provider
    );
    console.log("userAddress",userAddress);
    const isWhite = await contract.isInWhite(userAddress);
    setIsInWhiteList(isWhite);
  };

  useEffect(() => {
    getWhiteList();
  }, []);

  const copyData = async () => {
    const copyData =
      user.userInfo.address || localStorage.getItem("walletAddress");

    try {
      await navigator.clipboard.writeText(copyData as string);
      Toast.show({
        icon: "success",
        content: "复制成功!",
      });
    } catch (err) {
      Toast.show({
        icon: "fail",
        content: "复制失败!",
      });
    }
  };

  const mintTicken = () => {
    navigate("/createticket");
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
   const _ = Admin__factory.connect( "0x4004B559eB1A1C92bd9168aACd7819E352420E6a", web3Provider);
   _.eventsForUser().then((d: any) =>  {
    console.log(d);
   }).catch(() => {
    console.log("errr");
   })
  }, []);
  return (
    <div className={styles.container}>
      {isInWhiteList && (
        <Button
          color="primary"
          fill="outline"
          className={styles.createBtn}
          onClick={mintTicken}
        >
          MINT TICKEN
        </Button>
      )}
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={InviteAvatar} alt="" />
          <img src={Avatar} alt="" />
        </div>
        {user.userInfo.address ? (
          <div onClick={copyData} className={styles.address}>
            {handleAddress(user.userInfo.address)}
          </div>
        ) : (
          <div onClick={copyData} className={styles.address}>
            {handleAddress(localStorage.getItem("walletAddress") as string)}
          </div>
        )}
      </div>
      <div className={styles.content}>
        {list &&
          list.map((item, index) => <TickenCard item={item} key={index} />)}
      </div>
    </div>
  );
}

export default List;
