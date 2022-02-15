import { BigNumber, BigNumberish } from "ethers";

export const convertedBigNumber = function (obj: any) {
  let newobj: any = obj.constructor === Array ? [] : {};
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