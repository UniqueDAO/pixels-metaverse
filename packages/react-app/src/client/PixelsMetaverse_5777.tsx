import { TContract } from 'abi-to-request';
import { BigNumber, ethers } from "ethers";

//view
export const PixelsMetaverse_5777_Amount = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).amount() as BigNumber; //uint256
	}
}

//view
export const PixelsMetaverse_5777_BaseInfo = async (
	contract: TContract,
	arg?: {
		bytes32Params1: string; //bytes32
	}
) => {
	if (!arg) return
	const { bytes32Params1 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).baseInfo(bytes32Params1) as {
			data: string; //string
			category: string; //string
			decode: string; //string
			name: string; //string
			userId: BigNumber; //uint256
		}
	}
}

//view
export const PixelsMetaverse_5777_Collection = async (
	contract: TContract,
	arg?: {
		addressParams1: string; //address
		uint256Params2: string | number; //uint256
	}
) => {
	if (!arg) return
	const { addressParams1, uint256Params2 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).collection(addressParams1, uint256Params2) as BigNumber; //uint256
	}
}

//view
export const PixelsMetaverse_5777_Composes = async (
	contract: TContract,
	arg?: {
		uint256Params1: string | number; //uint256
		uint256Params2: string | number; //uint256
	}
) => {
	if (!arg) return
	const { uint256Params1, uint256Params2 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).composes(uint256Params1, uint256Params2) as BigNumber; //uint256
	}
}

//view
export const PixelsMetaverse_5777_Material = async (
	contract: TContract,
	arg?: {
		uint256Params1: string | number; //uint256
	}
) => {
	if (!arg) return
	const { uint256Params1 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).material(uint256Params1) as {
			id: BigNumber; //uint256
			compose: BigNumber; //uint256
			time: string; //string
			position: string; //string
			zIndex: string; //string
			owner: string; //address
			data: string; //bytes32
		}
	}
}

//view
export const PixelsMetaverse_5777_User = async (
	contract: TContract,
	arg?: {
		addressParams1: string; //address
	}
) => {
	if (!arg) return
	const { addressParams1 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).user(addressParams1) as {
			id: BigNumber; //uint256
			avater: BigNumber; //uint256
			role: string; //string
			other: string; //string
		}
	}
}

//nonpayable
export const PixelsMetaverse_5777_Register = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).register()
	}
}

//nonpayable
export const PixelsMetaverse_5777_SetConfig = async (
	contract: TContract,
	arg?: {
		role: string; //string
		id: string | number; //uint256
		other: string; //string
	}
) => {
	if (!arg) return
	const { role, id, other } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).setConfig(role, id, other)
	}
}

//view
export const PixelsMetaverse_5777_GetMaterialLength = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getMaterialLength() as BigNumber; //uint256
	}
}

//view
export const PixelsMetaverse_5777_GetMaterial = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getMaterial(id) as {
			material: {
			id: BigNumber; //uint256
			compose: BigNumber; //uint256
			time: string; //string
			position: string; //string
			zIndex: string; //string
			owner: string; //address
			data: string; //bytes32
		}, 
			baseInfo: {
			data: string; //string
			category: string; //string
			decode: string; //string
			name: string; //string
			userId: BigNumber; //uint256
		}, 
			composes: BigNumber[]; //uint256[]
		}
	}
}

//nonpayable
export const PixelsMetaverse_5777_Make = async (
	contract: TContract,
	arg?: {
		name: string; //string
		category: string; //string
		data: string; //string
		decode: string; //string
		num: string | number; //uint256
	}
) => {
	if (!arg) return
	const { name, category, data, decode, num } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).make(name, category, data, decode, num)
	}
}

//nonpayable
export const PixelsMetaverse_5777_ReMake = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
		num: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id, num } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).reMake(id, num)
	}
}

//nonpayable
export const PixelsMetaverse_5777_Collect = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).collect(id)
	}
}

//nonpayable
export const PixelsMetaverse_5777_CancelCollect = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
		index: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id, index } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).cancelCollect(id, index)
	}
}

//view
export const PixelsMetaverse_5777_GetCollection = async (
	contract: TContract,
	arg?: {
		from: string; //address
	}
) => {
	if (!arg) return
	const { from } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getCollection(from) as BigNumber[]; //uint256[]
	}
}

//view
export const PixelsMetaverse_5777_GetCompose = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getCompose(id) as BigNumber[]; //uint256[]
	}
}

//nonpayable
export const PixelsMetaverse_5777_Compose = async (
	contract: TContract,
	arg?: {
		ids: (string | number)[]; //uint256[]
		name: string; //string
		category: string; //string
		data: string; //string
		decode: string; //string
	}
) => {
	if (!arg) return
	const { ids, name, category, data, decode } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).compose(ids, name, category, data, decode)
	}
}

//nonpayable
export const PixelsMetaverse_5777_CancelCompose = async (
	contract: TContract,
	arg?: {
		ids: string | number; //uint256
	}
) => {
	if (!arg) return
	const { ids } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).cancelCompose(ids)
	}
}

//nonpayable
export const PixelsMetaverse_5777_Addition = async (
	contract: TContract,
	arg?: {
		ids: string | number; //uint256
		idList: (string | number)[]; //uint256[]
	}
) => {
	if (!arg) return
	const { ids, idList } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).addition(ids, idList)
	}
}

//nonpayable
export const PixelsMetaverse_5777_Subtract = async (
	contract: TContract,
	arg?: {
		ids: string | number; //uint256
		id: string | number; //uint256
		index: string | number; //uint256
	}
) => {
	if (!arg) return
	const { ids, id, index } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).subtract(ids, id, index)
	}
}

//nonpayable
export const PixelsMetaverse_5777_SetPMT721 = async (
	contract: TContract,
	arg?: {
		pmt721: string; //address
	}
) => {
	if (!arg) return
	const { pmt721 } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).setPMT721(pmt721)
	}
}

//nonpayable
export const PixelsMetaverse_5777_HandleTransfer = async (
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
		return await (contract as ethers.Contract).handleTransfer(from, to, id)
	}
}
