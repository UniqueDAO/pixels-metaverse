import { BigNumber, ethers } from "ethers";

//nonpayable
export const setAddition = async (
	contract: ethers.Contract,
	arg?: {
		ids: string | number; //uint256
		idList: (string | number)[]; //uint256[]
	}
) => {
	if (!arg) return
	const { ids, idList } = arg;
	return await contract.addition(ids, idList)
}

//view
export const getAmount = async (
	contract: ethers.Contract,
) => {
	return await contract.amount() as BigNumber; //uint256
}

//view
export const getBaseInfo = async (
	contract: ethers.Contract,
	arg?: {
		bytes32Params1: string; //bytes32
	}
) => {
	if (!arg) return
	const { bytes32Params1 } = arg;
	return await contract.baseInfo(bytes32Params1) as {
			data: string; //string
			category: string; //string
			decode: string; //string
			name: string; //string
			userId: BigNumber; //uint256
	}
}

//nonpayable
export const setCancelCollect = async (
	contract: ethers.Contract,
	arg?: {
		id: string | number; //uint256
		index: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id, index } = arg;
	return await contract.cancelCollect(id, index)
}

//nonpayable
export const setCancelCompose = async (
	contract: ethers.Contract,
	arg?: {
		ids: string | number; //uint256
	}
) => {
	if (!arg) return
	const { ids } = arg;
	return await contract.cancelCompose(ids)
}

//nonpayable
export const setCollect = async (
	contract: ethers.Contract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	return await contract.collect(id)
}

//view
export const getCollection = async (
	contract: ethers.Contract,
	arg?: {
		addressParams1: string; //address
		uint256Params2: string | number; //uint256
	}
) => {
	if (!arg) return
	const { addressParams1, uint256Params2 } = arg;
	return await contract.collection(addressParams1, uint256Params2) as BigNumber; //uint256
}

//nonpayable
export const setCompose = async (
	contract: ethers.Contract,
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
	return await contract.compose(ids, name, category, data, decode)
}

//view
export const getComposes = async (
	contract: ethers.Contract,
	arg?: {
		uint256Params1: string | number; //uint256
		uint256Params2: string | number; //uint256
	}
) => {
	if (!arg) return
	const { uint256Params1, uint256Params2 } = arg;
	return await contract.composes(uint256Params1, uint256Params2) as BigNumber; //uint256
}

//view
export const getGetCollection = async (
	contract: ethers.Contract,
	arg?: {
		from: string; //address
	}
) => {
	if (!arg) return
	const { from } = arg;
	return await contract.getCollection(from) as BigNumber[]; //uint256[]
}

//view
export const getGetCompose = async (
	contract: ethers.Contract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	return await contract.getCompose(id) as BigNumber[]; //uint256[]
}

//view
export const getGetMaterial = async (
	contract: ethers.Contract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	return await contract.getMaterial(id) as {
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

//view
export const getGetMaterialLength = async (
	contract: ethers.Contract,
) => {
	return await contract.getMaterialLength() as BigNumber; //uint256
}

//nonpayable
export const setHandleTransfer = async (
	contract: ethers.Contract,
	arg?: {
		from: string; //address
		to: string; //address
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { from, to, id } = arg;
	return await contract.handleTransfer(from, to, id)
}

//nonpayable
export const setMake = async (
	contract: ethers.Contract,
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
	return await contract.make(name, category, data, decode, num)
}

//view
export const getMaterial = async (
	contract: ethers.Contract,
	arg?: {
		uint256Params1: string | number; //uint256
	}
) => {
	if (!arg) return
	const { uint256Params1 } = arg;
	return await contract.material(uint256Params1) as {
			id: BigNumber; //uint256
			compose: BigNumber; //uint256
			time: string; //string
			position: string; //string
			zIndex: string; //string
			owner: string; //address
			data: string; //bytes32
	}
}

//nonpayable
export const setReMake = async (
	contract: ethers.Contract,
	arg?: {
		id: string | number; //uint256
		num: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id, num } = arg;
	return await contract.reMake(id, num)
}

//nonpayable
export const setRegister = async (
	contract: ethers.Contract,
) => {
	return await contract.register()
}

//nonpayable
export const setSetConfig = async (
	contract: ethers.Contract,
	arg?: {
		role: string; //string
		id: string | number; //uint256
		other: string; //string
	}
) => {
	if (!arg) return
	const { role, id, other } = arg;
	return await contract.setConfig(role, id, other)
}

//nonpayable
export const setSetPMT721 = async (
	contract: ethers.Contract,
	arg?: {
		pmt721: string; //address
	}
) => {
	if (!arg) return
	const { pmt721 } = arg;
	return await contract.setPMT721(pmt721)
}

//nonpayable
export const setSubtract = async (
	contract: ethers.Contract,
	arg?: {
		ids: string | number; //uint256
		id: string | number; //uint256
		index: string | number; //uint256
	}
) => {
	if (!arg) return
	const { ids, id, index } = arg;
	return await contract.subtract(ids, id, index)
}

//view
export const getUser = async (
	contract: ethers.Contract,
	arg?: {
		addressParams1: string; //address
	}
) => {
	if (!arg) return
	const { addressParams1 } = arg;
	return await contract.user(addressParams1) as {
			id: BigNumber; //uint256
			avater: BigNumber; //uint256
			role: string; //string
			other: string; //string
	}
}
