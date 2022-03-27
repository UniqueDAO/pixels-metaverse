import React, { useEffect, useMemo, useState } from "react";
import { SearchQuery } from "./components/SearchQuery";
import { MaterialCard } from "./components/MaterialCard";
import { DataStateBox } from "../../components/DataStateBox";
import { first, last, map } from "lodash";
import { MaterialItem } from "../../components/Card";
import { useUserInfo } from "../../components/UserProvider";
import Pagination from "antd/lib/pagination/Pagination";
import { useQueryString } from "../../helpers/utilities";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";
import { Input } from "antd";

export const Lockers = () => {
  const { materialList, tokenID, setQuery, query } = useUserInfo()
  const { searchString, setSearchString } = useQueryString();
  const [createID, setCreateID] = useState("")
  useEffect(() => { setCreateID(query?.createID) }, [query?.createID])

  const defaultPage = useMemo(() => (Number(tokenID) - Number(searchString?.createID || tokenID)) / 10 + 1, [searchString, tokenID])

  return (
    <main className="pt-20">
      <div className="m-auto p-6 rounded-md w-5/6"
        style={{
          background: "rgba(225,225,225, 0.05)",
          height: "calc(100vh - 90px)",
          color: "rgba(225, 225, 225, 0.8)",
          minWidth: 1200
        }}>
        <div className="mb-4 flex justify-between">
          <div className="text-2xl">储物室</div>
          <SearchQuery />
        </div>
        <DataStateBox data={materialList} styleCSS={{ height: "calc(100vh - 200px)" }}>
          <div>
            <div className="flex flex-wrap overflow-scroll" style={{ height: "calc(100vh - 200px)" }}>
              {map(materialList, (item, i) => {
                if (item?.baseInfo?.userId === "0" && item?.material?.id === "0") return null
                return <MaterialCard key={`${i}`} item={item} />
              })}
            </div>
          </div>
        </DataStateBox>
        {!searchString?.id && <div className="flex justify-center mt-2">
          <div className="flex justify-between items-center">
            <Input
              style={{ width: 100, marginLeft: 10, marginRight: 10 }}
              size="small"
              allowClear
              placeholder="跳转至ID"
              value={createID}
              onPressEnter={() => {
                setQuery((pre) => {
                  const data = {
                    ...pre,
                    createID: createID
                  }
                  setSearchString(data)
                  return data
                })
              }}
              onChange={(val) => {
                setCreateID(val?.target?.value)
              }}
            ></Input>
            <RightOutlined className="cursor-pointer mx-4" onClick={() => {
              setQuery((pre) => {
                const data = {
                  ...pre,
                  createID: last(materialList)?.material?.id ? String(Number(last(materialList)?.material?.id) - 1) : ""
                }
                setSearchString(data)
                return data
              })
            }} />
          </div>
        </div>}
      </div>
    </main>
  )
}