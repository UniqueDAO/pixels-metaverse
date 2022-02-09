import { TContract, convertedBigNumber } from 'abi-to-request';
import { ethers } from "ethers";

//view
export const HappyRedPacket_Check_availability = async (
	contract: TContract,
	arg?: {
		id: string; //bytes32
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).check_availability(id)
		return convertedBigNumber(res) as {
			token_address: string; //address
			balance: string; //uint256
			total: string; //uint256
			claimed: string; //uint256
			expired: string; //bool
			claimed_amount: string; //uint256
		}
	}
}

//nonpayable
export const HappyRedPacket_Claim = async (
	contract: TContract,
	arg?: {
		id: string; //bytes32
		proof: string; //bytes32[]
		recipient: string; //address
	}
) => {
	if (!arg) return
	const { id, proof, recipient } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).claim(id, proof, recipient)
		return convertedBigNumber(res) as {
			claimed: string; //uint256
		}
	}
}

//payable
export const HappyRedPacket_Create_red_packet = async (
	contract: TContract,
	arg?: {
		_merkleroot: string; //bytes32
		_number: string | number; //uint256
		_ifrandom: string; //bool
		_duration: string | number; //uint256
		_seed: string; //bytes32
		_message: string; //string
		_name: string; //string
		_token_type: string | number; //uint256
		_token_addr: string; //address
		_total_tokens: string | number; //uint256
	}
) => {
	if (!arg) return
	const { _merkleroot, _number, _ifrandom, _duration, _seed, _message, _name, _token_type, _token_addr, _total_tokens } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).create_red_packet(_merkleroot, _number, _ifrandom, _duration, _seed, _message, _name, _token_type, _token_addr, _total_tokens)
		return res
	}
}

//nonpayable
export const HappyRedPacket_Initialize = async (
	contract: TContract,
) => {
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).initialize()
		return res
	}
}

//nonpayable
export const HappyRedPacket_Refund = async (
	contract: TContract,
	arg?: {
		id: string; //bytes32
	}
) => {
	if (!arg) return
	const { id } = arg;
	if ((contract as any)?.address && !(contract as any)?.methods) {
		let res = await (contract as ethers.Contract).refund(id)
		return res
	}
}
