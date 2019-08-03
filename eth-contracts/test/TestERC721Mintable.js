var ERC721MintableComplete = artifacts.require("ERC721MintableComplete");

contract("TestERC721Mintable", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[3];

  describe("match erc721 spec", function() {
    beforeEach(async () => {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      await this.contract.mint(account_two, 1);
      await this.contract.mint(account_two, 2);
    });

    it("should return total supply", async () => {
      assert((await this.contract.totalSupply()) == 2);
    });

    it("should get token balance", async () => {
      let balance = await this.contract.balanceOf.call(account_two);
      assert(balance == 2);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async () => {
      assert(
        (await this.contract.tokenURI(2)) ==
          "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2"
      );
    });

    it("should transfer token from one owner to another", async () => {
      const before = await this.contract.ownerOf(1);

      await this.contract.transferFrom(account_two, account_three, 1, {
        from: account_two
      });
      const after = await this.contract.ownerOf(1);

      assert(before == account_two);
      assert(after == account_three);
    });
  });

  describe("have ownership properties", function() {
    beforeEach(async () => {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async () => {
      try {
        await this.contract.mint(account_two, 1, {
          from: account_two
        });
      } catch (error) {
        assert.isAbove(error.message.search("caller is not the owner"), -1);
      }
    });

    it("should return contract owner", async () => {
      const owner = await this.contract.owner();

      assert(owner == account_one);
    });
  });
});
