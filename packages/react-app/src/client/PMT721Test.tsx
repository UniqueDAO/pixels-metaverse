import { BigNumber, ethers } from "ethers";

//nonpayable
export const setApprove = async (
	contract: ethers.Contract,
	arg?: {
		to: string; //address
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { to, tokenId } = arg;
	return await contract.approve(to, tokenId)
}

//view
export const getBalanceOf = async (
	contract: ethers.Contract,
	arg?: {
		owner: string; //address
	}
) => {
	if (!arg) return
	const { owner } = arg;
	return await contract.balanceOf(owner) as BigNumber; //uint256
}

//nonpayable
export const setBurn = async (
	contract: ethers.Contract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	return await contract.burn(id)
}

//view
export const getCurrentID = async (
	contract: ethers.Contract,
) => {
	return await contract.currentID() as BigNumber; //uint256
}

//view
export const getExits = async (
	contract: ethers.Contract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	return await contract.exits(id) as string; //bool
}

//view
export const getGetApproved = async (
	contract: ethers.Contract,
	arg?: {
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { tokenId } = arg;
	return await contract.getApproved(tokenId) as string; //address
}

//view
export const getGetMinter = async (
	contract: ethers.Contract,
) => {
	return await contract.getMinter() as string; //address
}

//view
export const getIsApprovedForAll = async (
	contract: ethers.Contract,
	arg?: {
		owner: string; //address
		operator: string; //address
	}
) => {
	if (!arg) return
	const { owner, operator } = arg;
	return await contract.isApprovedForAll(owner, operator) as string; //bool
}

//nonpayable
export const setMint = async (
	contract: ethers.Contract,
	arg?: {
		to: string; //address
	}
) => {
	if (!arg) return
	const { to } = arg;
	return await contract.mint(to)
}

//view
export const getName = async (
	contract: ethers.Contract,
) => {
	return await contract.name() as string; //string
}

//view
export const getOwnerOf = async (
	contract: ethers.Contract,
	arg?: {
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { tokenId } = arg;
	return await contract.ownerOf(tokenId) as string; //address
}

//nonpayable
export const setSafeTransferFrom = async (
	contract: ethers.Contract,
	arg?: {
		from: string; //address
		to: string; //address
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { from, to, tokenId } = arg;
	return await contract.safeTransferFrom(from, to, tokenId)
}

//nonpayable
export const setSafeTransferFromFromToTokenId_data = async (
	contract: ethers.Contract,
	arg?: {
		from: string; //address
		to: string; //address
		tokenId: string | number; //uint256
		_data: string; //bytes
	}
) => {
	if (!arg) return
	const { from, to, tokenId, _data } = arg;
	return await contract.safeTransferFrom(from, to, tokenId, _data)
}

//nonpayable
export const setSetApprovalForAll = async (
	contract: ethers.Contract,
	arg?: {
		operator: string; //address
		approved: string; //bool
	}
) => {
	if (!arg) return
	const { operator, approved } = arg;
	return await contract.setApprovalForAll(operator, approved)
}

//nonpayable
export const setSetMinter = async (
	contract: ethers.Contract,
	arg?: {
		minter: string; //address
	}
) => {
	if (!arg) return
	const { minter } = arg;
	return await contract.setMinter(minter)
}

//view
export const getSupportsInterface = async (
	contract: ethers.Contract,
	arg?: {
		interfaceId: string; //bytes4
	}
) => {
	if (!arg) return
	const { interfaceId } = arg;
	return await contract.supportsInterface(interfaceId) as string; //bool
}

//view
export const getSymbol = async (
	contract: ethers.Contract,
) => {
	return await contract.symbol() as string; //string
}

//view
export const getTokenURI = async (
	contract: ethers.Contract,
	arg?: {
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { tokenId } = arg;
	return await contract.tokenURI(tokenId) as string; //string
}

//nonpayable
export const setTransferFrom = async (
	contract: ethers.Contract,
	arg?: {
		from: string; //address
		to: string; //address
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { from, to, tokenId } = arg;
	return await contract.transferFrom(from, to, tokenId)
}
