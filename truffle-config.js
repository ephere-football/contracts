const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
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
    rinkeby: {
      provider: () => new HDWalletProvider(
        "8d3ce5a409878ef5e99769502974ab0e9a931c0581676021364e86463baf5976",
        "wss://rinkeby.infura.io/ws/v3/9f06f42ed15b4a9b807cfe44a50e70e1"
      ),
      network_id: 4,
      gas: 4000000
    },
    ropsten: {
      provider: () => new HDWalletProvider(
        "8d3ce5a409878ef5e99769502974ab0e9a931c0581676021364e86463baf5976",
        "wss://ropsten.infura.io/ws/v3/3e9869b4a3e142bb8292bde2e00762f8"
      ),
      network_id: 3,
      gas: 4000000
    }
  }
};
