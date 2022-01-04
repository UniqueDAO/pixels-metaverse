import { ChangeEvent, Dispatch, InputHTMLAttributes, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Tooltip, Select, message, Tabs, Button, Radio } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Dictionary, isEmpty, keys, map } from 'lodash';
import { useUserInfo } from '../../../components/UserProvider';
import { PixelsMetaverseImgByPositionData, usePixelsMetaverseHandleImg } from '../../../pixels-metaverse';
import { fetchCompose, fetchGetGoodsIdList, fetchGetMaterialInfo, fetchMake, fetchSubjion, useRequest } from '../../../hook/api';
import { useWeb3Info } from '../../../hook/web3';
import { ClearIcon } from './SearchQuery';
import React from 'react';
import { MaterialItem } from '../../../components/Card';
import { categoryData, IMerchandise, mustNum } from '../../produced/components/Submit';
const { Option } = Select;
const { TabPane } = Tabs;

interface ICompose {
  singles: string[],
  composes: string[],
  composesData: MaterialItem[],
}

const Label = ({ children, noNeed }: { children: ReactNode, noNeed?: boolean }) => {
  return <div className="pd-4 mb-1">{children}{!noNeed && <span className="text-red-500">*</span>}</div>
}

export const ComposeDetails = ({ setIsModalVisible }: { setIsModalVisible: Dispatch<React.SetStateAction<boolean>> }) => {
  const [type, setType] = useState<ICompose>()
  const [tab, setTab] = useState<string>("new")
  const [value, setValue] = React.useState<string>("-1");
  const getGoodsIdList = useRequest(fetchGetGoodsIdList)
  const { composeList, setComposeList, setGoodsList, goodsListObj, userInfo } = useUserInfo()
  const [{
    name,
    category,
  }, setMerchandies] = React.useState<IMerchandise>({
    name: "",
    category: undefined,
    amount: "",
    price: "",
    weight: "",
  })

  const getMaterialInfo = useRequest(fetchGetMaterialInfo);

  const compose = useRequest(fetchCompose, {
    onSuccess: () => {
      message.success("合成成功！")
      setComposeList && setComposeList([])
      getGoodsIdList({ setValue: setGoodsList, createAmount: 1, list: composeList })
      setIsModalVisible(false)
    }
  }, [composeList])

  const jion = useRequest(fetchSubjion, {
    onSuccess: () => {
      message.success(`合成至 ${value} 成功！`)
      setComposeList && setComposeList([])
      getGoodsIdList({ setValue: setGoodsList, list: composeList })
      setIsModalVisible(false)
    }
  }, [value, composeList])

  useEffect(() => {
    if (isEmpty(composeList) || isEmpty(goodsListObj)) return
    const type: ICompose = {
      singles: [],
      composes: [],
      composesData: []
    }
    map(composeList, item => {
      if (isEmpty(goodsListObj[item]?.composes)) {
        type?.singles.push(item)
        type?.composesData.push(goodsListObj[item]);
      } else {
        type?.composes.push(item)
        type.composesData = [...type?.composesData, ...goodsListObj[item]?.composeData];
      }
    })
    setType(type)
  }, [composeList, goodsListObj])

  const data = useMemo(() => {
    if (isEmpty(type?.composesData)) return []
    return map(type?.composesData, it => ({ ...it, data: it?.baseInfo?.data } as any))
  }, [type?.composesData])

  const checkData = useCallback(() => {
    if (!name) {
      message.warn("请输入物品名称");
      return;
    }
    if (!category) {
      message.warn("请选择物品种类");
      return;
    }
    return true;
  }, [name, category]);

  const isUser = useMemo(() => userInfo?.id !== "0", [userInfo]);

  return (
    <div className="rounded-md text-black text-opacity-70 bg-white bg-opacity-10 flex items-center justify-between" style={{ height: 400 }}>
      <PixelsMetaverseImgByPositionData
        data={{ positions: "", goodsData: data }}
        size={400}
        style={{ background: "#323945", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)", marginRight: 20 }} />
      <div className="flex flex-col justify-between h-full">
        {/* {
          isEmpty(type?.composes)
            ? <CreateMaterial name={name} category={category} setMerchandies={setMerchandies} />
            : <Tabs defaultActiveKey="1" centered onChange={(key) => {
              setTab(key)
            }}>
              <TabPane tab="合并为新的物品" key="new">
                <CreateMaterial name={name} category={category} setMerchandies={setMerchandies} />
              </TabPane>
              <TabPane tab="合并至已存在的物品" key="exist">
                <MergeMaterial composes={type?.composes} value={value} setValue={setValue} />
              </TabPane>
            </Tabs>
        } */}
        <CreateMaterial name={name} category={category} setMerchandies={setMerchandies} />
        <Button
          type="primary"
          size="large" onClick={() => {
            if (!isUser) return
            if (tab === "new") {
              const is = checkData()
              if (!is) return
            }
            if (tab === "exist") {
              if (!isNaN(Number(value)) && Number(value) <= 0) {
                message.warn("请选择你要合并到的目标ID");
                return
              }
            }

            if (tab === "new") {
              compose({ ids: composeList, name, category })
            } else {
              jion({ ids: composeList, id: value })
            }
          }}>确定</Button>
      </div>
    </div >
  );
};

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className="pl-2 inputPlaceholder outline-none :focus:outline-none h-10 bg-black bg-opacity-10 rounded-sm w-full"
      {...props}
      placeholder={`请输入${props.placeholder}`}
    />
  )
}

export const CreateMaterial = ({
  name,
  category,
  setMerchandies
}: {
  name: string;
  category?: string,
  setMerchandies: Dispatch<React.SetStateAction<IMerchandise>>
}) => {
  return (
    <div id="create-material" className="overflow-y-scroll" style={{ width: 400 }}>
      <Label>名称</Label>
      <Input value={name} placeholder="物品名称" maxLength={15} onChange={(e) => setMerchandies((pre) => ({ ...pre, name: e.target.value }))} />
      <div className="h-8"></div>
      <Label>种类</Label>
      <Select
        className="select outline-none :focus:outline-none h-10 bg-black bg-opacity-10 rounded w-full"
        bordered={false}
        dropdownClassName="bg-gray-300"
        size="large"
        allowClear
        style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.7) !important" }}
        value={category}
        placeholder="请选择种类"
        optionFilterProp="children"
        onChange={(e: string) => { setMerchandies((pre) => ({ ...pre, category: e })) }}
        clearIcon={ClearIcon}
      >
        {map(categoryData, item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
      </Select>
    </div>
  )
}

export const MergeMaterial = ({ composes, value, setValue }: { composes?: string[], value?: string, setValue: Dispatch<React.SetStateAction<string>> }) => {
  const { goodsListObj } = useUserInfo()

  return <div className="overflow-y-scroll" style={{ width: 400, height: 280 }}>
    <Radio.Group onChange={(e) => {
      setValue(e.target.value)
    }} value={value}>
      {map(composes, item => {
        return (
          <Radio value={item} key={item} style={{ marginTop: 20 }}>
            <div className="flex items-center">
              <div className="inline-block" style={{ width: 50 }}>ID: {item}</div>
              <div className="ellipsis inline-block" style={{ width: 300 }}>{goodsListObj[item]?.baseInfo?.name}</div>
            </div>
          </Radio>
        )
      })}
    </Radio.Group>
  </div>
}