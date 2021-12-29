const Prop = artifacts.require("MonopolyProp");
const Pawn = artifacts.require("MonopolyPawn");
const Board = artifacts.require("MonopolyBoard");
const { BN, ether, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

contract("MonopolyProp contract", async (accounts) => {

  let boardInstance;
  let pawnInstance;
  
  
	const zeroAccount = "0x0000000000000000000000000000000000000000";
  const owner = accounts[0];
  const player1 = accounts[1];
  const player2 = accounts[2];

  let propInstance;

  beforeEach(async function () {
		pawnInstance = await Pawn.new("MACRON", "EnMarche", "URI");
    boardInstance = await Board.new(pawnInstance.address, {from:owner});
    propInstance = await Prop.new(
    	boardInstance.address,
    	"name",
    	"symbole",
    	"uri",
     	{from:owner}
   );
  });

  it("should mint prop", async function () {
    var result = await propInstance.mint(player1, 0, 39, 0);
		var token_ID = result.logs[0].args["2"].toString()
    var _bal = await propInstance.balanceOf(player1);
    expect(_bal.toNumber()).to.equal(1, "not minted");
    expectEvent(result, 'Transfer', {from:zeroAccount, to: player1, tokenId:token_ID});
		
		var isMinted = await propInstance.exists(token_ID);
		expect(isMinted).to.equal(true,"not minted");

		var amount = await propInstance.getNbOfProps(0,39,0);
		expect(amount.toNumber()).to.equal(1,"not minted");

		var _prop = await propInstance.get(token_ID);
		expect(_prop[0]).to.equal("0","wrong edition");
		expect(_prop[1]).to.equal("39","wrong land");
		expect(_prop[2]).to.equal("0","wrong rarity");
		expect(_prop[3]).to.equal("0","wrong serial");
  });
});
