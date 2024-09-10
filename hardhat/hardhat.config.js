require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

// Hardhat configuration
module.exports = {
  solidity: {
    version: "0.8.20", // Specify the version here
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
