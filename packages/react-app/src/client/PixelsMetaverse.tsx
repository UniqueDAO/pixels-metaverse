
import { BigNumber, BigNumberish, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

export const setAddition = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.addition()
}

export const getAmount = async (
	etherContract: ethers.Contract,
) => {
	return await etherContract.amount()
}

export const getBaseInfo = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.baseInfo()
}

export const setCancelCollect = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.cancelCollect()
}

export const setCancelCompose = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.cancelCompose()
}

export const setCollect = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.collect()
}

export const getCollection = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.collection()
}

export const setCompose = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.compose()
}

export const getComposes = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.composes()
}

export const getGetCollection = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.getCollection()
}

export const getGetCompose = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.getCompose()
}

export const getGetMaterial = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.getMaterial()
}

export const getGetMaterialLength = async (
	etherContract: ethers.Contract,
) => {
	return await etherContract.getMaterialLength()
}

export const setHandleTransfer = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.handleTransfer()
}

export const setMake = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.make()
}

export const getMaterial = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.material()
}

export const setReMake = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.reMake()
}

export const setRegister = async (
	etherContract: ethers.Contract,
) => {
	return await etherContract.register()
}

export const setSetConfig = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.setConfig()
}

export const setSetPMT721 = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.setPMT721()
}

export const setSubtract = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.subtract()
}

export const getUser = async (
	etherContract: ethers.Contract,
	arg?: { test: string },
) => {
	return await etherContract.user()
}
