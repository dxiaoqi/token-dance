import React, { useEffect, useState } from 'react';
import { initProvide } from '../../utils/ether';
import CosmoTool from '../../utils/cosmo/main';
import { init } from '../../utils/plug'
import { Button, Modal, Toast } from 'antd-mobile';
import { useNavigate } from "react-router-dom";
import styles from './index.module.scss';
import icon from '.././../assert/icon.png';
import twitter from '../../assert/twitter.png';
import discord from '../../assert/discord.png';
import avatar from '../../assert/avatar.png';
import { observer } from 'mobx-react';
import stores from '../../store';
import i18n from '../../i18n';
import wheelImg from ".././../assert/music/drive.png";
// import cosmo from 'cosmo-wallet-tool';
// i18n.t('home.title')

function App() {
  let navigate = useNavigate();
  const user = stores.user;

  useEffect(() => {
    initProvide()
      .then((con) => {
        console.log("初始合约", con);
      })
      .catch(() => { });
  }, []);

  const gotoConnect = () => {
    navigate("/connect");
  };

  const connectButton = async () => {
    init().then(async (address) => {
      if (address) {
        user.setUser({ address: address });
        localStorage.setItem("walletAddress", address);
        Modal.clear();
        navigate("/list");
      }
    }).catch((err) => {
    })
  };
  console.log(i18n)

  return (
    <div className={styles.container}>
      <div className={styles.logoImages}></div>
      <div className={styles.titleImages}></div>
      {/* <div className={styles.wheelImages}></div> */}
      <div className={styles.wheelImageWrap}>
        <img src={wheelImg} className={styles.wheelImage}></img>
      </div>
      <div className={styles.tickenIntro}>
        <div className={styles.tickenIntroTitle}>{`Ticken是一款结合了NFT社交游戏的票务工具产品,在这里：`}</div>
        <ul className={styles.tickenIntroContent}>
          <li className={styles.tickenIntroItem}>票即NFT: 人人科创</li>
          <li className={styles.tickenIntroItem}>AIGC联动: 新潮玩法</li>
          <li className={styles.tickenIntroItem}>WEB3社交: 灵魂绑定</li>
          <li className={styles.tickenIntroItem}>开放协议: 无限可能</li>
        </ul>
      </div>
      <div className={styles.plugChainIntro}>
        PlugChain是一条高并发性、低Gas费、易拓展性为
        核心优势的Web3公链，通过构建聚合式跨链预言机
        协议，致力于高性能信息数据交互的应用场景。
      </div>
      <div className={styles.btnWrap}>
        <div>111</div>
        <div>查阅门票</div>
      </div>
      <div className={styles.contactWrap}>
        <div className={styles.contact}>
          如何联系我们
        </div>
      </div>

    </div>
  );
}

export default observer(App);
