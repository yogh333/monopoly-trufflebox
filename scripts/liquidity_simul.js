const Rogue = artifacts.require("Rogue");
const Factory = artifacts.require("UniswapV2Factory");
const Router = artifacts.require("UniswapV2Router02");
const Pair = artifacts.require("UniswapV2Pair");
const WMatic =  artifacts.require("./WMATIC");

module.exports = async function(callback) {
	
	async function main() {

		async function liquidity(amount){	
			await wMatic.transfer(PairAddr, amount);
		  await MPs.transfer(PairAddr, 500000);
		  await _pair.mint(accounts[0])
		}
		accounts = await web3.eth.getAccounts();

		const MPs = await Rogue.deployed();
		const _factory = await Factory.deployed();
		const router = await Router.deployed();
		const wMatic = await WMatic.deployed();
	


	  const PairAddr = await _factory.getPair(wMatic.address, MPs.address);
		const _pair = await Pair.at(PairAddr);
	
		console.log(PairAddr);

		var provision = web3.utils.toWei("5","ether");
		var val = web3.utils.toWei("1","ether");
		await wMatic.deposit({value:provision});
		var wMbal = await wMatic.balanceOf(accounts[0]);
		console.log("after exchange ", provision.toString(), "Matic you get ",wMbal.toString(), "Wrapped matic");
		await MPs.allow(accounts[0],accounts[1]);
		await MPs.mint(accounts[0], 2000000);
		var MPbal = await MPs.balanceOf(accounts[0]);
		console.log("Minted ", MPbal.toString(), "pirate Token");
	  	  
	  await liquidity(val.toString());
	  await liquidity(val.toString());

		const LpTokenAmount = await _pair.balanceOf(accounts[0]);
		console.log("pirate/WETH LP Token received: ", LpTokenAmount.toNumber());

		await wMatic.deposit({value:val});
		const wMAddr = await wMatic.address;
		const mPsAddr = await MPs.address;
		const routerAddr = await router.address;
		MPbal = await MPs.balanceOf(accounts[0]);
		wMbal = await wMatic.balanceOf(accounts[0]);
		
		console.log("Before swap MPs: ", MPbal.toString())
		console.log("Before swap MATIC: ", wMbal.toString())
		let path = [wMAddr, mPsAddr];
		await wMatic.approve(routerAddr, val);
		await router.swapExactTokensForTokens(val, 0, path, accounts[0], val);
		MPbal = await MPs.balanceOf(accounts[0]);
		wMbal = await wMatic.balanceOf(accounts[0]);
    console.log("After swap MATIC: ", wMbal.toString());
    console.log("After swap MPs: ", MPbal.toString());
    
		console.log("Before liquidity burn MPs: ", MPbal.toString());
		console.log("Before liquidity burn MATIC: ", wMbal.toString());
		var lpBal = await _pair.balanceOf(accounts[0]);
		console.log("Before liquidity burn LP: ", lpBal.toString());
		await _pair.transfer(PairAddr,lpBal.toString());
		await _pair.burn(accounts[0]);
		MPbal = await MPs.balanceOf(accounts[0]);
		wMbal = await wMatic.balanceOf(accounts[0]);		
		lpBal = await _pair.balanceOf(accounts[0]);
		console.log("After liquidity burn MPs: ", MPbal.toString());
		console.log("After liquidity burn MATIC: ", wMbal.toString());
		console.log("After liquidity burn LP: ", lpBal.toString());
		    
		return true;
	}	

	main().catch((error) => {
  	console.error(error);
  	process.exitCode = 1;
	});
}




