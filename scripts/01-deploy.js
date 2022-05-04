const hre = require("hardhat");

async function main() {
  const NFT = await hre.thor.getContractFactory("NFT");
  const nft = await NFT.deploy();

  await nft.deployed();

  const ExampleLogic = await hre.thor.getContractFactory("ExampleLogic");
  const logic = await ExampleLogic.deploy(nft.address);

  await logic.deployed();

  console.log("nft deployed to:", nft.address);
  console.log("logic deployed to:", logic.address);


  const [deployer] = await hre.thor.getSigners()
  const deployerAddress = await deployer.getAddress()


  const deployedLogic = await hre.thor.getContractAt('ExampleLogic', logic.address)
  const rateLimitBefore = await deployedLogic.rateLimitSponsorFor(deployerAddress, nft.address, '0x')
  console.log('rate limit before minting', rateLimitBefore)

  await nft.mint()

  const rateLimitAfter = await deployedLogic.rateLimitSponsorFor(deployerAddress, nft.address, '0x')
  console.log('rate limit after minting', rateLimitAfter)

  const rateLimitShared = await deployedLogic.rateLimitSponsorFor(deployerAddress, logic.address, '0x')
  console.log('rate limit shared for all users of the contract', rateLimitShared)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
