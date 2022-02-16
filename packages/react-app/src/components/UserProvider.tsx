import * as React from "react";
import { Dictionary, isEmpty, keyBy, map } from "lodash";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { createContext, Dispatch } from "react";
import { MaterialItem } from "./Card";
import { useImmediateReadContractRequest, useRequest, useWeb3Info } from "../abi-to-request";
import {
  PixelsMetaverse_GetCollection,
  PixelsMetaverse_GetMaterial,
  PixelsMetaverse_GetMaterialLength,
  PixelsMetaverse_User
} from "../client/PixelsMetaverse";
import { useLoading } from "./Loading";

export const UserInfoContext = createContext(
  {} as {
    userInfo: any;
    getUserInfo: (params?: {
      addressParams1: string;
    } | undefined) => Promise<{
      successValue: {
        id: string;
        avater: string;
        role: string;
        other: string;
      } | undefined;
      failError?: undefined;
    } | {
      failError: any;
      successValue?: undefined;
    } | undefined>
    goodsList: any[];
    setGoodsList: Dispatch<any[]>;
    collectList: string[] | undefined;
    getCollectList: (params?: {
      from: string;
    } | undefined) => Promise<{
      successValue: string[] | undefined;
      failError?: undefined;
    } | {
      failError: any;
      successValue?: undefined;
    } | undefined>
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
  const [goodsId, setGoodsId] = useState<number | undefined>();
  const [composeList, setComposeList] = React.useState<string[]>([])
  const { openLoading, closeDelayLoading } = useLoading()
  const { address, networkId } = useWeb3Info()
  const [userInfo, getUserInfo] = useImmediateReadContractRequest(PixelsMetaverse_User, { arg: address ? { addressParams1: address } : undefined })
  const [collectList, getCollectList] = useImmediateReadContractRequest(PixelsMetaverse_GetCollection, { arg: address ? { from: address } : undefined })
  const [materialLength] = useImmediateReadContractRequest(PixelsMetaverse_GetMaterialLength)
  const [getGoodsInfo] = useRequest(PixelsMetaverse_GetMaterial, { isGlobalTransactionHookValid: false })

  const getFirstGoodsList = useCallback(async () => {
    openLoading()
    const arr: MaterialItem[] = []
    for (let i = Number(materialLength); i >= 1; i--) {
      const res = await getGoodsInfo({ id: i })
      if (res?.successValue) arr.push(arrayToObject(res?.successValue as MaterialItem))
      if (res?.failError) {
        console.log(res?.failError, i, "error")
      }
    }
    closeDelayLoading()
    setGoodsList(arr)
  }, [getGoodsInfo, materialLength])

  useEffect(() => {
    if (Number(materialLength) && networkId) getFirstGoodsList()
  }, [materialLength, networkId])

  useEffect(() => {
    if (isEmpty(goodsList)) return
    if (goodsList?.length !== Number(materialLength)) return
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
      userInfo, getUserInfo,
      collectList, getCollectList,
      goodsList, setGoodsList,
      goodsId, setGoodsId,
      composeList, setComposeList,
      goodsListObj, setGoodsListObj
    }}>
      {children}
    </UserInfoContext.Provider>
  )
}