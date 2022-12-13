import { bech32 } from 'bech32';
import { hexToBytes, bytesToHex } from 'web3-utils';
import walletTool, { CosmoWalletWalletTool } from './main.wallet';
import chromeTool, { CosmoWalletChromeTool } from './main.chrome';
import { BroadcastTxResponse } from './types';

class CosmoTool {
	private _isInit = false;
	public get isChrome () {
		return new Promise<boolean>((resolve) => {
			if (this._isInit) return resolve(chromeTool.checkExtension());
			else {
				const timer = setInterval(() => {
					if (this._isInit) {
						clearInterval(timer);
						return resolve(chromeTool.checkExtension());
					}
				}, 10);
			}
		});
	}
	public get isWallet () {
		return new Promise<boolean>((resolve) => {
			if (this._isInit) return resolve(walletTool.checkWallet());
			else {
				const timer = setInterval(() => {
					if (this._isInit) {
						clearInterval(timer);
						return resolve(walletTool.checkWallet());
					}
				}, 10);
			}
		});
	}
	constructor() {
		setTimeout(() => {
			this._isInit = true;
		}, 500);
	}

	/**
	 * get account permission
	 * will back permission list
	**/
	public async getPermission(): Promise<string[]|null> {
		if (await this.isChrome) return chromeTool.getPermission();
		else if (await this.isWallet) return walletTool.getPermission();
		return null;
	}
	/**
	 * apply account permission
	 * @argument permission permission list, default: ['*']
	 * 					permission options list in app wallet: accountAddress, tokenTransferSend, accountAddressType, contractCall, contractSend
	**/
	public async applyPermission(permission: string[] = ['*']): Promise<boolean|null> {
		if (await this.isChrome) return chromeTool.applyPermission(permission);
		else if (await this.isWallet) {
			if (permission.length === 1 && permission[0] === '*') return walletTool.applyPermission().then(res => res?.length !== 0);
			else return walletTool.applyPermission(permission).then(res => res?.length !== 0);
		}
		return null;
	}
	/**
	 * get account address
	**/
	public async getAccount(): Promise<string|null> {
		if (await this.isChrome) return chromeTool.getAccount();
		else if (await this.isWallet) return walletTool.getAccount();
		return null;
	}
	/**
	 * get account type
	**/
	public async getAccountType(): Promise<string|null> {
		if (await this.isChrome) return chromeTool.getAccountType();
		else if (await this.isWallet) return walletTool.getAccountType();
		return null;
	}
	/**
	 * send transfer
	 * @param {Object} transferData - the data to wallet
	 * @param {string} transferData.toAddress - recipient address, all need
	 * @param {string} transferData.volume - transfer volumes, all need
	 * @param {string} transferData.fee - fee, all need
	 * @param {number} transferData.scale - scale, only wallet
	 * @param {string} transferData.denom - denom, only wallet
	 * @param {string} transferData.memo - memo, only wallet
	 * @param {number} transferData.gasLimit - gasLimit, only wallet
	**/
	public async sendTransferBaseCoin({
		toAddress, volume, fee, scale = 0, denom = '', memo = '', gasLimit = 200000,
	}: { toAddress: string, volume: string, fee: string, scale?: number, denom?: string, memo?: string, gasLimit?: number, }): Promise<BroadcastTxResponse|null> {
		if (await this.isChrome) return chromeTool.sendTransferBaseCoin(toAddress, volume, fee);
		else if (await this.isWallet) return walletTool.sendTransferCoin({ toAddress, volume, gasAll: fee, scale, denom, memo, gasLimit }).then(res => res?.data||null);
		return null;
	}

	public addressForHexToBech32(address: string, prefix: string = 'gx'): string {
		return bech32.encode(prefix, bech32.toWords(hexToBytes(address)));
	}
	public addressForBech32ToHex(address: string, LIMIT: number = 1023): string {
		return bytesToHex(bech32.fromWords(bech32.decode(address, LIMIT).words));
	}

	public walletTool: CosmoWalletWalletTool = walletTool;
	public chromeTool: CosmoWalletChromeTool = chromeTool;
}


export default new CosmoTool();