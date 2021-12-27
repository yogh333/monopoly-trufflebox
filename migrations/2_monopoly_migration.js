Paris = require("../client/src/data/Paris.json");

const MonopolyPawn = artifacts.require("MonopolyPawn");
const MonopolyMono = artifacts.require("MonopolyMono");
const MonopolyBoard = artifacts.require("MonopolyBoard");
const MonopolyProp = artifacts.require("MonopolyProp");
const MonopolyBuild = artifacts.require("MonopolyBuild");
const MonopolyBank = artifacts.require("MonopolyBank");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MonopolyMono, web3.utils.toWei("15000", "ether"));
  const MonopolyMonoInstance = await MonopolyMono.deployed();

  await deployer.deploy(
    MonopolyPawn,
    "Monopoly World Pawns",
    "MWPa",
    "http://token-cdn-uri/"
  );
  const MonopolyPawnInstance = await MonopolyPawn.deployed();

  await deployer.deploy(MonopolyBoard, MonopolyPawnInstance.address);
  const MonopolyBoardInstance = await MonopolyBoard.deployed();

  await deployer.deploy(
    MonopolyProp,
    MonopolyBoardInstance.address,
    "Monopoly World Properties",
    "MWP",
    "http://token-cdn-uri/"
  );

  await deployer.deploy(
    MonopolyBuild,
    MonopolyBoardInstance.address,
    "http://token-cdn-uri/"
  );

  const MonopolyPropInstance = await MonopolyProp.deployed();
  const MonopolyBuildInstance = await MonopolyBuild.deployed();

  await deployer.deploy(
    MonopolyBank,
    MonopolyPropInstance.address,
    MonopolyBuildInstance.address,
    MonopolyMonoInstance.address
  );

  const MonopolyBankInstance = await MonopolyBank.deployed();

  // Setup roles
  // Bank mint Prop & Build
  const MINTER_ROLE = await MonopolyPropInstance.MINTER_ROLE()
  await MonopolyPropInstance.grantRole(MINTER_ROLE, MonopolyBankInstance.address, { "from": accounts[0] })
  await MonopolyBuildInstance.grantRole(MINTER_ROLE, MonopolyBankInstance.address, { "from": accounts[0] })

  // initialize Paris board prices
  let commonLandPrices = []
  let housePrices = []
  Paris.lands.forEach((land, index) => {
    commonLandPrices[index] = 0
    if(land.hasOwnProperty('commonPrice')){
      commonLandPrices[index] = land.commonPrice
    }

    housePrices[index] = 0
    if(land.hasOwnProperty('housePrice')){
      housePrices[index] = land.housePrice
    }
  })

  await MonopolyBankInstance.setPrices(
    Paris.id,
    Paris.maxLands,
    Paris.maxLandRarities,
    Paris.rarityMultiplier,
    Paris.buildingMultiplier,
    commonLandPrices,
    housePrices,
    { "from": accounts[0] }
  );

  const amount = web3.utils.toWei("1000", "ether")

  await MonopolyMonoInstance.mint(
    accounts[1],
    amount
  );

  // Give allowance to contract to spend all $MONO
  await MonopolyMonoInstance.approve(
    MonopolyBankInstance.address,
    amount,
    { "from": accounts[1] }
  )
};
