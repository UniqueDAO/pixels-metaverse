
import { BigNumber, BigNumberish, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

export const fetchaddition = async (
	etherContract,
	arg,
) => {
	return await etherContract.addition()
}

export const fetchamount = async (
	etherContract,
) => {
	return await etherContract.amount()
}

export const fetchbaseInfo = async (
	etherContract,
	arg,
) => {
	return await etherContract.baseInfo()
}

export const fetchcancelCollect = async (
	etherContract,
	arg,
) => {
	return await etherContract.cancelCollect()
}

export const fetchcancelCompose = async (
	etherContract,
	arg,
) => {
	return await etherContract.cancelCompose()
}

export const fetchcollect = async (
	etherContract,
	arg,
) => {
	return await etherContract.collect()
}

export const fetchcollection = async (
	etherContract,
	arg,
) => {
	return await etherContract.collection()
}

export const fetchcompose = async (
	etherContract,
	arg,
) => {
	return await etherContract.compose()
}

export const fetchcomposes = async (
	etherContract,
	arg,
) => {
	return await etherContract.composes()
}

export const fetchgetCollection = async (
	etherContract,
	arg,
) => {
	return await etherContract.getCollection()
}

export const fetchgetCompose = async (
	etherContract,
	arg,
) => {
	return await etherContract.getCompose()
}

export const fetchgetMaterial = async (
	etherContract,
	arg,
) => {
	return await etherContract.getMaterial()
}

export const fetchgetMaterialLength = async (
	etherContract,
) => {
	return await etherContract.getMaterialLength()
}

export const fetchhandleTransfer = async (
	etherContract,
	arg,
) => {
	return await etherContract.handleTransfer()
}

export const fetchmake = async (
	etherContract,
	arg,
) => {
	return await etherContract.make()
}

export const fetchmaterial = async (
	etherContract,
	arg,
) => {
	return await etherContract.material()
}

export const fetchreMake = async (
	etherContract,
	arg,
) => {
	return await etherContract.reMake()
}

export const fetchregister = async (
	etherContract,
) => {
	return await etherContract.register()
}

export const fetchsetConfig = async (
	etherContract,
	arg,
) => {
	return await etherContract.setConfig()
}

export const fetchsetPMT721 = async (
	etherContract,
	arg,
) => {
	return await etherContract.setPMT721()
}

export const fetchsubtract = async (
	etherContract,
	arg,
) => {
	return await etherContract.subtract()
}

export const fetchuser = async (
	etherContract,
	arg,
) => {
	return await etherContract.user()
}
