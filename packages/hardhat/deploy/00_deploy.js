const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("PMT721", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const PMT721Contract = await ethers.getContract("PMT721", deployer);

  await deploy("PixelsMetaverse", {
    from: deployer,
    args: [PMT721Contract.address],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const PixelsMetaverseContract = await ethers.getContract("PixelsMetaverse", deployer);

  await PMT721Contract.setMinter(PixelsMetaverseContract.address);
};
module.exports.tags = ["PMT721"];
