import React, { useEffect, useState } from 'react';
import { initProvide } from '../../utils/ether';
import CosmoTool from '../../utils/cosmo/main';
import { init } from '../../utils/plug'
import { Button, Modal, Toast } from 'antd-mobile';
import { useNavigate } from "react-router-dom";
import styles from './index.module.scss';
import icon from '.././../assert/icon.png';
import avatar from '../../assert/avatar.png';
import { observer } from 'mobx-react';
import stores from '../../store';
import i18n from '../../i18n';
import wheelImg from ".././../assert/music/drive.png";
import telegram from '../../assert/music/telegram.png';
import twitter from '../../assert/music/twitter.png';
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
      console.log("address",address);
      if (address) {
        user.setUser({ address: address });
        localStorage.setItem("walletAddress", address);
        console.log("address",address);
        Modal.clear();
        navigate("/list");
      }
    }).catch((err) => {
    })
  };


 

  return (
    <div className={styles.container}>
      <div className={styles.logoImages}></div>
      {'zh-CN' === i18n.language ? <div className={styles.titleImages}></div> : <div className={styles.titleImagesEng}></div> }
      <div className={styles.wheelImageWrap}>
        <img src={wheelImg} className={styles.wheelImage}></img>
      </div>
      <div className={styles.tickenIntro}>
        {/* <div>{'zhCN' === i18n.language}</div> */}
        <div className={styles.tickenIntroTitle}>{i18n.t('home.tickenIntroTitle')}</div>
        <ul className={styles.tickenIntroContent}>
          <li className={styles.tickenIntroItem}>{i18n.t('home.tickenIntroOne')}</li>
          <li className={styles.tickenIntroItem}>{i18n.t('home.tickenIntroTwo')}</li>
          <li className={styles.tickenIntroItem}>{i18n.t('home.tickenIntroThree')}</li>
          <li className={styles.tickenIntroItem}>{i18n.t('home.tickenIntroFour')}</li>
        </ul>
      </div>
      <div className={styles.plugChainIntro}>
        {i18n.t('home.plugChainIntro')}
      </div>
      <div className={styles.btnWrap} onClick={connectButton}>
        <div className={styles.btnIcon}></div>
        <div>{i18n.t('home.viewTicket')}</div>
      </div>
      <div className={styles.contactWrap}>
        <div className={styles.contact}>
          {i18n.t('home.contact')}
        </div>
        <div className={styles.contactList}>
          <div className={styles.contactItem} style={{marginRight:'50px'}}>
            <img className={styles.contactIcon} src={telegram} alt="" />
            <div className={styles.contactIconText}>
              <div className={styles.contactIconTextTitle}>Telegram</div>
              <div className={styles.contactIconTextDetail}>@plugchain</div>
            </div>
          </div>
          <div className={styles.contactItem}>
            <img className={styles.contactIcon} src={twitter} alt="" />
            <div className={styles.contactIconText}>
              <div className={styles.contactIconTextTitle}>Twitter</div>
              <div className={styles.contactIconTextDetail}>@Plugchainclub</div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default observer(App);
