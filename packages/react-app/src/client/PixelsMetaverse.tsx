import { TContract, convertedBigNumber } from "abi-to-request";
import { Contract } from 'web3-eth-contract';
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { TransactionReceipt } from 'web3-core';
import { ethers } from "ethers";

//nonpayable
export const PixelsMetaverse_Addition = async (
	contract: TContract,
	arg?: {
		ids: string | number; //uint256
		idList: (string | number)[]; //uint256[]
	}
) => {
	if (!arg) return
	const { ids, idList } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).addition(ids, idList)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.addition(ids, idList).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//view
export const PixelsMetaverse_Avater = async (
	contract: TContract,
	arg?: {
		addressParams1: string; //address
	}
) => {
	if (!arg) return
	const { addressParams1 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).avater(addressParams1)
		return convertedBigNumber(res) as string; //uint256
	} else {
		let res = await (contract as Contract).methods.avater(addressParams1).call()
		return res as string; //uint256
	}
}

//view
export const PixelsMetaverse_BaseInfo = async (
	contract: TContract,
	arg?: {
		bytes32Params1: string; //bytes32
	}
) => {
	if (!arg) return
	const { bytes32Params1 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).baseInfo(bytes32Params1)
		return convertedBigNumber(res) as {
			owner: string; //address
			name: string; //string
			data: string; //string
			decode: string; //string
		}
	} else {
		let res = await (contract as Contract).methods.baseInfo(bytes32Params1).call()
		return res as {
			owner: string; //address
			name: string; //string
			data: string; //string
			decode: string; //string
		}
	}
}

//nonpayable
export const PixelsMetaverse_Compose = async (
	contract: TContract,
	arg?: {
		idList: (string | number)[]; //uint256[]
		name: string; //string
		decode: string; //string
		time: string; //string
		position: string; //string
		zIndex: string; //string
		data: string; //bytes32
	}
) => {
	if (!arg) return
	const { idList, name, decode, time, position, zIndex, data } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).compose(idList, name, decode, time, position, zIndex, data)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.compose(idList, name, decode, time, position, zIndex, data).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//view
export const PixelsMetaverse_GetMaterial = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).getMaterial(id)
		return convertedBigNumber(res) as {
			material: {
			id: string; //uint256
			compose: string; //uint256
			time: string; //string
			position: string; //string
			zIndex: string; //string
			owner: string; //address
			data: string; //bytes32
		}, 
			baseInfo: {
			owner: string; //address
			name: string; //string
			data: string; //string
			decode: string; //string
		}, 
		}
	} else {
		let res = await (contract as Contract).methods.getMaterial(id).call()
		return res as {
			material: {
			id: string; //uint256
			compose: string; //uint256
			time: string; //string
			position: string; //string
			zIndex: string; //string
			owner: string; //address
			data: string; //bytes32
		}, 
			baseInfo: {
			owner: string; //address
			name: string; //string
			data: string; //string
			decode: string; //string
		}, 
		}
	}
}

//nonpayable
export const PixelsMetaverse_HandleTransfer = async (
	contract: TContract,
	arg?: {
		from: string; //address
		to: string; //address
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { from, to, id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).handleTransfer(from, to, id)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.handleTransfer(from, to, id).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//nonpayable
export const PixelsMetaverse_Make = async (
	contract: TContract,
	arg?: {
		name: string; //string
		data: string; //string
		decode: string; //string
		time: string; //string
		position: string; //string
		zIndex: string; //string
		num: string | number; //uint256
	}
) => {
	if (!arg) return
	const { name, data, decode, time, position, zIndex, num } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).make(name, data, decode, time, position, zIndex, num)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.make(name, data, decode, time, position, zIndex, num).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//view
export const PixelsMetaverse_Material = async (
	contract: TContract,
	arg?: {
		uint256Params1: string | number; //uint256
	}
) => {
	if (!arg) return
	const { uint256Params1 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).material(uint256Params1)
		return convertedBigNumber(res) as {
			id: string; //uint256
			compose: string; //uint256
			time: string; //string
			position: string; //string
			zIndex: string; //string
			owner: string; //address
			data: string; //bytes32
		}
	} else {
		let res = await (contract as Contract).methods.material(uint256Params1).call()
		return res as {
			id: string; //uint256
			compose: string; //uint256
			time: string; //string
			position: string; //string
			zIndex: string; //string
			owner: string; //address
			data: string; //bytes32
		}
	}
}

//nonpayable
export const PixelsMetaverse_ReMake = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
		num: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id, num } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).reMake(id, num)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.reMake(id, num).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//nonpayable
export const PixelsMetaverse_SetAvater = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).setAvater(id)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.setAvater(id).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//nonpayable
export const PixelsMetaverse_SetPosition = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
		position: string; //string
	}
) => {
	if (!arg) return
	const { id, position } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).setPosition(id, position)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.setPosition(id, position).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//nonpayable
export const PixelsMetaverse_SetTime = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
		time: string; //string
	}
) => {
	if (!arg) return
	const { id, time } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).setTime(id, time)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.setTime(id, time).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//nonpayable
export const PixelsMetaverse_SetZIndex = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
		zIndex: string; //string
	}
) => {
	if (!arg) return
	const { id, zIndex } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).setZIndex(id, zIndex)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.setZIndex(id, zIndex).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}

//nonpayable
export const PixelsMetaverse_Subtract = async (
	contract: TContract,
	arg?: {
		ids: string | number; //uint256
		idList: (string | number)[]; //uint256[]
	}
) => {
	if (!arg) return
	const { ids, idList } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).subtract(ids, idList)
		return res as TransactionResponse
	} else {
		let res = await (contract as Contract).methods.subtract(ids, idList).send({ from: contract.sendAccount })
		return res as TransactionReceipt
	}
}
