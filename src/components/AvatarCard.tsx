import message from "antd/lib/message";
import { cloneDeep, find, isEmpty, map } from "lodash";
import {
  PixelsMetaverseImgByPositionData,
  usePixelsMetaverseHandleImg
} from "../pixels-metaverse";
import { useLocation } from "react-router-dom";
import { useUserInfo } from "./UserProvider";
import { fetchBuyGoods, fetchOutfit, useRequest } from "../hook/api";
import { categoryData } from "../pages/produced/components/Submit";
import { useWeb3Info } from "../hook/web3";
import React, { useMemo } from "react";
import { Collection, Composes, MaterialItem, MaterialLabel } from "./Card";

export const AvatarCard = ({ item, type }: {
  item: MaterialItem, type: string
}) => {
  const { address: addresss, networkId } = useWeb3Info()
  const { setSelectList } = usePixelsMetaverseHandleImg()
  const { search } = useLocation()
  const address = search ? search.split("=")[1] : addresss
  const { setGoodsList, goodsListObj, setComposeList, userInfo } = useUserInfo()

  const outfit = useRequest(fetchOutfit, {
    onSuccess: () => {
      message.success("设置成功！")
    }
  }, [address])

  const data = useMemo(() => {
    if (isEmpty(item) || isEmpty(goodsListObj)) return []
    if (isEmpty(item?.composes)) return [({ ...item, data: item?.baseInfo?.data } as any)]
    return map(item?.composeData, it => ({ ...it, data: it?.baseInfo?.data } as any))
  }, [item, goodsListObj])

  return (
    <div
      key={item?.material?.id}
      className="mt-2 item-avatar p-2 flex justify-between border-gray-500 border-b"
    >
      <PixelsMetaverseImgByPositionData
        data={{ ...item, positions: item?.baseInfo?.data, goodsData: data }}
        size={96}
        style={{ background: userInfo?.user?.bgColor || "#e1e1e11a", cursor: 'pointer', boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }}
        onClick={() => {
          setSelectList((pre: any) => {
            const list = cloneDeep(pre) as string[]
            const index = list.indexOf(item?.baseInfo?.data)
            if (index >= 0) {
              list.splice(index, 1)
            } else {
              list.push(item?.baseInfo?.data)
            }
            return list
          })
        }}
      />
      <div className="flex justify-end flex-1">
        <div className="ml-2 flex flex-col justify-between items-end">
          <div className="text-right" style={{ height: 40, textOverflow: "ellipsis", overflow: "hidden" }}>{item?.baseInfo?.name || "这什么鬼"}</div>
          {!(type === "homeBuyGoods" || type === "buyGoods") && <Composes item={item} />}
          <div className="flex justify-end items-center mt-2">
            <MaterialLabel toRight toDetails>{item?.material?.id}</MaterialLabel>
            <MaterialLabel toRight>{(find(categoryData, ite => ite?.value === item?.baseInfo?.category) || {})?.label}</MaterialLabel>
          </div>
          {(type === "homeBuyGoods" || type === "buyGoods") && <Collection item={item} />}
        </div>
      </div>
    </div>
  )
}