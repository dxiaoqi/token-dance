import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useNavigate } from "react-router-dom";
import icon from './../../assert/icon.png';
import stores from '../../store';
import { handleAddress } from '../.././utils/ether';
import TickenCard from '../../components/tickenCard';

function List() {
  let navigate = useNavigate();
  const user = stores.user;
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={icon} alt="avatar" />
        <div className={styles.address}>{handleAddress(user.userInfo.address)}</div>
      </div>
      <div className={styles.content}>
        <TickenCard />
      </div>
    </div>
  );
}

export default List;
