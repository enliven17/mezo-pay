const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MezoPay contract to Mezo Testnet...");

  // MUSD contract address on Mezo Testnet
  const MUSD_ADDRESS = "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503";

  // Get the contract factory
  const MezoPay = await ethers.getContractFactory("MezoPay");

  // Deploy the contract
  console.log("Deploying contract...");
  const mezoPay = await MezoPay.deploy(MUSD_ADDRESS);

  await mezoPay.waitForDeployment();

  const contractAddress = await mezoPay.getAddress();
  console.log("MezoPay deployed to:", contractAddress);

  // Verify contract on explorer (if supported)
  console.log("Contract deployment completed!");
  console.log("Contract address:", contractAddress);
  console.log("MUSD address:", MUSD_ADDRESS);
  console.log("Network:", await ethers.provider.getNetwork());

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    musdAddress: MUSD_ADDRESS,
    network: "mezotestnet",
    chainId: 31611,
    deployedAt: new Date().toISOString(),
  };

  console.log("Deployment info:", deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = {};