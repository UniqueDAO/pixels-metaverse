const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const PMTJSON = require("../artifacts/contracts/PMT721.sol/PMT721.json");
const PMT_ABI = PMTJSON.abi;

use(solidity);

describe("Test My Dapp", function () {
  let PMT20Contract;
  let PMT721Contract;
  let PMT7212Contract;
  let PixelsMetaverseContract;
  let AvaterContract;
  let owner;
  let PMT1, PMT2;
  let otherAccount = "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033"

  it("Deploy Contract", async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    const PixelsMetaverse = await ethers.getContractFactory("PixelsMetaverse");
    const Avater = await ethers.getContractFactory("Avater");
    const PMT20 = await ethers.getContractFactory("PMT20");
    AvaterContract = await Avater.deploy();
    PMT20Contract = await PMT20.deploy();
    PixelsMetaverseContract = await PixelsMetaverse.deploy(AvaterContract.address, PMT20Contract.address);
    await PixelsMetaverseContract.deployed();
    await PMT20Contract.setMinter(PixelsMetaverseContract.address);
  });

  describe("调用PixelsMetaverse合约函数", async function () {
    it("创建PMT721合约", async function () {
      const res1 = await PixelsMetaverseContract.createPMT721('test1', owner.address);
      await res1.wait();
      PMT1 = await PixelsMetaverseContract.newPMT721();
      PMT721Contract = new ethers.Contract(PMT1, PMT_ABI, owner);

      const res2 = await PixelsMetaverseContract.createPMT721('test2', owner.address);
      await res2.wait();
      PMT2 = await PixelsMetaverseContract.newPMT721();

      expect(await PixelsMetaverseContract.PMT721Minter(PMT1)).to.equal(owner.address);
      expect(await PixelsMetaverseContract.PMT721Minter(PMT2)).to.equal(owner.address);
      PMT7212Contract = new ethers.Contract(PMT2, PMT_ABI, owner);
      otherAccount = PMT2;
    });

    it("PMT1制作2个虚拟物品0、1", async function () {
      await PixelsMetaverseContract.make(PMT1, "name", "rawData", "time", "position", "zIndex", "decode", 2);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(2);
    });

    it("设置头像为0和1", async function () {
      expect((await AvaterContract.avater(owner.address)).id).to.equal(0);
      expect(await AvaterContract.setAvater(PMT1, 1, 137)).to.
        emit(AvaterContract, "AvaterEvent").
        withArgs(owner.address, PMT1, 1, 137);
      expect((await AvaterContract.avater(owner.address)).id).to.equal(1)
      expect(await AvaterContract.setAvater(PMT1, 0, 137)).to.
        emit(AvaterContract, "AvaterEvent").
        withArgs(owner.address, PMT1, 0, 137);
      expect((await AvaterContract.avater(owner.address)).id).to.equal(0);
      expect((await AvaterContract.isAvater(PMT1, owner.address, 0))).to.equal(true);
    });

    /* it("设置1的配置信息", async function () {
      expect(await PixelsMetaverseContract.setConfig(PMT1, 1, "name1", "time1", "position1", "zIndex1", "decode1", 0)).to.
        emit(PixelsMetaverseContract, "ConfigEvent").
        withArgs(1, "name1", "time1", "position1", "zIndex1", "decode1", 0);
    });

    it("设置2的配置信息", async function () {
      expect(await PixelsMetaverseContract.setConfig(PMT1, 2, "name12222222", "time1222222", "position12222222", "zIndex1222222", "decode1222222", 0)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(owner.address, 2, 0, 2, "", false);
    }); */

    it("PMT1再制作2个虚拟物品2、3", async function () {
      expect(await PixelsMetaverseContract.make(PMT1, "name5", "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads", "time5", "position5", "zIndex5", "decode5", 2)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(owner.address, PMT1, 2, 2, 2, "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads", false, 2);
    });

    it("PMT1再制作3个虚拟物品4、5、6", async function () {
      expect(await PixelsMetaverseContract.make(PMT1, "name51", "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads123", "time5", "position5", "zIndex5", "decode5", 3)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(owner.address, PMT1, 4, 4, 4, "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads123", false, 3);
    });

    it("PMT2再制作5个虚拟物品0、1、2、3、4", async function () {
      expect(await PixelsMetaverseContract.make(PMT2, "name5", "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads22", "time5", "position5", "zIndex5", "decode5", 5)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(owner.address, PMT2, 0, 0, 0, "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads22", false, 5);
    });

    it("PMT1合成0和2为7", async function () {
      expect(await PixelsMetaverseContract.compose(PMT1, [{
        pmt721: PMT1,
        pmt721_id: 0
      }, {
        pmt721: PMT1,
        pmt721_id: 2
      }], "name6", "time6", "position6", "zIndex6", "decode6")).to.
        emit(PixelsMetaverseContract, "ConfigEvent").
        withArgs(PMT1, 7, "name6", "time6", "position6", "zIndex6", "decode6", 0);
    });

    it("PMT1再合成1和4为8", async function () {
      expect(await PixelsMetaverseContract.compose(PMT1, [{
        pmt721: PMT1,
        pmt721_id: 1
      }, {
        pmt721: PMT1,
        pmt721_id: 4
      }], "name7", "time7", "position7", "zIndex7", "decode7")).to.
        emit(PixelsMetaverseContract, "ConfigEvent").
        withArgs(PMT1, 8, "name7", "time7", "position7", "zIndex7", "decode7", 0);
    });

    it("PMT1再合成3和5为9", async function () {
      await PixelsMetaverseContract.compose(PMT1, [{
        pmt721: PMT1,
        pmt721_id: 3
      }, {
        pmt721: PMT1,
        pmt721_id: 5
      }], "name7", "time7", "position7", "zIndex7", "decode7");
    });

    it("PMT2再次制作和PMT1的0一样的2个合成虚拟物品5、6", async function () {
      await PixelsMetaverseContract.reMake(PMT2, PMT1, 0, 2);
    });

    it("PMT2合成2和3为7", async function () {
      await await PixelsMetaverseContract.compose(PMT1, [{
        pmt721: PMT2,
        pmt721_id: 2
      }, {
        pmt721: PMT2,
        pmt721_id: 3
      }], "name8", "time8", "position8", "zIndex8", "decode8");
    });

    /* it("移除7里面的10", async function () {
      await PixelsMetaverseContract.subtract({
        pmt721: PMT1,
        pmt721_id: 12
      }, [{
        pmt721: PMT1,
        pmt721_id: 10
      }])
    });

    it("移除7里面的10", async function () {
      await PixelsMetaverseContract.subtract({
        pmt721: PMT1,
        pmt721_id: 12
      }, [{
        pmt721: PMT1,
        pmt721_id: 9
      }])
    });

    it("再合成9和10为12", async function () {
      await await PixelsMetaverseContract.compose(PMT1, [{
        pmt721: PMT1,
        pmt721_id: 11
      }, {
        pmt721: PMT1,
        pmt721_id: 9
      }], "name8", "time8", "position8", "zIndex8", "decode8");
    }); */
    return

    it("再次制作3个不同的虚拟物品8、9、10", async function () {
      await PixelsMetaverseContract.make(PMT1, "name9", "rawData9", "time9", "position9", "zIndex9", "decode9", 3);
      const m9 = await PixelsMetaverseContract.getMaterial(PMT1, 10);
      expect((await PixelsMetaverseContract.getMaterial(PMT1, 10)).dataBytes).to.equal(m9.dataBytes);
    });

    it("合并8,9,10到7里面去", async function () {
      const m7 = await PixelsMetaverseContract.composes(PMT1, 7)
      expect(m7).to.equal(0);
      await PixelsMetaverseContract.addition(8, [{
        pmt721: PMT1,
        pmt721_id: 8
      }, {
        pmt721: PMT1,
        pmt721_id: 9
      }, {
        pmt721: PMT1,
        pmt721_id: 10
      }]);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
      const m9 = await PixelsMetaverseContract.composes(PMT1, 9);
      expect(m9).to.equal(8);
    });

    it("制作1个虚拟物品11", async function () {
      await PixelsMetaverseContract.make(PMT1, "name12", "rawData12", "time12", "position12", "zIndex12", "decode12", 1000);
    });

    it("再次制作和6一样的2个合成虚拟物品12、13", async function () {
      await PixelsMetaverseContract.reMake(PMT1, 6, 2);
    });
  });

  describe("调用PMT721合约函数", async function () {
    it("检查12的所有者", async function () {
      expect(await PMT721Contract.ownerOf(9)).to.equal(owner.address);
    });
    it("转账12给" + otherAccount, async function () {
      const c2 = await PMT7212Contract.currentID()
      expect(c2).to.equal(7);
      expect(await PMT721Contract.transferFrom(owner.address, otherAccount, 9)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(otherAccount, PMT1, 9, 0, 0, "", false, 1);
      expect(await PMT721Contract.ownerOf(9)).to.equal(otherAccount);

      const c22 = await PMT7212Contract.currentID()
      expect(c22).to.equal(8);
      expect(await PMT7212Contract.transferFrom(owner.address, PMT1, 7)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(PMT1, otherAccount, 7, 0, 0, "", false, 1);
      expect(await PMT721Contract.ownerOf(9)).to.equal(owner.address);

      const amount = await PMT20Contract.balanceOf(owner.address);
      console.log(amount?.toString())
    });

    /* it("销毁11", async function () {
      const m10 = await PixelsMetaverseContract.composes(PMT1, 9)
      expect(m10).to.equal(0);

      expect(await PMT721Contract.burn(11)).to.
        emit(PMT721Contract, "Transfer").
        withArgs(owner.address, ethers.constants.AddressZero, 9);
    }); */
  });
});
