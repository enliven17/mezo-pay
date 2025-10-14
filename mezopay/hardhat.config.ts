import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

const config: HardhatUserConfig = {
  defaultNetwork: "mezotestnet",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    mezotestnet: {
      url: "https://rpc.test.mezo.org",
      chainId: 31611,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
    },
    mezo: {
      url: "https://rpc.mezo.org",
      chainId: 686868,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "london",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: {
      mezotestnet: "no-api-key-needed",
      mezo: "no-api-key-needed"
    },
    customChains: [
      {
        network: "mezotestnet",
        chainId: 31611,
        urls: {
          apiURL: "https://explorer.test.mezo.org/api",
          browserURL: "https://explorer.test.mezo.org"
        }
      },
      {
        network: "mezo",
        chainId: 686868,
        urls: {
          apiURL: "https://explorer.mezo.org/api",
          browserURL: "https://explorer.mezo.org"
        }
      }
    ]
  }
};

export default config;