pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>



// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721MintableComplete {

    Verifier verifier;

    struct Solution {
        bytes32 index;
        address add;
    }

    mapping(bytes32 => Solution) public solutionSubmitted;

    event SolutionAdded(bytes32 index, address add);

    constructor(address _verifierContract) public {
        verifier = Verifier(_verifierContract);
    }

    function getSolutionKey(uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
    }

    function addSolution(bytes32 index, address add) public {
        require(solutionSubmitted[index].index == 0, "SOLUTION ALREADY SUBMITTED");
        solutionSubmitted[index] = Solution(index, add);
        emit SolutionAdded(index, add);
    }

    function mintToken(address to,
            uint256 tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input) public onlyOwner returns (bool) {
        require(verifier.verifyTx(a, a_p,  b, b_p, c, c_p, h, k, input) == true, "ERROR VERIFYING");

        bytes32 key = getSolutionKey(a, a_p,  b, b_p, c, c_p, h, k, input);
        addSolution(key, msg.sender);
        mint(to, tokenId);
        return true;
    }



}

// TODO define a solutions struct that can hold an index & an address


// TODO define an array of the above struct


// TODO define a mapping to store unique solutions submitted



// TODO Create an event to emit when a solution is added



// TODO Create a function to add the solutions to the array and emit the event



// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

  
contract Verifier {
    function verifyTx(
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input
        ) public returns (bool r);
}

























