export interface MsgData {
	msgType: string;
	data: Uint8Array;
}
export interface BroadcastTxSuccess {
	readonly height: number;
	readonly transactionHash: string;
	readonly rawLog?: string;
	readonly data?: readonly MsgData[];
	readonly gasUsed: number;
	readonly gasWanted: number;
}
export interface BroadcastTxFailure {
	readonly height: number;
	readonly code: number;
	readonly transactionHash: string;
	readonly rawLog?: string;
	readonly data?: readonly MsgData[];
}

export declare type BroadcastTxResponse = BroadcastTxSuccess | BroadcastTxFailure;