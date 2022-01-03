var MPs = artifacts.require("Rogue");
var WMATIC  = artifacts.require("./WMATIC.sol");
var UniswapV2Factory = artifacts.require("./UniswapV2Factory.sol");
var UniswapV2Router02 = artifacts.require("./UniswapV2Router02.sol");


module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(UniswapV2Factory, accounts[0]);
	const _factory = await UniswapV2Factory.deployed();
	await deployer.deploy(WMATIC);
	const _WMATIC = await WMATIC.deployed();
	await deployer.deploy(UniswapV2Router02, _factory.address, _WMATIC.address);
	await deployer.deploy(MPs);
	const _MPs = await MPs.deployed();
  await _factory.createPair(_WMATIC.address, _MPs.address);
  const PairAddr = await _factory.getPair(_WMATIC.address, _MPs.address);
  await console.log(PairAddr);
};
