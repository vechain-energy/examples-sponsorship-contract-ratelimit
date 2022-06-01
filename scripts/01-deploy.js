const hre = require("hardhat");

async function main() {
  const Sponsorship = await hre.thor.getContractFactory("Sponsorship");
  const logic = await Sponsorship.deploy();

  await logic.deployed();

  console.log("logic deployed to:", logic.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
