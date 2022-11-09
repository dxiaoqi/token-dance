import React, { useEffect } from 'react';
import './App.css';
import { initProvide } from '../../utils/ether';
import { Button } from 'antd-mobile';
import { useNavigate } from "react-router-dom";
// import WalletCard from '../../components/WalletCard';

function App() {
  let navigate = useNavigate();

  useEffect(() => {
    initProvide().then(con => {
      console.log('初始合约', con);
    }).catch(() => {

    })
  }, []);

  const gotoConnect = ()=>{
     navigate("/connect"); 
  }

  return (
    <div className="App">
      <div className="btn" onClick={gotoConnect}>
      </div>
    </div>
  );
}

export default App;
