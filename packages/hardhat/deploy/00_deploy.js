const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log(deployer, "deployer")

  const Avater = await deploy("Avater", {
    from: deployer,
    log: true,
  });
  console.log("Avater", Avater.address)

  const PixelsMetaverse = await deploy("PixelsMetaverse", {
    from: deployer,
    args: [Avater.address],
    log: true,
  });
  console.log("PixelsMetaverse", PixelsMetaverse.address)
};
module.exports.tags = ["PMT721"];
