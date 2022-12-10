import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { hexlify } from 'ethers/lib/utils'
import config from '../config/app'
import CosmoTool from './cosmo/main'
// 会议abi
// export const IJunoabi = [
//   `function HoldMeeting(
//     string calldata name,
//     string calldata symbol,
//     string calldata metaInfoURL,
//     uint8 templateType,
//     uint value
// ) external returns (address)`, // 举办会议
//   "function Holds(address host) external view returns (address[] memory);", // 某人举办的会议
//   "function Meetings(address host) external view returns (address[] memory)", // 某人参加的会议
//   "function HoldingMeetings() external view returns (address[] memory)", // 正在举办的会议
//   "function _addTestUser(address) external" // 添加白名单用户
// ];

export const IJunoabi = [
  "function HoldMeeting(string,string,string,uint256,uint256,uint8,uint256) returns (address)",
  "function HoldingMeetings() view returns (address[])",
  "function Holds(address) view returns (address[])",
  "function Meetings(address) view returns (address[])",
  "function _addTestUser(address)"
];


export const INymphabi = [
  "event Approval(address indexed,address indexed,uint256 indexed)",
  "event ApprovalForAll(address indexed,address indexed,bool)",
  "event Transfer(address indexed,address indexed,uint256 indexed)",
  "function CanInvite() view returns (bool)",
  "function CanSign(address) view returns (bool)",
  "function GetValue() view returns (uint256)",
  "function HoldTime() view returns (uint256)",
  "function InvitedPeople() view returns (address[])",
  "function IsSign(address) view returns (bool)",
  "function Sign(address)",
  "function TemplateType() view returns (uint8)",
  "function _batchMint(address[]) payable",
  "function _fissionMint(address) payable",
  "function approve(address,uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function getApproved(uint256) view returns (address)",
  "function isApprovedForAll(address,address) view returns (bool)",
  "function ownerOf(uint256) view returns (address)",
  "function owner() view returns (address)",
  "function safeTransferFrom(address,address,uint256)",
  "function safeTransferFrom(address,address,uint256,bytes)",
  "function setApprovalForAll(address,bool)",
  "function tokenURI(uint256) view returns (string)",
  "function supportsInterface(bytes4) view returns (bool)",
  "function transferFrom(address,address,uint256)",
  "function isInWhite(address) view returns (bool)"
]


export const initProvide = async () => {
  // 初始化合约
  setTimeout(async () => {
    const a = await CosmoTool.applyPermission()
    const address = await CosmoTool.getAccount();
    console.log(address)
    const list = await CosmoTool.chromeTool.contractCall(
      'gx1urhmu309j220ravsr90efc85yfxty7ttvjp0f3',
      'Meetings(address)',
      [address]
    );
    console.log(address, list, hexlify(Number(list)))
  }, 3000)
  const provider = (window as any).cosmoWallet;
  if (provider) {
    (window as any).cosmoWallet.applyPermission().then((d : any) => {
      console.log(2222, d);
    }).catch((e: any) => {
      console.log(2222, e);
    })
    (window as any).cosmoWallet.getPermission().then((d: any) => {
      console.log(d);
    })
    console.log(222)
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(config.CONTRACT_ADRESS, IJunoabi, web3Provider);
    return { contract, web3Provider };
  } else {
    console.log('Please install MetaMask!');
    return Promise.reject('Please install MetaMask!');
  }
}

export const handleAddress = (address: string) => {
  let s = address.slice(0, 6);
  let e = address.slice(address.length - 5);
  return (s + "....." + e);
}

