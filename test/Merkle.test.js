const chai = require('chai');
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

const { expect } = chai;

describe('Merkle Tree', function () {
  before(async function () {
    this.Merkle = await hre.ethers.getContractFactory('Merkle');
  });

  beforeEach(async function () {
    this.merkle = await this.Merkle.deploy();
    await this.merkle.deployed();
  });

  it('Should be able to whitelisted user mint', async function () {
    const [owner, second, third, fourth] = await hre.ethers.getSigners();

    await this.merkle.connect(second).whitelistMint(
      [
        "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9", 
        "0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63"
      ]
    );

    const isWhitelisted = await this.merkle.whitelistClaimed(second.address)

    expect(isWhitelisted).to.be.true;
  });

  it('Should not be able to claim twice', async function () {
    const [owner, second, third, fourth] = await hre.ethers.getSigners();

    await this.merkle.connect(second).whitelistMint(
      [
        "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9", 
        "0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63"
      ]
    );

    await expect(this.merkle.connect(second).whitelistMint(
      [
        "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9", 
        "0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63"
      ])
    ).to.be.revertedWith("Address already claimed");

  });

  it('Should not be able to claim with wrong merkle tree', async function () {
    const [owner, second, third, fourth] = await hre.ethers.getSigners();

    await expect(this.merkle.connect(second).whitelistMint(
      [
        "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9", 
      ]
    )).to.be.revertedWith("Invalid proof");

  })


});