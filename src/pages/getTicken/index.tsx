import React, { useEffect } from 'react';
import styles from './index.module.scss';
import avatar from '../../assert/avatar.png';

function GetTicken() {
    const connectWallet = () => {
        console.log("connectWallet");
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>New Ticken！</div>
            <div className={styles.imageContainer}>
            </div>
            <div className={styles.getItBtn}></div>
        </div>
    );
}

export default GetTicken;
