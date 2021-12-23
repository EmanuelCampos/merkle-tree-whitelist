// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


contract Merkle {

  bytes32 public merkleRoot = 0xd4453790033a2bd762f526409b7f358023773723d9e9bc42487e4996869162b6;

  mapping(address => bool) public whitelistClaimed;

  function whitelistMint(bytes32[] calldata _merkleProof) public {

    require(!whitelistClaimed[msg.sender], "Address already claimed");

    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

    require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Invalid proof");

    whitelistClaimed[msg.sender] = true;
  }

}