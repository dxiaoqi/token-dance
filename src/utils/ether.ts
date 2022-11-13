import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import config from '../config/app'
// 会议abi
let IJunoabi = [
  `function HoldMeeting(
    string calldata name,
    string calldata symbol,
    string calldata metaInfoURL,
    uint8 templateType,
    uint value
) external returns (address)`, // 举办会议
  "function Holds(address host) external view returns (address[] memory);", // 某人举办的会议
  "function Meetings(address host) external view returns (address[] memory)", // 某人参加的会议
  "function HoldingMeetings() external view returns (address[] memory)", // 正在举办的会议
  "function _addTestUser(address) external" // 添加白名单用户
];

export const INymphabi = [
  "function Sign(address ownerAddress) external", // 签到
  "function IsSign(address ownerAddress) external view returns (bool)", // 是否签到
  "function HoldTime() external view returns (uint256)", //开会时间
  "function _batchMint(address[] calldata whites) external payable", // 批量开白
  "function _fissionMint(address originAddress) external payable", // 接受邀请
  "function TemplateType() external view returns (uint8)", //模板类型
  "function CanInvite() view returns (bool)", //能否邀请
  "function CanSign(address ownerAddress) external view returns (bool)", // 能否签到
  "function GetValue() external view returns (uint256)", // 返回票价
  "function tokenURI(uint256) view returns (string)", // 获取票地址
  "function balanceOf(address) view returns (uint256)", // 是否有票
  "function owner() view returns (address)"
]

export const initProvide = async () => {
  // 初始化合约
  const provider = await detectEthereumProvider();
  if (provider) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(config.CONTRACT_ADRESS, IJunoabi, web3Provider);
    return { contract, web3Provider };
  } else {
    console.log('Please install MetaMask!');
    return Promise.reject('Please install MetaMask!');
  }
}

export const handleAddress = (address:string)=>{
  let s = address.slice(0, 6);
  let e = address.slice(address.length-5);
  return (s + "....." + e);
}

