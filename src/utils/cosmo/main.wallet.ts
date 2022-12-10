import { BroadcastTxResponse } from "./types";


export class CosmoWalletWalletTool {
	static _errorName = '_comoWalletError' + (Math.random() * 1000000).toFixed(0);
	private setError (){ (window as any)._cosmoErrorCall = this._cosmoErrorCall; };
	constructor() {
	}
	/**
	 * check the extension in wallet
	 * */
	public checkWallet(): boolean {
		const tool = (window as any)._cosmoWalletFunction;
		if (!tool) return false;
		if (!tool.postMessage) return false;
		this.setError();
		return true;
	}
	/**
	 * get account permission
	**/
	public async getPermission(): Promise<string[]|null> {
		return this._demoFunction('getPermission', null).then(res => res);
	}
	/**
	 * apply account permission
	 * @param permission permission list, default: ['*']
	**/
	public async applyPermission(
		permission: string[] = [
			// address with gx prefix
			'accountAddress',
			// PRC10 || PRC20
			'accountAddressType',
			'tokenTransferSend',
			'contractCall',
			'contractSend',
			'liquidity',
			'sign'
		]
	): Promise<string[]|null> {
		return this._demoFunction('applyPermission', permission).then(res => res);
	}
	/**
	 * get account address
	**/
	public async getAccount(): Promise<string|null> {
		return this._demoFunction('accountAddress', null).then(res => res);
	}
	/**
	 * get account type
	**/
	public async getAccountType(): Promise<string|null> {
		return this._demoFunction('accountAddressType', null).then(res => res);
	}
	/**
	 * prc10 token send transfer
	 * @param {Object} transferData - the data to wallet
	 * @param {string} transferData.toAddress - recipient address
	 * @param {string} transferData.volume - transfer volumes
	 * @param {string} transferData.gasAll - gasAll
	 * @param {number} transferData.scale - scale
	 * @param {string} transferData.denom - denom
	 * @param {string} transferData.memo - memo
	 * @param {number} transferData.gasLimit - gasLimit
	**/
	public async sendTransferCoin({
		toAddress, volume, gasAll, scale, denom, memo = '', gasLimit = 200000,
	}: { toAddress: string, volume: string, gasAll: string, scale: number, denom: string, memo: string, gasLimit: number, }): Promise<{data: BroadcastTxResponse, status: number}|null> {
		return this._demoFunction('tokenTransferSend', {
			toAddress: toAddress,
			volume: volume,
			gasAll: gasAll,
			scale: scale,
			denom: denom,
			memo: memo,
			gasLimit: gasLimit,
		});
	}
	/**
	 * prc10 token swap
	 * @param {Object} transferData - the data to wallet
	 * @param {string} transferData.poolId - swap pool id
	 * @param {string} transferData.fromSymbol - send token symbol
	 * @param {string} transferData.fromAmount - send token volume
	 * @param {number} transferData.toSymbol - get token symbol
	 * @param {string} transferData.feeAmount - exchange fee
	 * @param {string} transferData.orderPrice - send token is order and get token
	 * @param {number} transferData.gasAll - gas
	**/
	public async sendLiquidity({
		poolId, fromSymbol, fromAmount, toSymbol, feeAmount, orderPrice, gasAll
	}: { poolId: number, fromSymbol: string, fromAmount: string, toSymbol: string, feeAmount: string, orderPrice: number, gasAll: string }): Promise<{data: BroadcastTxResponse, status: number}|null> {
		return this._demoFunction('sendLiquidity', {
			poolId: poolId,
			fromSymbol: fromSymbol,
			fromAmount: fromAmount,
			toSymbol: toSymbol,
			feeAmount: feeAmount,
			orderPrice: orderPrice,
			gasAll: gasAll,
		});
	}
	/**
	 * add prc10 token swap
	 * @param {Object} transferData - the data to wallet
	 * @param {string} transferData.fromSymbol - send token symbol
	 * @param {string} transferData.fromAmount - send token volume
	 * @param {number} transferData.toSymbol - get token symbol
	 * @param {number} transferData.toAmount - get token volume
	 * @param {number} transferData.gasAll - gas
	**/
	public async createLiquidity({
		fromSymbol, fromAmount, toSymbol, toAmount, gasAll
	}: { fromSymbol: string, fromAmount: string, toSymbol: string, toAmount: string, gasAll: string }): Promise<{data: BroadcastTxResponse, status: number}|null> {
		return this._demoFunction('createLiquidity', {
			fromSymbol: fromSymbol,
			fromAmount: fromAmount,
			toSymbol: toSymbol,
			toAmount: toAmount,
			gasAll: gasAll,
		});
	}
	/**
	 * add prc10 token swap
	 * @param {Object} transferData - the data to wallet
	 * @param {string} transferData.poolId - swap pool id
	 * @param {string} transferData.fromSymbol - send token symbol
	 * @param {string} transferData.fromAmount - send token volume
	 * @param {number} transferData.toSymbol - get token symbol
	 * @param {number} transferData.toAmount - get token volume
	 * @param {number} transferData.gasAll - gas
	**/
	public async addLiquidity({
		poolId, fromSymbol, fromAmount, toSymbol, toAmount, gasAll
	}: { poolId: number, fromSymbol: string, fromAmount: string, toSymbol: string, toAmount: string, gasAll: string }): Promise<{data: BroadcastTxResponse, status: number}|null> {
		return this._demoFunction('addLiquidity', {
			poolId: poolId,
			fromSymbol: fromSymbol,
			fromAmount: fromAmount,
			toSymbol: toSymbol,
			toAmount: toAmount,
			gasAll: gasAll,
		});
	}
	/**
	 * remove prc10 token swap
	 * @param {Object} transferData - the data to wallet
	 * @param {string} transferData.poolId - swap pool id
	 * @param {string} transferData.fromSymbol - send token symbol
	 * @param {string} transferData.fromAmount - send token volume
	 * @param {number} transferData.toSymbol - get token symbol
	 * @param {number} transferData.gasAll - gas
	**/
	public async removeLiquidity({
		poolId, fromSymbol, fromAmount, gasAll
	}: { poolId: number, fromSymbol: string, fromAmount: string, gasAll: string }): Promise<{data: BroadcastTxResponse, status: number}|null> {
		return this._demoFunction('removeLiquidity', {
			poolId: poolId,
			fromSymbol: fromSymbol,
			fromAmount: fromAmount,
			gasAll: gasAll,
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
		callFunc?: string,
		callArgs?: Array<any>,
		callRaw?: string,
	): Promise<{data: string, status: number}|null> {
		return this._demoFunction('contractCall', {
			contractAddress: contractAddress,
			callFunc: callFunc??null,
			callArgs: callArgs??null,
			rawData: callRaw??null,
		});
	}
	/**
	 * evm contract send transition
	 * @param {string} contractAddress - contract address with hex
	 * @param {string} callFunc - contract function.
	 * @param {string} callArgs - arguments with contract function.
	 * @return {string|null} - transition hash.
	**/
	public async contractSend(
		contractAddress: string,
		callFunc?: string,
		callArgs?: Array<any>,
		callRaw?: string,
		volume?: string,
	): Promise<{data: string, status: number}|null> {
		return this._demoFunction('contractSend', {
			contractAddress: contractAddress,
			callFunc: callFunc??null,
			callArgs: callArgs??null,
			rawData: callRaw??null,
			volume: volume??'0',
		});
	}
	
	/**
	 * evm sign
	 * @param {string} data - sign data
	**/
	public async sign(
		data: string,
	): Promise<{data: string, status: number}|null> {
		return this._demoFunction('sign', {
			signData: data,
		});
	}

	private async _demoFunction<T = any>(type: string, data: any, sleepTime = 10): Promise<T|null> {
		this.setError();
		return new Promise((resolve, reject) => {
			if (!this.checkWallet()) return resolve(null);
			const getName = (): string => {
				const resultName = '_comoWallet' + (Math.random() * 1000000).toFixed(0);
				if ((window as any)[resultName] !== undefined) return getName();
				return resultName;
			};
			var name = getName();
			(window as any)._cosmoWalletFunction.postMessage(JSON.stringify({
				type, data,
				windowAttrName: name,
			}));
			var timer = setInterval(() => {
				if ((window as any)[CosmoWalletWalletTool._errorName]) {
					clearTimeout(timer);
					reject((window as any)[CosmoWalletWalletTool._errorName]);
					(window as any)[CosmoWalletWalletTool._errorName] = undefined;
				} else if ((window as any)[name]) {
					clearTimeout(timer);
					resolve((window as any)[name]);
					(window as any)[name] = undefined;
				}
			}, sleepTime);
		});
	}
	private _cosmoErrorCall(error: string) {
		(window as any)[CosmoWalletWalletTool._errorName] = error;
	}
}

export default new CosmoWalletWalletTool();