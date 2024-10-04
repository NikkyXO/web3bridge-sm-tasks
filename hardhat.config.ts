
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-web3-v4";
import * as dotenv from "dotenv";
dotenv.config();

console.log("new task **** ")
// task action function receives the Hardhat Runtime Environment as second argument
task("accounts", "Prints accounts", async (_, { web3 }) => {
  console.log(await web3.eth.getAccounts());
});


const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    // for testnet
    "lisk-sepolia": {
      url: process.env.LISK_RPC_URL!,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY!], // wss://holesky.drpc.org
      gasPrice: 1000000000,
    },
    "holesky": {
      url: process.env.INFURA_HOLESKY!,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY!],
      gasPrice: 1000000000,
    },

    "sepolia": {
      url: process.env.INFURA_SEPOLIA!,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY!],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
      "lisk-sepolia": "123",
      "holesky": process.env.ETHERSCAN_API_KEY!,
      "sepolia":  process.env.ETHERSCAN_API_KEY!,
    },
    customChains: [
      {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com/",
        },
      },
      {
        network: "holesky",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api",
          browserURL: "https://holesky.etherscan.io/",
        },
        // urls: {
        //   apiURL: "https://holesky.etherscan.io/",
        //   browserURL: "https://holesky.etherscan.io/",
        // }
      }
      // {
      //   network: "sepolia",
      //   chainId: 11155111,
      //   urls: {
      //     apiURL: 'https://sepolia.infura.io/v3/',
      //     browserURL: "https://sepolia.infura.io/v3/"
      //   },
      // },
    ],
  },
  sourcify: {
    enabled: false,
  },
  ignition: {
    requiredConfirmations: 1
  },
};

export default config;
