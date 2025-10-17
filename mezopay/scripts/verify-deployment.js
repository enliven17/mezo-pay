const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("🔍 Verifying MezoPay deployment...");

  const contractAddress = process.env.NEXT_PUBLIC_MEZOPAY_CONTRACT || "0xc0b33Cc720025dD0AcF56e249C8b76A6A34170B6";
  
  if (!contractAddress || contractAddress === "0x...") {
    console.error("❌ Contract address not set in environment variables");
    console.log("Please update NEXT_PUBLIC_MEZOPAY_CONTRACT in .env.local");
    return;
  }

  try {
    // Get contract instance
    const MezoPay = await ethers.getContractFactory("MezoPay");
    const mezoPay = MezoPay.attach(contractAddress);

    // Test basic contract functions
    console.log("📋 Contract Address:", contractAddress);
    
    // Check if contract exists
    const code = await ethers.provider.getCode(contractAddress);
    if (code === "0x") {
      console.error("❌ No contract found at this address");
      return;
    }
    
    console.log("✅ Contract exists on blockchain");

    // Test constants
    try {
      const minCollateralRatio = await mezoPay.MINIMUM_COLLATERAL_RATIO();
      const liquidationThreshold = await mezoPay.LIQUIDATION_THRESHOLD();
      const annualRate = await mezoPay.ANNUAL_INTEREST_RATE();
      
      console.log("📊 Contract Parameters:");
      console.log(`   Minimum Collateral Ratio: ${minCollateralRatio.toString()}%`);
      console.log(`   Liquidation Threshold: ${liquidationThreshold.toString()}%`);
      console.log(`   Annual Interest Rate: ${(Number(annualRate) / 100)}%`);
      
    } catch (error) {
      console.error("❌ Error reading contract constants:", error);
    }

    // Check MUSD contract
    try {
      const musdAddress = await mezoPay.musd();
      console.log("💰 MUSD Contract:", musdAddress);
      
      if (musdAddress === "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503") {
        console.log("✅ MUSD contract correctly configured");
      } else {
        console.log("⚠️  MUSD contract address differs from expected");
      }
    } catch (error) {
      console.error("❌ Error reading MUSD address:", error);
    }

    console.log("\n🎉 Deployment verification complete!");
    console.log("🚀 Ready for demo!");

  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = {};