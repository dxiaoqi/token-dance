import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useNavigate } from "react-router-dom";
import icon from './../../assert/icon.png';
import stores from '../../store';
import { handleAddress } from '../.././utils/ether';
import whereIcon from '../.././assert/where.png';
import whenIcon from '../.././assert/when.png';

function List() {
    let navigate = useNavigate();
    const user = stores.user;

    let obj = {
        '主链': '-',
        'Creator': 'tokenDance.eth',
        'Token Standard': 'ERC721',
        'Asset contract': '0x49cF----A28B',
        'Token id': 1324567
    }

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <img className={styles.headerIcon} src={icon} alt="icon" />
                        <div className={styles.headerDesc}>
                            <div className={styles.headerDescTitle}>TokenDance 2022</div>
                            <div className={styles.headerDescText}>A Web3 Evangelism Conference for Chinese Internet People.To Explore Web3 Application Startup Opportunities</div>
                        </div>
                    </div>
                    <div className={styles.headerInfo}>
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
                <div className={styles.horizon}></div>
                <div className={styles.content}>
                    {
                        Object.entries(obj).map(([key,value]) => {
                            return (
                                <div className={styles.item}>
                                    <div className={styles.itemKey}>{key}</div>
                                    <div className={styles.itemValue}>{value}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.horizon}></div>
                <div className={styles.invitation}>
                    <div className={styles.inviteCircleWrap}>
                         <div className={styles.inviteCircle}><div className={styles.inviteIcon}>+</div><div className={styles.inviteText}>invite</div></div>
                         <div className={styles.inviteCircle}><div className={styles.inviteIcon}>+</div><div className={styles.inviteText}>invite</div></div>
                    </div>
                    <div className={styles.inviteFBI}>You can click the invite button to invite 2 people  to the conference</div>
                </div>
            </div>
        </div>
    );
}

export default List;
