import React, { useEffect, useState } from 'react';
import { initProvide } from '../../utils/ether';
import { Button, Modal, Toast } from 'antd-mobile';
import { useNavigate } from "react-router-dom";
import styles from './index.module.scss';
import icon from '.././../assert/icon.png';
import twitter from '../../assert/twitter.png';
import discord from '../../assert/discord.png';
import avatar from '../../assert/avatar.png';
import { observer } from 'mobx-react';
import stores from '../../store';


function App() {
  let navigate = useNavigate();
  const user = stores.user;

  useEffect(() => {
    initProvide()
      .then((con) => {
        console.log("初始合约", con);
      })
      .catch(() => {});
  }, []);

  const gotoConnect = () => {
    navigate("/connect");
  };

  const connectButton = async () => {
    initProvide().then(async ({ web3Provider }) => {
      if (web3Provider) {
        const accounts = await web3Provider.send("eth_requestAccounts", []);
        user.setUser({ address: accounts[0] });
        localStorage.setItem("walletAddress", accounts[0]);
        Modal.clear();
        navigate("/list");
      }
    }).catch((err) => {
      Toast.show({
        icon: 'fail',
        content: '请安装metamask钱包',
      })
    })
  };


  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img src={icon} alt="" />
        <div className={styles.titleText}>Welcome to Ticken</div>
      </div>
      <div className={styles.summary}>
        Ticken is a ticket tool product that combines NFT social play. Here.
      </div>
      <div className={styles.list}>
        <ul>
          <li className={styles.item}>Everyone can start an event</li>
          <li className={styles.item}>Each ticket is an unique NFT</li>
          <li className={styles.item}>
            Flexible configuration of different smart contracts, allowing events
            to fracture quickly
          </li>
          <li className={styles.item}>
            Customize the SBT of participating events to meet your multi-faceted
            role
          </li>
          <li className={styles.item}>
            Events data on the chain, leaving a good mark while allowing you to
            gain trust even if in anonymity
          </li>
          <li className={styles.item}>
            Retrospective every events, no more regrets
          </li>
          <li className={styles.item}>
            Recommendation system that can explore more events and people that
            suit you
          </li>
        </ul>
      </div>
      <div className={styles.btn}
        onClick={() => {
          Modal.show({
            content: (
              <div className={styles.modalContainer} onClick={connectButton}>
                <div className={styles.connectContainer}>
                  <div className={styles.title}>Connet your Wallet</div>
                  <div className={styles.avatarWrapper}>
                    <img className={styles.avatar} src={avatar} />
                    <div className={styles.description}>MetaMask</div>
                  </div>
                  <div className={styles.horizon}></div>
                  <div
                  >
                    <div className={styles.connectTxt}>Click to authorize</div>
                  </div>
                </div>
              </div>
            ),
            closeOnMaskClick: true,
          })
        }}
      ></div>
      <div className={styles.contact}>
        <div className={styles.contactTitle}>How To Connect Us</div>
        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <img className={styles.contactIcon} src={discord} alt="" />
            <div className={styles.contactIconText}>
              <div className={styles.contactIconTextTitle}>Discord</div>
              <div className={styles.contactIconTextDetail}>TokenDance</div>
            </div>
          </div>
          <div className={styles.contactItem}>
            <img className={styles.contactIcon} src={twitter} alt="" />
            <div className={styles.contactIconText}>
              <div className={styles.contactIconTextTitle}>Twitter</div>
              <div className={styles.contactIconTextDetail}>@TokenDance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(App);
