import { useLocation } from "react-router-dom";
import { Loading, LoadingProvider } from './components/Loading';
import { UserInfoProvider } from './components/UserProvider';
import { PixelsMetaverseContextProvider } from './pixels-metaverse';
import { Header } from './components/Header';
import bgSvg from "./assets/image/bg.svg"
import { Routes } from './routes';
import { useWeb3Info, Web3InfoProvider } from "./web3";
import { ContractRequestContextProvider } from "abi-to-request"
import { abisData } from "./client/abis";

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


const a = { a1: "1312", c: 12312 }
export type TContractList = keyof typeof a

const Main = () => {
  const { pathname } = useLocation()
  const { library } = useWeb3Info()

  return (
    <ContractRequestContextProvider library={library} abisData={abisData}>
      <PixelsMetaverseContextProvider library={library}>
        <LoadingProvider>
          <UserInfoProvider>
            {pathname !== "/" && <Header />}
            <Routes />
            <Loading />
          </UserInfoProvider>
        </LoadingProvider>
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
          <Main />
        </Web3InfoProvider>
      </div>
    </div>
  )
}

export default App;
