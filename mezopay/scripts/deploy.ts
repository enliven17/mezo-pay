const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MezoPay contract...");

  // MUSD token address on Mezo testnet
  const musdAddress = "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503";

  // Deploy MezoPay contract
  const MezoPay = await ethers.getContractFactory("MezoPay");
  const mezoPay = await MezoPay.deploy(musdAddress);

  await mezoPay.waitForDeployment();

  const contractAddress = await mezoPay.getAddress();
  console.log("MezoPay deployed to:", contractAddress);
  console.log("MUSD address:", musdAddress);

  // Save deployment info
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(`NEXT_PUBLIC_MEZOPAY_CONTRACT=${contractAddress}`);
  console.log(`NEXT_PUBLIC_MUSD_CONTRACT=${musdAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });