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
        const PixelsMetaverse = await ethers.getContractFactory("PMT721");
        PixelsMetaverseContract = await PixelsMetaverse.deploy();
        await PixelsMetaverseContract.deployed();
    });

    it("PMT1的minter和owner", async function () {
        await PixelsMetaverseContract.mint(owner.address, 1000);
        expect(await PixelsMetaverseContract.balanceOf(owner.address)).to.equal(1000);
    });
});
