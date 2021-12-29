const Mono = artifacts.require("MonopolyMono");

contract("MonopolyMono contract", async (accounts) => {
  var MonoInstance;
  var deployer;
  var user1;
  var user2;

  /* mint 1000 $MONO to every account  */
  var mint = async (accounts) => {
    for (let i = 0; i < accounts.length; i++) {
      await MonoInstance.mint(accounts[i], web3.utils.toWei("1000", "ether"));
    }
  };

  beforeEach(async function () {
    /* deploy $MONO ERC-20 with a max supply */
    let max_supply = web3.utils.toBN(accounts.length * 1000);
    MonoInstance = await Mono.new(web3.utils.toWei(max_supply, "ether"));
    deployer = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
  });

  it.only("should mint 1000 $MONO to every account", async function () {
    await mint(accounts);

    for (let i = 0; i < accounts.length; i++) {
      let balance = await MonoInstance.balanceOf(accounts[i]);
      expect(balance.toString()).to.equal(web3.utils.toWei("1000", "ether"));
    }
  });

  it.only("should fail when minting exceeds token max supply", async function () {
    await mint(accounts);

    try {
      await MonoInstance.mint(user1, web3.utils.toWei("1000", "ether"));
    } catch (err) {
      assert(true);
      return;
    }
    assert(false, "error");
  });

  it("should let user1 to burn 500 $MONO", async function () {
    await mint(accounts);

    await MonoInstance.burn(web3.utils.toWei("500", "ether"), { from: user1 });

    expect(await MonoInstance.balanceOf(user1)).to.equal(
      web3.utils.toWei("500", "ether")
    );
  });
});
