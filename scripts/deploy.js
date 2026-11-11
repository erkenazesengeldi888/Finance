const { ethers } = require("hardhat");

async function main() {
  const CertiChain = await ethers.getContractFactory("CertiChain");
  const certiChain = await CertiChain.deploy();
  await certiChain.waitForDeployment();

  console.log(`CertiChain deployed to: ${await certiChain.getAddress()}`);
  console.log(`Owner: ${await certiChain.owner()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
