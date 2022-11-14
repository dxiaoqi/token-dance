import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { useNavigate } from "react-router-dom";
import icon from './../../assert/icon.png';
import stores from '../../store';
import { handleAddress } from '../.././utils/ether';
import TickenCard from '../../components/tickenCard';
import { ethers } from 'ethers';
import { IJunoabi, INymphabi } from '../../utils/ether';
import { unitAndunique, } from '../../utils/list';
import Settings from '../../config/app';
import axios from 'axios';
import { resolve } from 'node:path/win32';
import { objType } from "../../types/index";


function List() {
  let navigate = useNavigate();
  const user = stores.user;
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  let uniqueMeetings: string[] = [];
  const [list, setList] = useState<objType[]>();

  const getTickensList = async () => {
    console.log("Settings.CONTRACT_ADRESS",Settings.CONTRACT_ADRESS);
    const contract = new ethers.Contract(Settings.CONTRACT_ADRESS, IJunoabi, web3Provider);
    const userAddress = user.userInfo.address;
    const holds = await contract.Holds(userAddress);
    const meetings = await contract.Meetings(userAddress);
    uniqueMeetings = unitAndunique(holds, meetings);
    getTicken();
  };

  const getTicken = async () => {
    const item = uniqueMeetings[0];
    // 创建票据合约  => INymphabi => 创建了票据的链接
    const contract = new ethers.Contract(item, INymphabi, web3Provider)
    // 获取ticket的ipfs地址
    const ipfsUri = await contract.tokenURI(1);
    // 去获取ticket的源信息
    const { data } = await axios.get(ipfsUri);
    // 获取ticket的举办时间
    const time = await contract?.HoldTime();
    // 获取票的主办者
    const owner = await contract?.owner();
    console.log("item111",item);
    setList([
      {
        ...data,
        time,
        owner,
        tickenAdress: item
      }
    ])
  }



  useEffect(() => {
    getTickensList();
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={icon} alt="avatar" />
        <div className={styles.address}>{handleAddress(user.userInfo.address)}</div>
      </div>
      <div className={styles.content}>
        {
          list && list.map((item,index) => <TickenCard item={item} key={index} />)
        }
      </div>
    </div>
  );
}

export default List;
