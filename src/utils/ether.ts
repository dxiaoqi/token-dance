import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import config from '../config/app'
let abi = [
  "event ValueChanged(address indexed author, string oldValue, string newValue)",
  "constructor(string value)",
  "function getValue() view returns (string value)",
  "function setValue(string value)"
];

export const initProvide = async () => {
  // 初始化合约
  const provider = await detectEthereumProvider();
  if (provider) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(config.CONTRACT_ADRESS, abi, web3Provider);
    return { contract, web3Provider };
  } else {
    console.log('Please install MetaMask!');
    return Promise.reject('Please install MetaMask!');
  }
}

