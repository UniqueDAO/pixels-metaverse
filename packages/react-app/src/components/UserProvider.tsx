import { Dictionary, isEmpty, keyBy, map } from "lodash";
import * as React from "react";
import { ReactNode, useContext, useEffect, useState } from "react";
import { createContext, Dispatch } from "react";
import { MaterialItem } from "./Card";
import { useAbiToRequest, useContractRequest, useGetDataAbiToRequest, useWeb3Info } from "abi-to-request";
import { PixelsMetaverse_GetCollection, PixelsMetaverse_GetMaterial, PixelsMetaverse_GetMaterialLength, PixelsMetaverse_User } from "../client/PixelsMetaverse";

export const UserInfoContext = createContext(
  {} as {
    userInfo: any;
    getUserInfo: (params?: { addressParams1: string; } | undefined) => Promise<void>
    goodsList: any[];
    setGoodsList: Dispatch<any[]>;
    collectList: any[];
    setCollectList: Dispatch<any[]>;
    goodsId?: number;
    setGoodsId: Dispatch<React.SetStateAction<number | undefined>>;
    composeList: string[];
    setComposeList: Dispatch<React.SetStateAction<string[]>>;
    goodsListObj: Dictionary<MaterialItem>;
    setGoodsListObj: React.Dispatch<React.SetStateAction<Dictionary<MaterialItem>>>
  },
);

export const useUserInfo = () => useContext(UserInfoContext);

const arrayToObject = (item: MaterialItem) => {
  return {
    baseInfo: {
      category: item?.baseInfo?.category,
      data: item?.baseInfo?.data,
      decode: item?.baseInfo?.decode,
      name: item?.baseInfo?.name,
      userId: item?.baseInfo?.userId,
    },
    composes: item?.composes,
    material: {
      compose: item?.material?.compose,
      data: item?.material?.data,
      id: item?.material?.id,
      owner: item?.material?.owner,
      position: item?.material?.position,
      time: item?.material?.time,
      zIndex: item?.material?.zIndex,
    },
    composeData: []
  }
}

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [goodsList, setGoodsList] = useState<any[]>([]);
  const [goodsListObj, setGoodsListObj] = useState<Dictionary<MaterialItem>>({});
  const [collectList, setCollectList] = useState<any[]>([]);
  const [goodsId, setGoodsId] = useState<number | undefined>(1);
  const [composeList, setComposeList] = React.useState<string[]>([])
  const { address, networkId } = useWeb3Info()
  const { contracts } = useContractRequest()
  const [userInfo, getUserInfo] = useGetDataAbiToRequest(PixelsMetaverse_User, address ? { addressParams1: address } : undefined)
  const [materialLength, getGetMaterialLength] = useGetDataAbiToRequest(PixelsMetaverse_GetMaterialLength)
  const getGoodsInfo = useAbiToRequest(PixelsMetaverse_GetMaterial, {
    onSuccess: (res) => {
      /* res && setGoodsList((pre) => {
        const data = arrayToObject(res as any)
        const list = cloneDeep(pre)
        list.push(data)
        return map(list, item => {
          if (ethers.utils.formatUnits(item?.material?.id, 0) === String(goodsId)) {
            return 
          }
          return item
        })
      }) */
      res && setGoodsList([arrayToObject(res as any)])
    }
  }, [goodsId])

  const getCollectList = useAbiToRequest(PixelsMetaverse_GetCollection, {
    onSuccess: (res) => {
      res && setCollectList(res)
    }
  })

  useEffect(() => {
    if (!address) return
    getCollectList({ from: address })
  }, [address, contracts, networkId])

  useEffect(() => {
    if (!goodsId) return
    getGoodsInfo({ id: goodsId })
  }, [goodsId, contracts, networkId])

  useEffect(() => {
    if (isEmpty(goodsList)) return
    const obj: Dictionary<MaterialItem> = keyBy(goodsList, (item: MaterialItem) => item?.material?.id);
    const getData = (items: MaterialItem) => {
      const data: MaterialItem[] = []
      const fun = (item: MaterialItem) => {
        if (item?.composes?.length === 0) return
        map(item?.composes, (ite: number) => {
          if (obj[ite]) data.push(obj[ite])
          fun(obj[ite])
        })
      }
      fun(items)
      return data
    }
    map(goodsList, (item: MaterialItem) => {
      const data = getData(item)
      if (isEmpty(data)) obj[item?.material?.id].composeData = [item]
      obj[item?.material?.id].composeData = data;
    })
    setGoodsListObj(obj)
  }, [goodsList])

  return (
    <UserInfoContext.Provider value={{
      userInfo,
      goodsList, setGoodsList,
      goodsId, setGoodsId,
      collectList, setCollectList,
      getUserInfo,
      composeList, setComposeList,
      goodsListObj, setGoodsListObj
    }}>
      {children}
    </UserInfoContext.Provider>
  )
}