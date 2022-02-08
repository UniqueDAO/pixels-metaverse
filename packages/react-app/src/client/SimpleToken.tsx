import { TContract } from 'abi-to-request';
import { BigNumber, ethers } from "ethers";

//view
export const SimpleToken_DEFAULT_ADMIN_ROLE = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).DEFAULT_ADMIN_ROLE() as string; //bytes32
	}
}

//view
export const SimpleToken_INITIAL_SUPPLY = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).INITIAL_SUPPLY() as BigNumber; //uint256
	}
}

//view
export const SimpleToken_MINTER_ROLE = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).MINTER_ROLE() as string; //bytes32
	}
}

//view
export const SimpleToken_PAUSER_ROLE = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).PAUSER_ROLE() as string; //bytes32
	}
}

//view
export const SimpleToken_Allowance = async (
	contract: TContract,
	arg?: {
		owner: string; //address
		spender: string; //address
	}
) => {
	if (!arg) return
	const { owner, spender } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).allowance(owner, spender) as BigNumber; //uint256
	}
}

//nonpayable
export const SimpleToken_Approve = async (
	contract: TContract,
	arg?: {
		spender: string; //address
		amount: string | number; //uint256
	}
) => {
	if (!arg) return
	const { spender, amount } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).approve(spender, amount) as string; //bool
	}
}

//view
export const SimpleToken_BalanceOf = async (
	contract: TContract,
	arg?: {
		account: string; //address
	}
) => {
	if (!arg) return
	const { account } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).balanceOf(account) as BigNumber; //uint256
	}
}

//nonpayable
export const SimpleToken_Burn = async (
	contract: TContract,
	arg?: {
		amount: string | number; //uint256
	}
) => {
	if (!arg) return
	const { amount } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).burn(amount)
	}
}

//nonpayable
export const SimpleToken_BurnFrom = async (
	contract: TContract,
	arg?: {
		account: string; //address
		amount: string | number; //uint256
	}
) => {
	if (!arg) return
	const { account, amount } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).burnFrom(account, amount)
	}
}

//view
export const SimpleToken_Decimals = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).decimals() as BigNumber; //uint8
	}
}

//nonpayable
export const SimpleToken_DecreaseAllowance = async (
	contract: TContract,
	arg?: {
		spender: string; //address
		subtractedValue: string | number; //uint256
	}
) => {
	if (!arg) return
	const { spender, subtractedValue } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).decreaseAllowance(spender, subtractedValue) as string; //bool
	}
}

//view
export const SimpleToken_GetRoleAdmin = async (
	contract: TContract,
	arg?: {
		role: string; //bytes32
	}
) => {
	if (!arg) return
	const { role } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getRoleAdmin(role) as string; //bytes32
	}
}

//view
export const SimpleToken_GetRoleMember = async (
	contract: TContract,
	arg?: {
		role: string; //bytes32
		index: string | number; //uint256
	}
) => {
	if (!arg) return
	const { role, index } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getRoleMember(role, index) as string; //address
	}
}

//view
export const SimpleToken_GetRoleMemberCount = async (
	contract: TContract,
	arg?: {
		role: string; //bytes32
	}
) => {
	if (!arg) return
	const { role } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).getRoleMemberCount(role) as BigNumber; //uint256
	}
}

//nonpayable
export const SimpleToken_GrantRole = async (
	contract: TContract,
	arg?: {
		role: string; //bytes32
		account: string; //address
	}
) => {
	if (!arg) return
	const { role, account } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).grantRole(role, account)
	}
}

//view
export const SimpleToken_HasRole = async (
	contract: TContract,
	arg?: {
		role: string; //bytes32
		account: string; //address
	}
) => {
	if (!arg) return
	const { role, account } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).hasRole(role, account) as string; //bool
	}
}

//nonpayable
export const SimpleToken_IncreaseAllowance = async (
	contract: TContract,
	arg?: {
		spender: string; //address
		addedValue: string | number; //uint256
	}
) => {
	if (!arg) return
	const { spender, addedValue } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).increaseAllowance(spender, addedValue) as string; //bool
	}
}

//nonpayable
export const SimpleToken_Mint = async (
	contract: TContract,
	arg?: {
		to: string; //address
		amount: string | number; //uint256
	}
) => {
	if (!arg) return
	const { to, amount } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).mint(to, amount)
	}
}

//view
export const SimpleToken_Name = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).name() as string; //string
	}
}

//nonpayable
export const SimpleToken_Pause = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).pause()
	}
}

//view
export const SimpleToken_Paused = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).paused() as string; //bool
	}
}

//nonpayable
export const SimpleToken_RenounceRole = async (
	contract: TContract,
	arg?: {
		role: string; //bytes32
		account: string; //address
	}
) => {
	if (!arg) return
	const { role, account } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).renounceRole(role, account)
	}
}

//nonpayable
export const SimpleToken_RevokeRole = async (
	contract: TContract,
	arg?: {
		role: string; //bytes32
		account: string; //address
	}
) => {
	if (!arg) return
	const { role, account } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).revokeRole(role, account)
	}
}

//view
export const SimpleToken_SupportsInterface = async (
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
export const SimpleToken_Symbol = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).symbol() as string; //string
	}
}

//view
export const SimpleToken_TotalSupply = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).totalSupply() as BigNumber; //uint256
	}
}

//nonpayable
export const SimpleToken_Transfer = async (
	contract: TContract,
	arg?: {
		recipient: string; //address
		amount: string | number; //uint256
	}
) => {
	if (!arg) return
	const { recipient, amount } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).transfer(recipient, amount) as string; //bool
	}
}

//nonpayable
export const SimpleToken_TransferFrom = async (
	contract: TContract,
	arg?: {
		sender: string; //address
		recipient: string; //address
		amount: string | number; //uint256
	}
) => {
	if (!arg) return
	const { sender, recipient, amount } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).transferFrom(sender, recipient, amount) as string; //bool
	}
}

//nonpayable
export const SimpleToken_Unpause = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		return await (contract as ethers.Contract).unpause()
	}
}
