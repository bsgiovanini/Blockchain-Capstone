const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");

const proof = {
  proof: {
    A: [
      "0x1d9fb04f74385ff3a96ad0bd0fdd7f50e1a9939f02bcc8f3fe7fbbbded9d37e0",
      "0xa0f18178a3ea4a9c52163012f8424bbaca554b44021b8c61298ad6bbeb72f12"
    ],
    A_p: [
      "0x3132d8822068b2f59244f79cdf6db91c798470a0b111f4cec4d601133f1015b",
      "0x29b12b4e888ba97fafa950c357973fc69bac881e594054bd68dfbabb81d5ec6e"
    ],
    B: [
      [
        "0x16a66132b172d5131435bbcc227ee3cef025e767565f65b2b3271c4176fd9208",
        "0x162604f4962d9a068d9b3e47f68e8818120117e8ac2cf8425d58debf796f7bb"
      ],
      [
        "0xdd95a88da01b933e1cf15dcfe89910a95f398839b88446f8ac3d16480dcad64",
        "0x256df9a6c4b6db6a38f80f1d90440c2a8b70b3a798d0336b68545d9a792c8da4"
      ]
    ],

    B_p: [
      "0x5e942ec98c4a39de7d7821e664cad8724672b0c610a40e7acd84dc18859e62f",
      "0xcc545cba4a582e888d6901082f7614c7bdc4308ffdccfd34f3ee52d15d7270f"
    ],
    C: [
      "0x2125a5bc5362e4173e2219be0006a75bf131eddb9241d7fd9f383cfd9fead3a4",
      "0x11d9b2ff68fbc2e7b3d21c06432547bb1c58a3454a1ba84b64ea1b97110f0b7d"
    ],
    C_p: [
      "0x2b469332c3f7a03033e50330ef7cefe72ca4d4a6c8bb7834e37edd8e21c30f74",
      "0x6063b78504965e7d3f25261476e428f8e291d5745ddcd0fd42848006848c219"
    ],
    H: [
      "0x1e9945dca5ed8c931c2b62dc71dc20293fd91707dd970124b10f7b09e1529fa5",
      "0x1e131d5c3dcb1052ecde2c4f32a1b6b5855b40ed7a60a6459d64dd03b679b2b8"
    ],
    K: [
      "0x183a4841994c3e1fbd63d82d551079f8296c57983adeea0889c46204f05e1f33",
      "0x138b90d003b331329b93ab04692f64f8ccc9b9c5c14ca3cb5f0f62a0d24c723c"
    ]
  },
  input: [9, 1]
};

contract("TestSolnSquareVerifier", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("Solnverifier tests", function() {
    beforeEach(async () => {
      const verifier = await Verifier.new();

      this.contract = await SolnSquareVerifier.new(verifier.address, {
        from: account_one
      });
    });

    it(" Test if a new solution can be added for contract ", async () => {
      const key = await this.contract.getSolutionKey.call(
        proof.proof.A,
        proof.proof.A_p,
        proof.proof.B,
        proof.proof.B_p,
        proof.proof.C,
        proof.proof.C_p,
        proof.proof.H,
        proof.proof.K,
        proof.input
      );

      await this.contract.addSolution(key, account_one);

      const solution = await this.contract.solutionSubmitted.call(key);

      assert(solution);

      try {
        await this.contract.addSolution(key, account_one);
      } catch (error) {
        assert.isAbove(error.message.search("SOLUTION ALREADY SUBMITTED"), -1);
      }
    });

    it("Test if an ERC721 token can be minted for contract", async () => {
      await this.contract.mintToken(
        account_two,
        1,
        proof.proof.A,
        proof.proof.A_p,
        proof.proof.B,
        proof.proof.B_p,
        proof.proof.C,
        proof.proof.C_p,
        proof.proof.H,
        proof.proof.K,
        proof.input
      );

      let balance = await this.contract.balanceOf.call(account_two);
      assert(balance == 1);
    });
  });
});
