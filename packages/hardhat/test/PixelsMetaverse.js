const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp Test", function () {
  let PMT721Contract;
  let PixelsMetaverseContract;

  describe("Pixels-Metaverse", function () {
    it("Deploy Contract", async function () {
      const PMT721 = await ethers.getContractFactory("PMT721");
      const PixelsMetaverse = await ethers.getContractFactory("PixelsMetaverse");

      PMT721Contract = await PMT721.deploy();
      await PMT721Contract.deployed();
      PixelsMetaverseContract = await PixelsMetaverse.deploy(PMT721Contract.address);
      await PixelsMetaverseContract.deployed();
    });

    describe("Call Functions", function () {
      it("PixelsMetaverseContract.address Should be able to setMinter", async function () {
        await PMT721Contract.setMinter(PixelsMetaverseContract.address);
        expect(await PMT721Contract.minter()).to.equal(PixelsMetaverseContract.address);
      });

      it("Should be able to make", async function () {
        await PixelsMetaverseContract.make("1231", "123123", "123123", "123123", "123123", "123123", 2);
        const [owner] = await ethers.getSigners();
        const currentID = await PMT721Contract.currentID()
        const m = await PixelsMetaverseContract.getMaterial(currentID)
        expect(m.baseInfo.name).to.equal("1231");
        expect(m.material.id).to.equal(currentID);
        expect(m.material.owner).to.equal(owner.address);
      });

      it("Should be able to setMinter", async function () {
        expect(await PMT721Contract.currentID()).to.equal(2);
      });

      // Uncomment the event and emit lines in YourContract.sol to make this test pass

      /*it("Should emit a SetPurpose event ", async function () {
        const [owner] = await ethers.getSigners();

        const newPurpose = "Another Test Purpose";

        expect(await myContract.setPurpose(newPurpose)).to.
          emit(myContract, "SetPurpose").
            withArgs(owner.address, newPurpose);
      });*/
    });
  });
});
