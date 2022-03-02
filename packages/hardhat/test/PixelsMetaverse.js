const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Test My Dapp", function () {
  let PMT721Contract;
  let PixelsMetaverseContract;
  let owner;
  let otherAccount = "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033"

  it("Deploy Contract", async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    const PMT721 = await ethers.getContractFactory("PMT721");
    const PixelsMetaverse = await ethers.getContractFactory("PixelsMetaverse");

    PMT721Contract = await PMT721.deploy();
    await PMT721Contract.deployed();
    PixelsMetaverseContract = await PixelsMetaverse.deploy(PMT721Contract.address);
    await PixelsMetaverseContract.deployed();
  });

  describe("调用PixelsMetaverse合约函数", async function () {
    it("设置PMT721的发行者", async function () {
      await PMT721Contract.setMinter(PixelsMetaverseContract.address);
      expect(await PMT721Contract.minter()).to.equal(PixelsMetaverseContract.address);
    });

    it("制作2个虚拟物品", async function () {
      await PixelsMetaverseContract.make("name", "data", "123123", "123123", "123123", "123123", 2);
      const currentID = await PMT721Contract.currentID()
      const material = await PixelsMetaverseContract.material(currentID)
      expect(material.owner).to.equal(owner.address);
      const m = await PixelsMetaverseContract.getMaterial(currentID)
      expect(m.baseInfo.name).to.equal("name");
      expect(m.material.id).to.equal(currentID);
      expect(m.material.owner).to.equal(owner.address);
      //expect(m.material.data).to.equal(ethers.utils.formatBytes32String("data"));
    });

    it("再次制作同样的2个虚拟物品", async function () {
      const currentID1 = await PMT721Contract.currentID()
      expect(currentID1).to.equal(2);
      await PixelsMetaverseContract.reMake(2, 2);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(4);
      const material = await PixelsMetaverseContract.material(currentID)
      expect(material.owner).to.equal(owner.address);
      const m = await PixelsMetaverseContract.getMaterial(currentID)
      expect(m.baseInfo.name).to.equal("name");
      expect(m.material.id).to.equal(4);
      expect(m.material.owner).to.equal(owner.address);
    });

    it("再制作1个虚拟物品", async function () {
      expect(await PixelsMetaverseContract.make("name", "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads", "123123", "123123", "123123", "123123", 1)).to.
        emit(PixelsMetaverseContract, "MakeEvent").
        withArgs(5, "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads");
    });

    it("合成2和4为第6个物品", async function () {
      expect(await PixelsMetaverseContract.compose([2, 4], "compose test6", "", "", "", "")).to.
        emit(PixelsMetaverseContract, "MakeEvent").
        withArgs(6, "");
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(6);
      const m6 = await PixelsMetaverseContract.getMaterial(6)
      expect(m6.baseInfo.name).to.equal("compose test6");
      const m = await PixelsMetaverseContract.getMaterial(2)
      expect(m.material.owner).to.equal(owner.address);
      expect(m.material.compose).to.equal(6);
    });

    it("再合成1和3为第7个物品", async function () {
      await PixelsMetaverseContract.compose([1, 3], "compose test7", "", "", "", "");
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(7);
      const m6 = await PixelsMetaverseContract.getMaterial(7)
      expect(m6.baseInfo.name).to.equal("compose test7");
      const m = await PixelsMetaverseContract.getMaterial(3)
      expect(m.material.owner).to.equal(owner.address);
      expect(m.material.compose).to.equal(7);
    });

    it("再合成5和6为第8个物品", async function () {
      await PixelsMetaverseContract.compose([5, 6], "compose test8", "", "", "", "");
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(8);
      const m6 = await PixelsMetaverseContract.getMaterial(8)
      expect(m6.baseInfo.name).to.equal("compose test8");
      const m = await PixelsMetaverseContract.getMaterial(6)
      expect(m.material.owner).to.equal(owner.address);
      expect(m.material.compose).to.equal(8);
    });

    it("再次制作3个不同的虚拟物品", async function () {
      await PixelsMetaverseContract.make("name3", "data3", "xxx", "xxx", "xxx", "xxx", 3);
      const m9 = await PixelsMetaverseContract.material(9)
      expect(m9.compose).to.equal(0);
      expect(m9.id).to.equal(9);
      expect(m9.owner).to.equal(owner.address);
      const m11 = await PixelsMetaverseContract.getMaterial(11)
      expect(m11.baseInfo.name).to.equal("name3");
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
    });

    it("合并9到6里面去", async function () {
      const m6 = await PixelsMetaverseContract.material(6)
      expect(m6.compose).to.equal(8);
      expect(m6.owner).to.equal(owner.address);
      expect(await PixelsMetaverseContract.addition(6, [9])).to.
        emit(PixelsMetaverseContract, "ComposeEvent").
        withArgs(owner.address, 0, 6, 9);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
      const m9 = await PixelsMetaverseContract.material(9)
      expect(m9.compose).to.equal(6);
    });

    it("合并10和7到8里面去", async function () {
      await PixelsMetaverseContract.addition(8, [10, 7]);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
      const m7 = await PixelsMetaverseContract.material(7)
      expect(m7.compose).to.equal(8);
    });

    it("移除8里面的10", async function () {
      const m10 = await PixelsMetaverseContract.material(10)
      expect(m10.compose).to.equal(8);
      expect(await PixelsMetaverseContract.subtract(8, [10])).to.
        emit(PixelsMetaverseContract, "ComposeEvent").
        withArgs(owner.address, 8, 0, 10);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
      const m1010 = await PixelsMetaverseContract.material(10)
      expect(m1010.compose).to.equal(0);
      const m1 = await PixelsMetaverseContract.material(1)
      expect(m1.compose).to.equal(7);
    });

    it("制作1个虚拟物品", async function () {
      await PixelsMetaverseContract.make("name", "x", "123123", "123123", "123123", "123123", 1);
      const currentID = await PMT721Contract.currentID()
      const material = await PixelsMetaverseContract.material(currentID)
      expect(material.owner).to.equal(owner.address);
      const m = await PixelsMetaverseContract.getMaterial(currentID)
      expect(m.baseInfo.name).to.equal("name");
      expect(m.material.id).to.equal(currentID);
      expect(m.material.owner).to.equal(owner.address);
    });
  });

  describe("调用PMT721合约函数", async function () {
    it("检查11是否存在", async function () {
      expect(await PMT721Contract.exits(11)).to.equal(true);
    });
    it("检查11的所有者", async function () {
      expect(await PMT721Contract.ownerOf(11)).to.equal(owner.address);
    });
    it("转账11给" + otherAccount, async function () {
      const m11 = await PixelsMetaverseContract.material(11)
      expect(m11.owner).to.equal(owner.address);
      expect(await PMT721Contract.ownerOf(11)).to.equal(owner.address);
      await PMT721Contract.transferFrom(owner.address, otherAccount, 11)
      expect(await PMT721Contract.ownerOf(11)).to.equal(otherAccount);
      const m1111 = await PixelsMetaverseContract.material(11)
      expect(m1111.compose).to.equal(0);
      expect(m1111.owner).to.equal(otherAccount);
    });
    it("销毁10", async function () {
      const m10 = await PixelsMetaverseContract.material(10)
      expect(m10.compose).to.equal(0);
      expect(m10.owner).to.equal(owner.address);
      expect(m10.id).to.equal(10);

      expect(await PMT721Contract.burn(10)).to.
        emit(PMT721Contract, "Transfer").
        withArgs(owner.address, ethers.constants.AddressZero, 10);
      const m1010 = await PixelsMetaverseContract.material(10)
      expect(m1010.compose).to.equal(0);
      expect(m1010.owner).to.equal(ethers.constants.AddressZero);
      expect(m1010.id).to.equal(0);
      expect(await PMT721Contract.balanceOf(otherAccount)).to.equal(1);
    });
  });
});
