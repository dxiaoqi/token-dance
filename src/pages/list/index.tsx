import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useNavigate } from "react-router-dom";

function List() {
  let navigate = useNavigate();

  const gotoConnect = ()=>{
     navigate("/connect"); 
  }

  return (
    <div className="App">
         list
    </div>
  );
}

export default List;
