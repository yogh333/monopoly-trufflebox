const MonopolyMono = artifacts.require("MonopolyMono");
const MonopolyProp = artifacts.require("MonopolyProp");
const MonopolyBuild = artifacts.require("MonopolyBuild");
const MonopolyBank = artifacts.require("MonopolyBank");

module.exports = async function (deployer) {
  await deployer.deploy(MonopolyMono, web3.utils.toWei("15000", "ether"));
  await deployer.deploy(
    MonopolyProp,
    "Monopoly World Properties",
    "MWP",
    "http://token-cdn-uri/"
  );
  await deployer.deploy(MonopolyBuild, "http://token-cdn-uri/");

  const MonopolyMonoInstance = await MonopolyMono.deployed();
  const MonopolyPropInstance = await MonopolyProp.deployed();
  const MonopolyBuildInstance = await MonopolyBuild.deployed();

  await deployer.deploy(
    MonopolyBank,
    MonopolyPropInstance.address,
    MonopolyBuildInstance.address,
    MonopolyMonoInstance.address
  );
};
