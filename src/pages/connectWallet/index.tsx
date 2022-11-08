import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import avatar from '../../assert/avatar.png';
import { ethers } from 'ethers';

function ConnectWallet() {
    const [publicKey, setPublickey] = useState();
    const [network, setNetwork] = useState();
    const [chainId, setChainId] = useState();
    const [msg, setMsg] = useState();


    const connectButton = async () => {
        const { ethereum } = window;
        console.log("ethereum",ethereum);
        if (ethereum.isMetaMask) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const balance = await provider.getBalance(accounts[0], "latest");

            const { name, chainId } = await provider.getNetwork();
            console.log("provider",provider);
            console.log("accounts: " , accounts);
            console.log("name",name);
            console.log("chainId",chainId);
            console.log("balance",balance);

            // setNetwork(name);
            // setChainId(chainId);
            // setPublickey(accounts[0]);
        } else {
            // setMsg("Install MetaMask");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.connectContainer}>
                <div className={styles.title}>Connet your Wallet</div>
                <div className={styles.avatarWrapper}>
                    <img className={styles.avatar} src={avatar} />
                    <div className={styles.description}>MetaMask</div>
                </div>
                <div className={styles.horizon}></div>
                <div onClick={connectButton}>
                    <div className={styles.connectTxt}>Click to authorize</div>
                </div>
            </div>
        </div>
    );
}

export default ConnectWallet;
