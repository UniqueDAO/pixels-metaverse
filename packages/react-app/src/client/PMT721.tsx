import { TContract } from 'abi-to-request';
import { BigNumber, ethers } from "ethers";

//nonpayable
export const PMT721_Approve = async (
	contract: TContract,
	arg?: {
		to: string; //address
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { to, tokenId } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).approve(to, tokenId)
	}
}

//view
export const PMT721_BalanceOf = async (
	contract: TContract,
	arg?: {
		owner: string; //address
	}
) => {
	if (!arg) return
	const { owner } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).balanceOf(owner) as BigNumber; //uint256
	}
}

//nonpayable
export const PMT721_Burn = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).burn(id)
	}
}

//view
export const PMT721_CurrentID = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).currentID() as BigNumber; //uint256
	}
}

//view
export const PMT721_Exits = async (
	contract: TContract,
	arg?: {
		id: string | number; //uint256
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).exits(id) as string; //bool
	}
}

//view
export const PMT721_GetApproved = async (
	contract: TContract,
	arg?: {
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { tokenId } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getApproved(tokenId) as string; //address
	}
}

//view
export const PMT721_GetMinter = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getMinter() as string; //address
	}
}

//view
export const PMT721_IsApprovedForAll = async (
	contract: TContract,
	arg?: {
		owner: string; //address
		operator: string; //address
	}
) => {
	if (!arg) return
	const { owner, operator } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).isApprovedForAll(owner, operator) as string; //bool
	}
}

//nonpayable
export const PMT721_Mint = async (
	contract: TContract,
	arg?: {
		to: string; //address
	}
) => {
	if (!arg) return
	const { to } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).mint(to)
	}
}

//view
export const PMT721_Name = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).name() as string; //string
	}
}

//view
export const PMT721_OwnerOf = async (
	contract: TContract,
	arg?: {
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { tokenId } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).ownerOf(tokenId) as string; //address
	}
}

//nonpayable
export const PMT721_SafeTransferFrom = async (
	contract: TContract,
	arg?: {
		from: string; //address
		to: string; //address
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { from, to, tokenId } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).safeTransferFrom(from, to, tokenId)
	}
}

//nonpayable
export const PMT721_SafeTransferFromFromToTokenId_data = async (
	contract: TContract,
	arg?: {
		from: string; //address
		to: string; //address
		tokenId: string | number; //uint256
		_data: string; //bytes
	}
) => {
	if (!arg) return
	const { from, to, tokenId, _data } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).safeTransferFrom(from, to, tokenId, _data)
	}
}

//nonpayable
export const PMT721_SetApprovalForAll = async (
	contract: TContract,
	arg?: {
		operator: string; //address
		approved: string; //bool
	}
) => {
	if (!arg) return
	const { operator, approved } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).setApprovalForAll(operator, approved)
	}
}

//nonpayable
export const PMT721_SetMinter = async (
	contract: TContract,
	arg?: {
		minter: string; //address
	}
) => {
	if (!arg) return
	const { minter } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).setMinter(minter)
	}
}

//view
export const PMT721_SupportsInterface = async (
	contract: TContract,
	arg?: {
		interfaceId: string; //bytes4
	}
) => {
	if (!arg) return
	const { interfaceId } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).supportsInterface(interfaceId) as string; //bool
	}
}

//view
export const PMT721_Symbol = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).symbol() as string; //string
	}
}

//view
export const PMT721_TokenURI = async (
	contract: TContract,
	arg?: {
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { tokenId } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).tokenURI(tokenId) as string; //string
	}
}

//nonpayable
export const PMT721_TransferFrom = async (
	contract: TContract,
	arg?: {
		from: string; //address
		to: string; //address
		tokenId: string | number; //uint256
	}
) => {
	if (!arg) return
	const { from, to, tokenId } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).transferFrom(from, to, tokenId)
	}
}
