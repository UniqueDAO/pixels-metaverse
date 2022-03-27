import React, { useMemo } from "react";
import { Dictionary, isEmpty, keyBy, map } from "lodash";
import { ReactNode, useContext, useEffect, useState } from "react";
import { createContext, Dispatch } from "react";
import { MaterialItem } from "./Card";
import { useReadContractRequest, useWeb3Info } from "abi-to-request";
import { useLoading } from "./Loading";
import { QueryResult, useQuery } from "@apollo/client";
import {
  COMPOSE_LIST,
  MATERIAL_ALL_LIST,
  AVATER_LIST,
  MATERIAL_ADDRESS_LIST,
  MATERIAL_ADDRESS_ID_LIST,
  MATERIAL_ID_LIST
} from "../gql";
import { useLocation, useParams } from "react-router-dom";
import { PMT721_CurrentID } from "../client/PMT721";
import { useQueryString } from "../helpers/utilities";

export const UserInfoContext = createContext(
  {} as {
    userInfo: any;
    materialList: MaterialItem[];
    materialId?: number;
    getMaterials: QueryResult<any, {
      first: number;
      orderDirection: string;
      createID: number;
    }>;
    setMaterialId: Dispatch<React.SetStateAction<number | undefined>>;
    composeList: string[];
    setComposeList: Dispatch<React.SetStateAction<string[]>>;
    materialListObj: Dictionary<MaterialItem>;
    setQuery: React.Dispatch<React.SetStateAction<TQuery>>;
    query: TQuery;
    tokenID?: string
  },
);

export const useUserInfo = () => useContext(UserInfoContext);

const convertedData = (item: any) => {
  return {
    composes: item?.composes || [],
    material: {
      id: item?.id,
      compose: item?.composed,
      time: "time",
      position: "position",
      zIndex: "zIndex",
      owner: item?.owner,
      data: item?.dataBytes
    },
    baseInfo: {
      data: item?.rawData,
      category: "category",
      decode: "decode",
      name: "name",
      userId: "userId"
    },
    composeData: []
  } as MaterialItem
}

const useMaterialObj = (list: MaterialItem[]) => {
  return useMemo(() => {
    if (isEmpty(list)) return {} as Dictionary<MaterialItem>
    const obj: Dictionary<MaterialItem> = keyBy(list, (item: MaterialItem) => item?.material?.id);
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
    map(list, (item: MaterialItem) => {
      const data = getData(item)
      if (isEmpty(data)) obj[item?.material?.id].composeData = [item]
      obj[item?.material?.id].composeData = data;
    })
    return obj as Dictionary<MaterialItem>
  }, [list])
}

const useMaterialAndCompose = (data: any[]) => {
  return useMemo(() => {
    if (!data?.length) return {
      list: [],
      composes: []
    } as { list: MaterialItem[], composes: string[] }

    const composes: string[] = []
    const list = map(data, item => {
      composes.push(...(item?.composes || []))
      return convertedData(item)
    })
    return {
      list,
      composes
    } as { list: MaterialItem[], composes: string[] }
  }, [data])
}

const useComposeList = (composes: string[]) => {
  return useQuery(COMPOSE_LIST, {
    variables: { ids: composes },
    skip: composes?.length === 0
  })
}

const useGetData = (materials: any[]) => {
  const { list, composes } = useMaterialAndCompose(materials);
  const getComposes = useComposeList(composes);

  const mergeList = useMemo(() => {
    if (!list) return []
    return [...list, ...map(getComposes?.data?.materials, item => convertedData(item))]
  }, [getComposes?.data?.materials, list]);

  const materialObj = useMaterialObj(mergeList);

  return [list, materialObj] as const
}

type TQuery = {
  owner?: string[],
  id?: string[],
  createID: string
}

const useQueryMaterials = (variables: TQuery) => {
  const [type, setType] = useState<string>("all")
  useEffect(() => {
    console.log(variables)
    if (variables?.owner && !variables?.id) setType("address");
    else if (variables?.id && !variables?.owner) setType("id");
    else if (variables?.id && variables?.owner) setType("address-id");
    else setType("all");
  }, [variables?.owner, variables?.id])

  const getAllMaterials = useQuery(MATERIAL_ALL_LIST, {
    variables: {
      first: 10,
      orderDirection: 'desc',
      createID: variables?.createID
    },
    skip: type !== "all" || !variables?.createID
  })

  const getAddressMaterials = useQuery(MATERIAL_ADDRESS_LIST, {
    variables: {
      first: 10,
      orderDirection: 'desc',
      createID: variables?.createID,
      owner: variables?.owner
    },
    skip: type !== "address" || !variables?.createID
  })

  const getIdMaterials = useQuery(MATERIAL_ID_LIST, {
    variables: {
      first: 10,
      orderDirection: 'desc',
      createID: variables?.createID,
      id: variables?.id
    },
    skip: type !== "id" || !variables?.createID
  })

  const getAddressAndIdMaterials = useQuery(MATERIAL_ADDRESS_ID_LIST, {
    variables: {
      first: 10,
      orderDirection: 'desc',
      createID: variables?.createID,
      owner: variables?.owner,
      id: variables?.id
    },
    skip: type !== "address-id" || !variables?.createID
  })

  const getMaterials = useMemo(() => {
    if (variables?.owner && !variables?.id) return getAddressMaterials;
    if (variables?.id && !variables?.owner) return getIdMaterials;
    if (variables?.id && variables?.owner) return getAddressAndIdMaterials;
    else return getAllMaterials;
  }, [variables, getAllMaterials, getAddressMaterials, getIdMaterials, getAddressAndIdMaterials])
  return getMaterials
}

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [materialId, setMaterialId] = useState<number | undefined>();
  const [composeList, setComposeList] = React.useState<string[]>([])
  const { openLoading, closeDelayLoading } = useLoading();
  const { address, chainId } = useWeb3Info();
  const [tokenID] = useReadContractRequest(PMT721_CurrentID);
  const { searchString } = useQueryString();
  const [query, setQuery] = useState<TQuery>({
    owner: searchString?.owner ? searchString?.owner?.split(",") : undefined,
    id: searchString?.id ? searchString?.id?.split(",") : undefined,
    createID: searchString?.createID || "",
  })

  const addresss = searchString?.address || address
  const getAvater = useQuery(AVATER_LIST, { variables: { address: addresss?.toLowerCase() }, skip: !addresss });
  const userInfo = useMemo(() => getAvater?.data?.avaters ? getAvater?.data?.avaters[0]?.avater : {}, [getAvater?.data?.avaters])
  const createID = useMemo(() => query?.createID ? Number(query?.createID) + 1 : (tokenID ? Number(tokenID) + 1 : tokenID), [tokenID, query?.createID])

  const getMaterials = useQueryMaterials({
    createID: createID ? String(createID) : "",
    owner: query?.owner,
    id: query?.id
  })

  useEffect(() => {
    if (getMaterials?.loading) openLoading()
    else closeDelayLoading()
  }, [getMaterials?.loading])

  const [materialList, materialListObj] = useGetData(getMaterials?.data?.materials);

  return (
    <UserInfoContext.Provider value={{
      getMaterials,
      userInfo,
      materialList,
      materialId,
      setMaterialId,
      composeList,
      setComposeList,
      materialListObj,
      query,
      setQuery,
      tokenID
    } as any}>
      {children}
    </UserInfoContext.Provider>
  )
}