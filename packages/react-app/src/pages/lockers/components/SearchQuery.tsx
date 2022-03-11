import React, { Dispatch, useEffect, useMemo, useState } from "react";
import { Dictionary, filter, groupBy, map, orderBy } from "lodash";
import { Button, Input, Modal, Select } from "antd";
import { useUserInfo } from "../../../components/UserProvider";
import { CloseSquareOutlined } from "@ant-design/icons";
import { MaterialItem } from "../../../components/Card";
import { ComposeDetails } from "./ComposeDetails";
import { useQuery } from "@apollo/client";
import { MATERIAL_LIST, COMPOSE_LIST } from "../../../gql";
const { Option } = Select;

export const ClearIcon = () => <div className="relative bg-white bg-opacity-10"><CloseSquareOutlined className="absolute" style={{ top: -2, left: -2, fontSize: 16 }} /></div>

export const SearchQuery = ({
  setData,
}: {
  setData: Dispatch<React.SetStateAction<MaterialItem[]>>;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { composeList } = useUserInfo()

  const materialListsRes = useQuery(MATERIAL_LIST, {
    variables: {
      first: 24,
      orderDirection: 'asc',
      createID: 50,
    },
    //pollInterval: 10000
  })

  const ids = [20, 30, 40, 50, 60, 70];
  const materialListsRes1 = useQuery(COMPOSE_LIST, {
    variables: { ids, first: ids.length },
    skip: true
  })

  console.log(materialListsRes1?.data?.materials)

  useEffect(() => {
    const data = materialListsRes?.data?.materials
    if (data?.length > 0) {
      console.log(data)
      materialListsRes1.refetch()
      setData(() => {
        return map(data, item => {
          return {
            composes: [],
            material: {
              id: item?.id,
              compose: "0",
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
          }
        })
      })
    }
  }, [materialListsRes.data?.materials])

  const { materialList } = useUserInfo()
  const [{
    sort,
    owner,
    sale,
    category
  }, setList] = useState<Dictionary<any>>({
    sort: "",
    owner: "",
    sale: "",
    category: ""
  })

  const onSearch = (val: any) => {
    setList((pre) => ({ ...pre, owner: val }))
  }

  const shopList = useMemo(() => {
    return groupBy(materialList, item => item?.material?.owner)
  }, [materialList])

  const materialCatagoryList = useMemo(() => {
    return groupBy(materialList, item => item?.baseInfo?.category)
  }, [materialList])

  const saleList = useMemo(() => {
    return groupBy(materialList, item => item?.material?.id)
  }, [materialList])

  const sortList = [
    {
      label: "按时间降序",
      value: "id-desc",
    },
    {
      label: "按时间升序",
      value: "id-asc",
    },
    /* {
      label: "按金额降序",
      value: "price-desc",
    },
    {
      label: "按金额升序",
      value: "price-asc",
    }, */
  ]

  useEffect(() => {
    const ownerList = owner ? filter(materialList as MaterialItem[], item => item?.material?.owner === owner) : materialList
    const categoryList = category ? filter(ownerList as MaterialItem[], item => item?.baseInfo?.category === category) : ownerList
    const saleList = sale ? filter(categoryList as MaterialItem[], item => String(item?.material?.id) === sale) : categoryList
    let sortList;
    if (sort) {
      sortList = orderBy(saleList, [sort?.split("-")[0]], [sort?.split("-")[1]]);
    } else {
      sortList = saleList
    }
    setData(sortList)
  }, [materialList, owner, category, sale, sort])

  return (
    <div className="flex justify-between items-center">
      <Button
        type="primary"
        disabled={composeList?.length < 2}
        onClick={() => { setIsModalVisible(true); }}
      >一键合成</Button>
      <Modal
        title="合成虚拟物品"
        okText={"合成"}
        cancelText="取消"
        width={1000}
        visible={isModalVisible}
        footer={null}
        onCancel={() => { setIsModalVisible(false); }}
      >
        <ComposeDetails setIsModalVisible={setIsModalVisible} />
      </Modal>
      <Input
        style={{ width: 400, marginLeft: 10 }}
        allowClear
        placeholder="所有者地址"
        onChange={(val) => {
          setList((pre) => ({ ...pre, owner: val }))
        }}
      >
      </Input>
      <Input
        style={{ width: 120, marginLeft: 10 }}
        allowClear
        placeholder="物品ID"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sale: val }))
        }}
      >
      </Input>
      {/* <Select
        showSearch
        style={{ width: 330, marginLeft: 10 }}
        allowClear
        placeholder="所有者地址"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, owner: val }))
        }}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        clearIcon={ClearIcon}
      >
        {map(keys(shopList), item => <Option key={item} value={item}>{item}</Option>)}
      </Select>
      <Select
        style={{ width: 120, marginLeft: 10 }}
        allowClear
        placeholder="物品类别"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, category: val }))
        }}
        clearIcon={ClearIcon}
      >
        {map(filter(keys(materialCatagoryList), item=>!!item), item => <Option key={item} value={item}>{filter(categoryData, ite => ite.value === item)[0]?.label}</Option>)}
      </Select>
       */}{/* <Select
        style={{ width: 120, marginLeft: 10 }}
        allowClear
        placeholder="是否收藏"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sale: val }))
        }}
        clearIcon={ClearIcon}
      >
        {map(keys(saleList), item => <Option key={item} value={item}>{item === "true" ? "未收藏" : "已收藏"}</Option>)}
      </Select> */}
      {/* <Select
        style={{ width: 120, marginLeft: 10 }}
        allowClear
        placeholder="排序"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sort: val }))
        }}
        clearIcon={ClearIcon}
      >
        {map(sortList, item => <Option key={item.value} value={item?.value}>{item?.label}</Option>)}
      </Select> */}
    </div>
  )
}