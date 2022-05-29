const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const PMTJSON = require("../artifacts/contracts/PMT721.sol/PMT721.json");
const PMT_ABI = PMTJSON.abi;

use(solidity);

describe("Test My Dapp", function () {
  let PMT721Contract;
  let PMT7212Contract;
  let PixelsMetaverseContract;
  let AvaterContract;
  let owner;
  let PMT, PMT1, PMT2;
  let otherAccount = "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033"

  it("Deploy Contract", async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    const PixelsMetaverse = await ethers.getContractFactory("PixelsMetaverse");
    const Avater = await ethers.getContractFactory("Avater");
    AvaterContract = await Avater.deploy();
    PixelsMetaverseContract = await PixelsMetaverse.deploy(AvaterContract.address);
    await PixelsMetaverseContract.deployed();
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

      PMT = PMT1;
    });

    it("PMT1的minter和owner", async function () {
      const minter = await PMT7212Contract.getMinter();
      expect(minter).to.equal(PixelsMetaverseContract.address);
    });

    it("制作2个虚拟物品0、1", async function () {
      await PixelsMetaverseContract.make(PMT, "name", "rawData", "time", "position", "zIndex", "decode", 2);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(2);
    });

    it("设置头像为0和1", async function () {
      expect((await AvaterContract.avater(owner.address)).id).to.equal(0);
      expect(await AvaterContract.setAvater(PMT, 1, 137)).to.
        emit(AvaterContract, "AvaterEvent").
        withArgs(owner.address, PMT, 1, 137);
      expect((await AvaterContract.avater(owner.address)).id).to.equal(1)
      expect(await AvaterContract.setAvater(PMT, 0, 137)).to.
        emit(AvaterContract, "AvaterEvent").
        withArgs(owner.address, PMT, 0, 137);
      expect((await AvaterContract.avater(owner.address)).id).to.equal(0);
      expect((await AvaterContract.isAvater(PMT, owner.address, 0))).to.equal(true);
    });

    /* it("设置1的配置信息", async function () {
      expect(await PixelsMetaverseContract.setConfig(PMT, 1, "name1", "time1", "position1", "zIndex1", "decode1", 0)).to.
        emit(PixelsMetaverseContract, "ConfigEvent").
        withArgs(1, "name1", "time1", "position1", "zIndex1", "decode1", 0);
    });

    it("设置2的配置信息", async function () {
      expect(await PixelsMetaverseContract.setConfig(PMT, 2, "name12222222", "time1222222", "position12222222", "zIndex1222222", "decode1222222", 0)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(owner.address, 2, 0, 2, "", false);
    }); */

    it("再次制作和1同样的2个虚拟物品2和3", async function () {
      const d = await PixelsMetaverseContract.getMaterial(PMT, 1);
      expect((await PixelsMetaverseContract.getMaterial(PMT, 0)).dataBytes).to.equal(d.dataBytes);

      const currentID1 = await PMT721Contract.currentID()
      expect(currentID1).to.equal(2);
      await PixelsMetaverseContract.reMake(PMT, 1, 2);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(4);
    });

    it("再制作1个虚拟物品4", async function () {
      expect(await PixelsMetaverseContract.make(PMT, "name5", "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads", "time5", "position5", "zIndex5", "decode5", 1)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(owner.address, PMT, 4, 4, 4, "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads", false, 1);
    });

    it("合成2和4为5", async function () {
      expect(await PixelsMetaverseContract.compose(PMT, [{
        pmt721: PMT,
        id: 2
      }, {
        pmt721: PMT,
        id: 4
      }], "name6", "time6", "position6", "zIndex6", "decode6", ethers.utils.formatBytes32String("24"))).to.
        emit(PixelsMetaverseContract, "ConfigEvent").
        withArgs(PMT, 5, "name6", "time6", "position6", "zIndex6", "decode6", 0);
    });

    it("再合成1和3为6", async function () {
      await PixelsMetaverseContract.compose(PMT, [{
        pmt721: PMT,
        id: 1
      }, {
        pmt721: PMT,
        id: 3
      }], "name7", "time7", "position7", "zIndex7", "decode7", ethers.utils.formatBytes32String("13"));
    });

    it("再合成5和6为7", async function () {
      await await PixelsMetaverseContract.compose(PMT, [{
        pmt721: PMT,
        id: 5
      }, {
        pmt721: PMT,
        id: 6
      }], "name8", "time8", "position8", "zIndex8", "decode8", ethers.utils.formatBytes32String("56"));
    });

    it("再次制作3个不同的虚拟物品8、9、10", async function () {
      await PixelsMetaverseContract.make(PMT, "name9", "rawData9", "time9", "position9", "zIndex9", "decode9", 3);
      const m9 = await PixelsMetaverseContract.getMaterial(PMT, 10);
      expect((await PixelsMetaverseContract.getMaterial(PMT, 10)).dataBytes).to.equal(m9.dataBytes);
    });

    it("合并8,9,10到7里面去", async function () {
      const m7 = await PixelsMetaverseContract.composes(PMT, 7)
      expect(m7.id).to.equal(0);
      await PixelsMetaverseContract.addition({
        pmt721: PMT,
        id: 7
      }, [{
        pmt721: PMT,
        id: 8
      }, {
        pmt721: PMT,
        id: 9
      }, {
        pmt721: PMT,
        id: 10
      }]);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
      const m9 = await PixelsMetaverseContract.composes(PMT, 9);
      expect(m9.id).to.equal(7);
    });

    it("移除7里面的10", async function () {
      const m10 = await PixelsMetaverseContract.composes(PMT, 10)
      expect(m10.id).to.equal(7);
      await PixelsMetaverseContract.subtract({
        pmt721: PMT,
        id: 7
      }, [{
        pmt721: PMT,
        id: 10
      }])
      const m1010 = await PixelsMetaverseContract.composes(PMT, 10)
      expect(m1010.id).to.equal(0);
    });

    it("制作1个虚拟物品11", async function () {
      await PixelsMetaverseContract.make(PMT, "name12", "rawData12", "time12", "position12", "zIndex12", "decode12", 1);
    });

    it("再次制作和6一样的2个合成虚拟物品12、13", async function () {
      await PixelsMetaverseContract.reMake(PMT, 6, 2);
    });
  });

  describe("调用PMT721合约函数", async function () {
    it("检查12的所有者", async function () {
      expect(await PMT721Contract.ownerOf(12)).to.equal(owner.address);
    });
    it("转账12给" + otherAccount, async function () {
      expect(await PMT721Contract.transferFrom(owner.address, otherAccount, 12)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(otherAccount, PMT, 12, 0, 0, "", false, 1);
      expect(await PMT721Contract.ownerOf(12)).to.equal(otherAccount);
    });

    it("销毁11", async function () {
      const m10 = await PixelsMetaverseContract.composes(PMT, 11)
      expect(m10.id).to.equal(0);

      expect(await PMT721Contract.burn(11)).to.
        emit(PMT721Contract, "Transfer").
        withArgs(owner.address, ethers.constants.AddressZero, 11);
    });
  });
});
