import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useNavigate } from "react-router-dom";
import icon from '../.././assert/icon.png';
import whereIcon from '../.././assert/where.png';
import whenIcon from '../.././assert/when.png';

function TickenCard() {
    let navigate = useNavigate();


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.img} src={icon} alt="" />
                <div className={styles.content}>
                    <div className={styles.title}>TokenDance 2022</div>
                    <div className={styles.arrow}>{'>'}</div>
                </div>
            </div>
            <div className={styles.description}>
                <div className={styles.where}>
                    <img className={styles.icon} src={whereIcon} alt="whereicon" />
                    <div className={styles.title}>Where</div>
                    <div className={styles.text}>This is a place</div>
                </div>
                <div className={styles.when}>
                <img className={styles.icon} src={whenIcon} alt="whenicon" />
                    <div className={styles.title}>When</div>
                    <div className={styles.text}>2022-12-12 14:00:00</div>
                </div>
            </div>
        </div>
    );
}

export default TickenCard;
