import { createContext, ReactNode, useState, useContext, useCallback, useEffect, useMemo } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getChainData, warning } from "../helpers/utilities";
import { IChainData } from "../helpers/types";
import { isEmpty } from "lodash";
import { ethers } from "ethers";

export type TLibrary = ethers.providers.Web3Provider
  | ethers.providers.EtherscanProvider
  | ethers.providers.InfuraProvider
  | ethers.providers.JsonRpcProvider
  | ethers.providers.IpcProvider

export const useMyWeb3 = () => {
  return useCallback(async (setWeb3: (web3: Web3) => void) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          console.log("window.ethereum");
          setWeb3(web3)
        } catch (error) {
          //reject(error);
        }
      } else if (window.web3) {
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        setWeb3(web3)
      } else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        setWeb3(web3)
      }
    });
  }, [])
}

interface IWeb3InfoProps {
  connected?: boolean;
  address?: string;
  chainId?: number;
  web3?: Web3;
  library?: TLibrary;
  networkId?: number,
  web3Modal?: Web3Modal,
  addressBalance?: string,
  chainData?: IChainData,
  killSession?: () => void,
  toConnect?: () => void,
}

const INITIAL_STATE: IWeb3InfoProps = {
  address: "",
  web3: undefined,
  library: undefined,
  connected: false,
  chainId: 1,
  networkId: 1
};

export const Web3InfoContext = createContext({} as IWeb3InfoProps);

export const useWeb3Info = () => useContext(Web3InfoContext);

const getProviderOptions = () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "96f99379cbad4a22a3904f9082b58792"
      }
    }
  };
  return providerOptions;
};

export const useGetWeb3Info = () => {
  const [{
    connected,
    address,
    chainId,
    web3,
    library,
    networkId,
    web3Modal,
    chainData,
    addressBalance
  }, setWeb3Info] = useState<IWeb3InfoProps>({})

  const resetApp = async () => {
    try {
      if (library instanceof ethers.providers.Web3Provider && library?.provider instanceof WalletConnectProvider) {
        library?.provider.wc?.killSession()
      }
    } catch (error) {
      console.log(error)
    }
    await web3Modal?.clearCachedProvider();
    setWeb3Info((pre) => ({ ...pre, ...INITIAL_STATE }));
  };

  useEffect(() => {
    if (chainId) {
      const chainData = getChainData(chainId)
      if (!chainData) {
        warning(parseInt(String(chainId)))
      }
      setWeb3Info((pre) => ({ ...pre, chainData: chainData || null }));
    }
  }, [chainId])

  const network = useMemo(() => !isEmpty(chainData) ? chainData?.network : "mainnet", [chainData]);

  useEffect(() => {
    const web3Modal = new Web3Modal({
      network,
      cacheProvider: true,
      providerOptions: getProviderOptions()
    });
    setWeb3Info((pre) => ({ ...pre, web3Modal }));
  }, [network])

  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      toConnect()
    }
  }, [web3Modal?.cachedProvider])

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }

    provider.on("close", () => resetApp());

    provider.on("accountsChanged", async (accounts: string[]) => {
      await setWeb3Info((pre) => ({ ...pre, address: accounts[0] }));
    });

    provider.on("chainChanged", async (chainId: string) => {
      await setWeb3Info((pre) => ({ ...pre, chainId: parseInt(chainId) }))
    });

    provider.on("networkChanged", async (networkId: string) => {
      await setWeb3Info((pre) => ({ ...pre, networkId: parseInt(networkId) }));
    });
  };

  const toConnect = async () => {
    const instance: ethers.providers.ExternalProvider = await web3Modal?.connect();
    await subscribeProvider(instance);
    let library = new ethers.providers.Web3Provider(instance);
    const signer = library.getSigner();
    const address = await signer.getAddress();
    const chainId = await signer.getChainId()
    const addressBalance = await signer.getBalance()
    const balance = ethers.utils.formatUnits(addressBalance)

    setWeb3Info((pre) => ({
      ...pre,
      library,
      connected: true,
      address,
      chainId,
      networkId: chainId,
      addressBalance: balance
    }));
  };

  return {
    connected,
    address,
    chainId,
    killSession: resetApp,
    toConnect,
    web3,
    networkId,
    chainData,
    addressBalance
  }
}

export const Web3InfoProvider = ({ children }: { children: ReactNode }) => {
  const {
    connected,
    address,
    chainId,
    killSession,
    toConnect,
    web3,
    networkId,
    chainData,
    addressBalance
  } = useGetWeb3Info()

  return (
    <Web3InfoContext.Provider value={{
      connected,
      address,
      chainId,
      killSession,
      toConnect,
      web3,
      networkId,
      chainData,
      addressBalance
    }}>
      {children}
    </Web3InfoContext.Provider>
  )
}