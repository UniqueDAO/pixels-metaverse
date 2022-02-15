import { BigNumber, BigNumberish } from "ethers";
import { IChainData, supportedChains } from "../chain";

export function getChainData(chainId: number): IChainData {
  const chainData = supportedChains[parseInt(String(chainId))] || supportedChains[String(chainId)]

  const API_KEY = process.env.REACT_APP_INFURA_ID;

  if (
    chainData?.rpc.includes("infura.io") &&
    chainData?.rpc.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc[0] && chainData.rpc[0].replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc: [rpcUrl]
    };
  }

  return chainData;
}

export const convertedBigNumber = function (obj: any) {
  let newobj:any = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object' || obj instanceof BigNumber) {
    return getNumberStr(obj)
  } else {
    for (let i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? convertedBigNumber(obj[i]) : getNumberStr(obj[i]);
    }
  }
  return newobj;
};

export const getNumberStr = (bigNumber?: BigNumberish) => {
  if (bigNumber && bigNumber instanceof BigNumber) {
    return bigNumber.toString()
  }
  return bigNumber
}