import { useCallback, useEffect, useState } from "react";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import { TransactionReceipt as Web3TransactionReceipt } from 'web3-core';
import { lowerFirst } from "lodash";
import { TContract, useContractRequest } from "../contract";

/**
 * contractName 当前合约的名字
 * functionName 当前调用函数的名字
 * data 返回的数据，包括read获取的数据、write写入的返回的数据以及待打包的返回值、报错信息等
 */
export type THandleHookArg<K> = {
  contractName: string,
  functionName: string,
  data?: K
}

/**
 * onSuccessBefore 交易成功提交之前 或者 读取数据成功之前，可以用于加载loading等
 * onSuccess 交易成功提交但此时还未打包成功 或者 读取数据成功
 * onTransactionSuccess 写入数据等上链交易成功
 * onFail 读取或写入交易失败
 * onFinish 执行结束，无论成功还是失败
 * isGlobalTransactionHookValid 是否全局交易钩子有效
 */
export interface IHandleRequest<K> {
  onSuccessBefore?: (arg: THandleHookArg<K>) => void,
  onSuccess?: (arg: THandleHookArg<K>) => void,
  onTransactionSuccess?: (arg: THandleHookArg<TransactionReceipt>) => void,
  onFail?: (arg?: THandleHookArg<any>) => void,
  onFinish?: (arg?: THandleHookArg<any>) => void,
  isGlobalTransactionHookValid?: boolean
}

export type IFetch<K, T> = (contract: TContract, arg?: T) => Promise<K>

// 如果有全局钩子，那么单个请求相应的钩子函数会覆盖全局的钩子函数。如果希望全局的也有效，则需要设置isGlobalTransactionHookValid为true
const handleTransactionHook = <K,>(handle: any, globalHandle: any, arg: THandleHookArg<K>, isGlobalTransactionHookValid?: boolean) => {
  // 在设置了isGlobalTransactionHookValid为true时或者没有单个请求相应的钩子函数时，才执行全局钩子函数
  if (isGlobalTransactionHookValid || (!handle && isGlobalTransactionHookValid === undefined)) {
    globalHandle && globalHandle(arg)
  }
  handle && handle(arg)
}

const useRequestContract = <T, K>(
  fetch: IFetch<K, T>,
  {
    onSuccessBefore,
    onTransactionSuccess,
    onSuccess,
    onFail,
    onFinish,
    isGlobalTransactionHookValid: isValid
  }: IHandleRequest<K> = {},
  rely: any[] = []
) => {
  const { contracts, transactionHook } = useContractRequest()

  return useCallback(async (arg?: T) => {
    if (!contracts) return
    const contractName = fetch.name.split("_")[0]
    const functionName = lowerFirst(fetch.name.split("_")[1])
    const contract = contracts[contractName];
    if (!contract) return
    const name = { functionName, contractName }
    try {
      handleTransactionHook(onSuccessBefore, transactionHook?.onSuccessBefore, name, isValid)
      const res = await fetch(contract, arg)
      if ((res as unknown as TransactionResponse)?.wait) {
        (res as unknown as TransactionResponse)?.wait().then((receipt: TransactionReceipt) => {
          handleTransactionHook(onTransactionSuccess, transactionHook?.onTransactionSuccess, { ...name, data: receipt }, isValid)
        })
      }

      if ((res as unknown as Web3TransactionReceipt)?.status !== undefined) {
        handleTransactionHook(onTransactionSuccess, transactionHook?.onTransactionSuccess, { ...name, data: res }, isValid)
      }

      handleTransactionHook(onSuccess, transactionHook?.onSuccess, { ...name, data: res }, isValid);
      handleTransactionHook(onFinish, transactionHook?.onFinish, { ...name, data: res }, isValid)

      return { successValue: res }
    } catch (error) {
      handleTransactionHook(onFail, transactionHook?.onFail, { ...name, data: error }, isValid)
      handleTransactionHook(onFinish, transactionHook?.onFinish, { ...name, data: error }, isValid)

      return { failError: error }
    }
  }, [contracts, ...rely])
}

// 侧重于调用，故函数在前
export const useRequest = <T, K>(
  fetch: IFetch<K, T>,
  option: IHandleRequest<K> & { arg?: T } = {},
  rely: any[] = []
) => {
  const [returnValue, setReturnValue] = useState<K>();
  const { contracts } = useContractRequest()

  const setFun = useRequestContract(
    fetch,
    {
      ...option,
      onSuccess: (arg) => {
        setReturnValue(arg?.data)
        option?.onSuccess && option?.onSuccess(arg)
      },
    },
    rely
  )
  const contractName = fetch.name.split("_")[0];
  const contract = contracts && contracts[contractName] ? contracts[contractName] : undefined;

  const writeFun = useCallback(async (params?: T) => {
    return await setFun({ ...(option?.arg ? option?.arg : {}), ...(params ? params : {}) } as any)
  }, [contract, setFun, option?.arg])

  return [writeFun, returnValue] as const
}

// 侧重于获取值，故返回值在前（该hook仅用于直接获取合约的值，无法写入数据） 默认不执行全局钩子
export const useImmediateReadContractRequest = <T, K>(
  fetch: IFetch<K, T>,
  option: IHandleRequest<K> & { arg?: T } = {},
  rely: any[] = []
) => {
  const [returnValue, setReturnValue] = useState<K>();
  const { contracts } = useContractRequest()

  const getData = useRequestContract(
    fetch,
    {
      ...option,
      isGlobalTransactionHookValid: option.isGlobalTransactionHookValid === undefined ? false : option.isGlobalTransactionHookValid,
      onSuccess: (arg) => {
        setReturnValue(arg?.data)
        option?.onSuccess && option?.onSuccess(arg)
      },
    },
  )
  const contractName = fetch.name.split("_")[0];
  const contract = contracts && contracts[contractName] ? contracts[contractName] : undefined;

  useEffect(() => {
    if (!contract) return;
    getFun()
  }, [contract])

  const getFun = useCallback(async (params?: T) => {
    return await getData({ ...(option?.arg ? option?.arg : {}), ...(params ? params : {}) } as any)
  }, [contract, getData, option?.arg, ...rely])

  return [returnValue, getFun] as const
}