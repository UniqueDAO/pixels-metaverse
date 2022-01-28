import { Dispatch, useCallback, useEffect, useState } from "react";
import { IMerchandise } from "../pages/produced/components/Submit";
import { usePixelsMetaverse } from "../pixels-metaverse";
import { BigNumberish, ethers } from "ethers";

export interface IHandle<K> {
  onSuccess?: (arg?: K) => void,
  onFail?: (arg?: any) => void
}

export const getNumberStr = (bigNumber: BigNumberish) => {
  return bigNumber.toString()
}

export const useRequest = <T, K>(
  fetch: (etherContract: ethers.Contract, arg: T) => Promise<K>,
  {
    onSuccess,
    onFail
  }: IHandle<K> = {},
  delay: any[] = []
) => {
  const { etherContract } = usePixelsMetaverse()

  return useCallback(async (arg: T) => {
    if (!etherContract) return
    try {
      const res = await fetch(etherContract, arg)
      onSuccess && onSuccess(res)
    } catch (error) {
      onFail && onFail(error)
    }
  }, [etherContract, ...delay])
}

export const useGetDataRequest = <T, K>(fetch: (etherContract: ethers.Contract, arg: T) => Promise<K>, arg: T) => {
  const [data, setData] = useState<K>();
  const { etherContract } = usePixelsMetaverse()
  const getData = useRequest(fetch, {
    onSuccess: (res) => {
      setData(res)
    }
  })

  useEffect(() => {
    getFun()
  }, [etherContract])

  const getFun = useCallback(async () => {
    getData(arg)
  }, [etherContract, getData, arg])

  return [data, getFun] as const
}

export const fetchUserInfo = async (etherContract: ethers.Contract, arg: { address: string }) => {
  const res = await etherContract?.user(arg.address);
  return res
}

export const fetchGetMaterialLength = async (etherContract: ethers.Contract) => {
  const res = await etherContract?.getMaterialLength();
  return res as BigNumberish
}

export const fetchRegister = async (etherContract: ethers.Contract) => {
  const res = await etherContract.register();
  return res
}

export const fetchGetMaterialInfo = async (etherContract: ethers.Contract, arg: { id: number, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  const res = await etherContract.getMaterial(arg?.id);
  return res
}

export const fetchCollectList = async (etherContract: ethers.Contract, arg: { address: string }) => {
  const res = await etherContract.getCollection(arg?.address);
  return res
}

export const fetchGetGoodsIdList = async (etherContract: ethers.Contract, arg?: { createAmount?: number, list: string[], burnID?: string }) => {
  const res = await etherContract.getMaterial(arg)
  return res
}

export const fetchSetConfig = async (etherContract: ethers.Contract, arg: { config: string }) => {
  const res = await etherContract.setConfig(arg.config);
  return res
}

export const fetchMake = async (etherContract: ethers.Contract, arg: { value: IMerchandise }) => {
  const res = await etherContract.make(
    arg?.value?.name,
    arg?.value?.category,
    arg?.value?.data,
    "",
    Number(arg?.value?.amount))
  return res
}

export const fetchCollect = async (etherContract: ethers.Contract, arg: { id: number }) => {
  const res = await etherContract.collect(arg.id)
  return res
}

export const fetchCancelCollect = async (etherContract: ethers.Contract, arg: { id: number, index: number }) => {
  const res = await etherContract.cancelCollect(arg.id, arg?.index)
  return res
}

export const fetchCompose = async (etherContract: ethers.Contract, arg: { ids: string[], name: string, category: string }) => {
  const res = await etherContract.compose(arg.ids, arg.name, arg.category, "", "")
  return res
}

export const fetchCancelCompose = async (etherContract: ethers.Contract, arg: { ids: string }) => {
  const res = await etherContract.cancelCompose(arg.ids)
  return res
}

export const fetchSubjoin = async (etherContract: ethers.Contract, arg: { ids: string, idList: string[] }) => {
  const res = await etherContract.addition(arg.ids, arg.idList)
  return res
}

export const fetchSubtract = async (etherContract: ethers.Contract, arg: { ids: string, id: string, index: number }) => {
  const res = await etherContract.subtract(arg.ids, arg.id, arg?.index)
  return res
}

export const fetchSetUserConfig = async (etherContract: ethers.Contract, arg: { role: string, id: string, other: number }) => {
  const res = await etherContract.setConfig(arg.role, arg.id, arg?.other)
  return res
}

export const fetchOutfit = async (etherContract: ethers.Contract, arg: { value: any }) => {
  const res = await etherContract.outfit(arg?.value.id, arg?.value.isOutfit)
  return res
}