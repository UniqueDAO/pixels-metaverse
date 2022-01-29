import { useCallback, useEffect, useState } from "react";
import { IMerchandise } from "../pages/produced/components/Submit";
import { usePixelsMetaverse } from "../pixels-metaverse";
import { BigNumber, BigNumberish, ethers } from "ethers";

export interface IHandle<K> {
  onSuccess?: (arg?: K) => void,
  onFail?: (arg?: any) => void
}

export const getNumberStr = (bigNumber: BigNumberish) => {
  return bigNumber.toString()
}

export const useRequest = <T, K>(
  fetch: (etherContract: ethers.Contract, arg?: T) => Promise<K>,
  {
    onSuccess,
    onFail
  }: IHandle<K> = {},
  rely: any[] = []
) => {
  const { etherContract } = usePixelsMetaverse()

  return useCallback(async (arg?: T) => {
    if (!etherContract) return
    try {
      const res = await fetch(etherContract, arg)
      onSuccess && onSuccess(res)
    } catch (error) {
      onFail && onFail(error)
    }
  }, [etherContract, ...rely])
}

export const useGetDataRequest = <T, K>(fetch: (etherContract: ethers.Contract, arg?: T) => Promise<K>, arg?: T) => {
  const [data, setData] = useState<K>();
  const { etherContract } = usePixelsMetaverse()
  const getData = useRequest(fetch, { onSuccess: (res) => setData(res) })

  useEffect(() => {
    getFun()
  }, [etherContract])

  const getFun = useCallback(async (params?: T) => {
    getData({ ...arg, ...params } as any)
  }, [etherContract, getData, arg])

  return [data, getFun] as const
}

export const fetchUserInfo = async (etherContract: ethers.Contract, arg?: { address: string }) => {
  if (!arg) return
  const res = await etherContract?.user(arg?.address)
  console.log(res?.id instanceof BigNumber, etherContract)
  return res
}

export const fetchGetMaterialLength = async (etherContract: ethers.Contract) => {
  return await etherContract?.getMaterialLength() as BigNumberish;
}

export const fetchRegister = async (etherContract: ethers.Contract) => {
  return await etherContract.register();
}

export const fetchGetMaterialInfo = async (etherContract: ethers.Contract, arg: { id: number }) => {
  return await etherContract.getMaterial(arg?.id);
}

export const fetchCollectList = async (etherContract: ethers.Contract, arg: { address: string }) => {
  return await etherContract.getCollection(arg?.address);
}

export const fetchGetGoodsIdList = async (etherContract: ethers.Contract, arg?: { createAmount?: number, list: string[], burnID?: string }) => {
  return await etherContract.getMaterial(arg)
}

export const fetchSetConfig = async (etherContract: ethers.Contract, arg: { config: string }) => {
  return await etherContract.setConfig(arg.config);
}

export const fetchMake = async (etherContract: ethers.Contract, arg: { value: IMerchandise }) => {
  return await etherContract.make(
    arg?.value?.name,
    arg?.value?.category,
    arg?.value?.data,
    "",
    Number(arg?.value?.amount))
}

export const fetchCollect = async (etherContract: ethers.Contract, arg: { id: number }) => {
  return await etherContract.collect(arg.id)
}

export const fetchCancelCollect = async (etherContract: ethers.Contract, arg: { id: number, index: number }) => {
  return await etherContract.cancelCollect(arg.id, arg?.index)
}

export const fetchCompose = async (etherContract: ethers.Contract, arg: { ids: string[], name: string, category: string }) => {
  return await etherContract.compose(arg.ids, arg.name, arg.category, "", "")
}

export const fetchCancelCompose = async (etherContract: ethers.Contract, arg: { ids: string }) => {
  return await etherContract.cancelCompose(arg.ids)
}

export const fetchSubjoin = async (etherContract: ethers.Contract, arg: { ids: string, idList: string[] }) => {
  return await etherContract.addition(arg.ids, arg.idList)
}

export const fetchSubtract = async (etherContract: ethers.Contract, arg: { ids: string, id: string, index: number }) => {
  return await etherContract.subtract(arg.ids, arg.id, arg?.index)
}

export const fetchSetUserConfig = async (etherContract: ethers.Contract, arg?: { role: string, id: string, other: string }) => {
  if (!arg) return
  return await etherContract.setConfig(arg?.role, arg?.id, arg?.other)
}

export const fetchOutfit = async (etherContract: ethers.Contract, arg: { value: any }) => {
  return await etherContract.outfit(arg?.value.id, arg?.value.isOutfit)
}