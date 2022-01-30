
//nonpayable
export const setAddition = async (
	contract,
	arg
) => {
	if (!arg) return
	const { ids, idList } = arg;
	return await contract.addition(ids, idList)
}

//view
export const getAmount = async (
	contract,
) => {
	return await contract.amount()
}

//view
export const getBaseInfo = async (
	contract,
	arg
) => {
	if (!arg) return
	const { bytes32Params1 } = arg;
	return await contract.baseInfo(bytes32Params1)
}

//nonpayable
export const setCancelCollect = async (
	contract,
	arg
) => {
	if (!arg) return
	const { id, index } = arg;
	return await contract.cancelCollect(id, index)
}

//nonpayable
export const setCancelCompose = async (
	contract,
	arg
) => {
	if (!arg) return
	const { ids } = arg;
	return await contract.cancelCompose(ids)
}

//nonpayable
export const setCollect = async (
	contract,
	arg
) => {
	if (!arg) return
	const { id } = arg;
	return await contract.collect(id)
}

//view
export const getCollection = async (
	contract,
	arg
) => {
	if (!arg) return
	const { addressParams1, uint256Params2 } = arg;
	return await contract.collection(addressParams1, uint256Params2)
}

//nonpayable
export const setCompose = async (
	contract,
	arg
) => {
	if (!arg) return
	const { ids, name, category, data, decode } = arg;
	return await contract.compose(ids, name, category, data, decode)
}

//view
export const getComposes = async (
	contract,
	arg
) => {
	if (!arg) return
	const { uint256Params1, uint256Params2 } = arg;
	return await contract.composes(uint256Params1, uint256Params2)
}

//view
export const getGetCollection = async (
	contract,
	arg
) => {
	if (!arg) return
	const { from } = arg;
	return await contract.getCollection(from)
}

//view
export const getGetCompose = async (
	contract,
	arg
) => {
	if (!arg) return
	const { id } = arg;
	return await contract.getCompose(id)
}

//view
export const getGetMaterial = async (
	contract,
	arg
) => {
	if (!arg) return
	const { id } = arg;
	return await contract.getMaterial(id)
}

//view
export const getGetMaterialLength = async (
	contract,
) => {
	return await contract.getMaterialLength()
}

//nonpayable
export const setHandleTransfer = async (
	contract,
	arg
) => {
	if (!arg) return
	const { from, to, id } = arg;
	return await contract.handleTransfer(from, to, id)
}

//nonpayable
export const setMake = async (
	contract,
	arg
) => {
	if (!arg) return
	const { name, category, data, decode, num } = arg;
	return await contract.make(name, category, data, decode, num)
}

//view
export const getMaterial = async (
	contract,
	arg
) => {
	if (!arg) return
	const { uint256Params1 } = arg;
	return await contract.material(uint256Params1)
}

//nonpayable
export const setReMake = async (
	contract,
	arg
) => {
	if (!arg) return
	const { id, num } = arg;
	return await contract.reMake(id, num)
}

//nonpayable
export const setRegister = async (
	contract,
) => {
	return await contract.register()
}

//nonpayable
export const setSetConfig = async (
	contract,
	arg
) => {
	if (!arg) return
	const { role, id, other } = arg;
	return await contract.setConfig(role, id, other)
}

//nonpayable
export const setSetPMT721 = async (
	contract,
	arg
) => {
	if (!arg) return
	const { pmt721 } = arg;
	return await contract.setPMT721(pmt721)
}

//nonpayable
export const setSubtract = async (
	contract,
	arg
) => {
	if (!arg) return
	const { ids, id, index } = arg;
	return await contract.subtract(ids, id, index)
}

//view
export const getUser = async (
	contract,
	arg
) => {
	if (!arg) return
	const { addressParams1 } = arg;
	return await contract.user(addressParams1)
}
