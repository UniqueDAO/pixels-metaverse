import { useLocation } from "react-router-dom";
import { Loading, LoadingProvider, useLoading } from './components/Loading';
import { UserInfoProvider } from './components/UserProvider';
import { PixelsMetaverseContextProvider } from './pixels-metaverse';
import { Header } from './components/Header';
import bgSvg from "./assets/image/bg.svg"
import { Routes } from './routes';
import { abis } from "./client/abis";
import { ContractRequestContextProvider, useWeb3Info, Web3InfoProvider } from "abi-to-request";

declare global {
  // tslint:disable-next-line
  interface Window {
    web3: any;
    ethereum: any;
    Web3Modal: any;
    Box: any;
    box: any;
    space: any;
    [name: string]: any;
  }
}

const Main = () => {
  const { pathname } = useLocation()
  const { library } = useWeb3Info()
  const { openLoading, closeDelayLoading } = useLoading()

  return (
    <ContractRequestContextProvider
      library={library}
      abis={abis}
      transactionHook={{
        onSuccessBefore: (res) => {
          openLoading()
          console.log(res, "进入全局钩子 onSuccessBefore")
        },
        onSuccess: (res) => {
          console.log(res, "进入全局钩子 onSuccess")
        },
        onFinish: (res) => {
          closeDelayLoading()
          console.log(res, "进入全局钩子 onFinish")
        },
        onFail: (res) => {
          console.log(res, "进入全局钩子 onFail")
        },
        onTransactionSuccess: (res) => {
          console.log(res, "进入全局钩子 onTransactionSuccess")
        }
      }}>
      <PixelsMetaverseContextProvider library={library}>
        <UserInfoProvider>
          {pathname !== "/" && <Header />}
          <Routes />
          <Loading />
        </UserInfoProvider>
      </PixelsMetaverseContextProvider>
    </ContractRequestContextProvider>
  )
}

const App = () => {
  return (
    <div className="relative bg-white overflow-hidden" style={{ minWidth: 1400, minHeight: 600 }}>
      <div className="relative w-full h-full min-h-screen mx-auto bg-no-repeat md:bg-contain bg-cover bg-gray-900"
        style={{ backgroundImage: `url(${bgSvg})` }}>
        <Web3InfoProvider>
          <LoadingProvider>
            <Main />
          </LoadingProvider>
        </Web3InfoProvider>
      </div>
    </div>
  )
}

export default App;
