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
    getMaterialInfo: (params?: { id: string | number; } | undefined) => Promise<any>,
    materialList: MaterialItem[];
    setMaterialList: Dispatch<React.SetStateAction<MaterialItem[]>>
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
    getMaterialLength: (params?: unknown) => Promise<{
      successValue: string | undefined;
      failError?: undefined;
    } | {
      failError: any;
      successValue?: undefined;
    } | undefined>,
    getMaterialList: () => Promise<void>,
    materialId?: number;
    setMaterialId: Dispatch<React.SetStateAction<number | undefined>>;
    composeList: string[];
    setComposeList: Dispatch<React.SetStateAction<string[]>>;
    materialListObj: Dictionary<MaterialItem>;
    setMaterialListObj: React.Dispatch<React.SetStateAction<Dictionary<MaterialItem>>>
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
  const [materialList, setMaterialList] = useState<MaterialItem[]>([]);
  const [materialListObj, setMaterialListObj] = useState<Dictionary<MaterialItem>>({});
  const [materialId, setMaterialId] = useState<number | undefined>();
  const [composeList, setComposeList] = React.useState<string[]>([])
  const { openLoading, closeDelayLoading } = useLoading()
  const { address, networkId } = useWeb3Info()
  const [userInfo, getUserInfo] = useImmediateReadContractRequest(PixelsMetaverse_User, { arg: address ? { addressParams1: address } : undefined })
  const [collectList, getCollectList] = useImmediateReadContractRequest(PixelsMetaverse_GetCollection, { arg: address ? { from: address } : undefined })
  const [materialLength, getMaterialLength] = useImmediateReadContractRequest(PixelsMetaverse_GetMaterialLength)
  const [getMaterialInfo] = useRequest(PixelsMetaverse_GetMaterial, { isGlobalTransactionHookValid: false })

  const getMaterialList = useCallback(async () => {
    openLoading()
    const arr: MaterialItem[] = []
    for (let i = Number(materialLength); i >= 1; i--) {
      const res = await getMaterialInfo({ id: i })
      if (res?.successValue) arr.push(arrayToObject(res?.successValue as MaterialItem))
      if (res?.failError) {
        console.log(res?.failError, i, "error")
      }
    }
    closeDelayLoading()
    setMaterialList(arr)
  }, [getMaterialInfo, materialLength])

  useEffect(() => {
    if (Number(materialLength) && networkId) getMaterialList()
  }, [materialLength, networkId])

  useEffect(() => {
    if (isEmpty(materialList)) return
    if (materialList?.length !== Number(materialLength)) return
    const obj: Dictionary<MaterialItem> = keyBy(materialList, (item: MaterialItem) => item?.material?.id);
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
    map(materialList, (item: MaterialItem) => {
      const data = getData(item)
      if (isEmpty(data)) obj[item?.material?.id].composeData = [item]
      obj[item?.material?.id].composeData = data;
    })
    setMaterialListObj(obj)
  }, [materialList])

  return (
    <UserInfoContext.Provider value={{
      getMaterialInfo,
      getMaterialLength,
      getMaterialList,
      userInfo, getUserInfo,
      collectList, getCollectList,
      materialList, setMaterialList,
      materialId, setMaterialId,
      composeList, setComposeList,
      materialListObj, setMaterialListObj
    }}>
      {children}
    </UserInfoContext.Provider>
  )
}