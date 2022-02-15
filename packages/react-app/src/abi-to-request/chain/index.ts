import { Dictionary } from "lodash"
import * as tsSupportedChains from "./chains.json"

export interface IAssetData {
  symbol: string;
  name: string;
  decimals: string | number;
  contractAddress?: string;
  balance?: string;
}

export interface IChainData {
  name: string;
  shortName: string;
  chain: string;
  network?: string;
  chainId: number;
  networkId: number;
  rpc: string[];
  nativeCurrency: IAssetData;
  icon?: string;
  faucets?: string[];
  infoURL?: string;
  slip44?: number | string;
  ens?: any;
  explorers?: any;
  title?: string;
  parent?: any
}

export type TChainObj = Dictionary<IChainData>

export const supportedChains: TChainObj = (tsSupportedChains as any)?.default

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