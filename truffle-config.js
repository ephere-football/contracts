const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

require('dotenv').config();

if (!process.env.PRIVATE_KEY) {
  throw Error("Please set the PRIVATE_KEY envinronment variable");
}

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  api_keys: {
    etherscan: "ZPNV87NWSXY48CNWFV2458VM5I4PQJE9N3"
  },
  compilers: {
    solc: {
      version: "^0.8.7",
      settings: {
        optimizer: {
          enabled: true
        }
      }
    }
  },
  contracts_build_directory: path.join(__dirname, "artifacts"),
  networks: {
    develop: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        "wss://mainnet.infura.io/ws/v3/a3753149ae364a1594d08a2af20c7b09"
      ),
      network_id: 1,
      gas: 4000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        "wss://rinkeby.infura.io/ws/v3/9f06f42ed15b4a9b807cfe44a50e70e1"
      ),
      network_id: 4,
      gas: 4000000
    },
    ropsten: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        "wss://ropsten.infura.io/ws/v3/3e9869b4a3e142bb8292bde2e00762f8"
      ),
      network_id: 3,
      gas: 4000000
    },
    smartchain: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        "https://bsc-dataseed2.binance.org"
      ),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    smartchaintest: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        "https://data-seed-prebsc-1-s1.binance.org:8545"
      ),
      network_id: 97
    }
  },
  plugins: [
    "truffle-plugin-verify"
  ]
};
