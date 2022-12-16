import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import web3Abi from 'web3-eth-abi'
import { Divider, Toast, Dialog } from "antd-mobile";
import web3Util from 'web3-utils'
import { hexlify } from 'ethers/lib/utils'
import CosmoTool from './cosmo/main';
const CON_ADDR = 'gx1nd0qj25vmdmmwcem8nr0yle0wyxtexdrvupwqn'
export async function init() {
  const a = await CosmoTool.applyPermission()
  const dd = CosmoTool.addressForBech32ToHex('gx1wxdvk9u2af6826fnmkxw26n925dl7c5lwhm7sn');
  const address = await CosmoTool.getAccount();
  console.log(a, dd)
  return address;
}
export async function Meeting() {
  const isWallet = await CosmoTool.isWallet
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  let address = await CosmoTool.getAccount();
  address = isWallet ? CosmoTool.addressForBech32ToHex(address || '') : address;
  let list = await CosmoTool[reqTool].contractCall(
    CosmoTool.addressForBech32ToHex(CON_ADDR),
    'Meetings(address)',
    [
      address,
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('address[]', `${list}`) || [];
}

export async function tokenURI(address: string) {
  const isWallet = await CosmoTool.isWallet
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  let list = await CosmoTool[reqTool].contractCall(
    address,
    'tokenURI(uint256)',
    [
      1,
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('string', `${list}`) || '';
}

export async function isInWhite() {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  let address = await CosmoTool.getAccount();
  address = isWallet ? CosmoTool.addressForBech32ToHex(address || '') : address;
  let list = await CosmoTool[reqTool].contractCall(
    CosmoTool.addressForBech32ToHex(CON_ADDR),
    'isInWhite(address)',
    [
      address,
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('bool', `${list}`) || false;
}

export async function HoldTime(address: string) {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _address = await CosmoTool.getAccount();
  let list = await CosmoTool[reqTool].contractCall(
    address,
    'HoldTime()',
    [
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('uint256', `${list}`)
}

export async function isOwner(address: string) {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _address = await CosmoTool.getAccount();
  let list = await CosmoTool[reqTool].contractCall(
    address,
    'owner()',
    [
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('address', `${list}`)
}

// qrcode
export async function CanInvite(address: string) {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _address = await CosmoTool.getAccount();
  let list = await CosmoTool[reqTool].contractCall(
    address,
    'CanInvite()',
    [
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('bool', `${list}`)
}

export async function CanSign(address: string, cid: string) {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _address = await CosmoTool.getAccount();
  const _cid = isWallet ? CosmoTool.addressForBech32ToHex(cid) : cid;
  let list = await CosmoTool[reqTool].contractCall(
    address,
    'CanSign(address)',
    [
      _cid
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('bool', `${list}`)
}

export async function IsSign(address: string, cid: string) {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _address = await CosmoTool.getAccount();
  const _cid = isWallet ? CosmoTool.addressForBech32ToHex(cid) : cid;
  let list = await CosmoTool[reqTool].contractCall(
    address,
    'IsSign(address)',
    [
      _cid
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('bool', `${list}`)
}

export async function toSign(address: string, cid: string) {
  // 要用send
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _cid = isWallet ? CosmoTool.addressForBech32ToHex(cid) : cid;

  const list = await CosmoTool[reqTool].contractSend(
    address,
    'Sign(address)',
    [
      _cid
    ]
  );
}

export async function balanceOf(address: string, cid: string) {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _address = await CosmoTool.getAccount();
  const _cid = isWallet ? CosmoTool.addressForBech32ToHex(cid) : cid;
  let list = await CosmoTool[reqTool].contractCall(
    address,
    'balanceOf(address)',
    [
      _cid
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('uint256', `${list}`)
}

export async function fissionMint(address: string, cid: string) {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _cid = isWallet ? CosmoTool.addressForBech32ToHex(cid) : cid;
  await CosmoTool[reqTool].contractSend(
    address,
    '_fissionMint(address)',
    [
      _cid
    ]
  );
}


export async function HoldMeeting(title: string, shortTitle: string, meta: string, time: number, maxInvite: number, type: number, price: number) {
  const isWallet = await CosmoTool.isWallet;
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  const _address = await CosmoTool.getAccount();
  debugger
  const list = await CosmoTool[reqTool].contractSend(
    CosmoTool.addressForBech32ToHex(CON_ADDR),
    'HoldMeeting(string,string,string,uint256,uint256,uint8,uint256)',
    [
      title,
      shortTitle,
      meta,
      time,
      maxInvite,
      type,
      price
    ]
  );
  console.log(list);
  return web3Abi.decodeParameter('address', `${list}`)
}

export async function tokenIdOf(tid: string) {
  const isWallet = await CosmoTool.isWallet
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  let address = await CosmoTool.getAccount();
  address = isWallet ? CosmoTool.addressForBech32ToHex(address || '') : address;
  let list = await CosmoTool[reqTool].contractCall(
    tid,
    'tokenIdOf(address)',
    [
      address,
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  return web3Abi.decodeParameter('uint256', `${list}`) || 0;
}

export async function isSignMan(tid: string) {
  const isWallet = await CosmoTool.isWallet
  const reqTool = isWallet ? 'walletTool' : 'chromeTool';
  let address = await CosmoTool.getAccount();
  address = isWallet ? CosmoTool.addressForBech32ToHex(address || '') : address;

  let list = await CosmoTool[reqTool].contractCall(
    tid,
    'isSignMan(address)',
    [
      address,
    ]
  );
  list = isWallet ? (list as any)?.data : list;
  console.log('tesr', web3Abi.decodeParameter('bool', `${list}`))
  return web3Abi.decodeParameter('bool', `${list}`) || false;
}