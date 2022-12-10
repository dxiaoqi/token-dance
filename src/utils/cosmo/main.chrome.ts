import { BroadcastTxResponse } from "./types";

export class CosmoWalletChromeTool {
	/**
	 * check the extension in Chrome
	 * */
	public checkExtension(): boolean {
		const tool = (window as any).cosmoWallet;
		if (!tool) return false;
		if (!tool.getAccount) return false;
		return true;
	}
	/**
	 * get account permission
	**/
	public getPermission(): Promise<string[]|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.getPermission().then(resolve);
		});
	}
	/**
	 * apply account permission
	 * @argument permission permission list, default: ['*']
	**/
	public applyPermission(permission: string[] = ['*']): Promise<boolean|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.applyPermission(permission).then(resolve);
		});
	}
	/**
	 * get account address
	**/
	public getAccount(): Promise<string|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.getAccount().then(resolve);
		});
	}
	/**
	 * get account type
	**/
	public async getAccountType(): Promise<string|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.accountAddressType().then(resolve);
		});
	}
	/**
	 * open popup.html for send transfer
	 * @argument address recipient address
	 * @argument nums need send volume, default: ''
	 * @argument memo remark, default: ''
	**/
	public sendTransferBaseCoin(
		address: string,
		nums: string = '',
		memo: string = '',
	): Promise<BroadcastTxResponse|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.openPopupTransfer({
				address, nums, memo
			}).then(resolve);
		});
	}
	/**
	 * get web3.js object
	**/
	public getWeb3(): Promise<any> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.getWeb3().then(resolve);
		});
	}
	/**
	 * evm contract call function
	 * @param {string} contractAddress - contract address with hex
	 * @param {string} callFunc - contract function. example: balanceOf(address)
	 * @param {string} callArgs - arguments with contract function. example: [ '0x00000000000000000000000000000000' ]
	 * @return {string|null} - call result
	**/
	public async contractCall(
		contractAddress: string,
		callFunc: string,
		callArgs: Array<any>,
	): Promise<string|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.contractCall({
				contractAddress, info: {methodStr:callFunc, dataArr:callArgs}
			}).then(resolve);
		});
	}
	/**
	 * evm contract call function （rawData）
	 * @param {string} contractAddress - contract address with hex
	 * @param {string} raw - rawData: 0x..........
	 * @param {number} value - plug number
	 * @return {string|null} - call result
	**/
	public async contractCallRaw(
		contractAddress: string,
		raw: string,
		value: number
	): Promise<string|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.contractCallRaw({
				contractAddress, raw, value
			}).then(resolve);
		});
	}
	/**
	 * evm contract send transition
	 * @param {string} contractAddress - contract address with hex
	 * @param {string} callFunc - contract function.
	 * @param {string} callArgs - arguments with contract function.
	 * @return {string|null} - transition hash.
	**/
	public contractSend(
		contractAddress: string,
		callFunc: string = '',
		callArgs:any,
	): Promise<string|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.contractSend({
				contractAddress, info: {methodStr:callFunc, dataArr:callArgs}
			}).then(resolve);
		});
	}
	/**
	 * evm contract send transition (rawData)
	 * @param {string} contractAddress - contract address with hex
	 * @param {string} raw - rawData: 0x..........
	 * @param {number} value - plug number
	 * @return {string|null} - transition hash.
	**/
	public contractSendRaw(
		contractAddress: string,
		raw: string,
		value:number=0,
	): Promise<string|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.contractSendRaw({
				contractAddress, raw, value
			}).then(resolve);
		});
	}
	/**
	 * evm contract send transition
	 * @param {string} contractName - contract name.
	 * @param {string} byteCode - contract byteCode.
	 * @return {object} - {hash: '',contractAddress: ''}.
	**/
	public contractDeploy(
		contractName: string,
		byteCode: string = '',
	): Promise<BroadcastTxResponse|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.contractDeploy({
				contractName, byteCode
			}).then(resolve);
		});
	}
	public dexPoolExchange(
		poolId: string,
		fromSymbol: string,
		fromAmount: number,
		toSymbol:string,
		feeAmount: string,
		orderPrice:number,
	): Promise<BroadcastTxResponse|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.dexPoolExchange({
				poolId, fromSymbol,fromAmount,toSymbol,feeAmount,orderPrice
			}).then(resolve);
		});
	}
	public dexMsgCreatePool(
		fromSymbol: string,
		fromAmount: number,
		toSymbol:string,
		toAmount: number,
	): Promise<BroadcastTxResponse|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.dexMsgCreatePool({
				fromSymbol,fromAmount,toSymbol,toAmount
			}).then(resolve);
		});
	}
	public dexMsgDepositWithinBatch(
		poolId: string,
		fromSymbol: string,
		fromAmount: number,
		toSymbol:string,
		toAmount: number,
	): Promise<BroadcastTxResponse|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.dexMsgDepositWithinBatch({
				poolId, fromSymbol,fromAmount,toSymbol,toAmount
			}).then(resolve);
		});
	}
	public dexMsgWithdrawWithinBatch(
		poolId: string,
		fromSymbol: string,
		fromAmount: number
	): Promise<BroadcastTxResponse|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.dexMsgWithdrawWithinBatch({
				poolId, fromSymbol,fromAmount
			}).then(resolve);
		});
	}
	public dataSign(): Promise<BroadcastTxResponse|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.dataSign().then(resolve);
		});
	}
	public dataSignStr(
		signStr:string
	): Promise<BroadcastTxResponse|null> {
		return new Promise(resolve => {
			if (!this.checkExtension()) return resolve(null);
			(window as any).cosmoWallet.dataSignStr(
				{signStr}
			).then(resolve);
		});
	}
}

export default new CosmoWalletChromeTool();