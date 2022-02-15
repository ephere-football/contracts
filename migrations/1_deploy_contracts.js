const EphereERC20 = artifacts.require("EphereERC20");
const EphereFootballerERC721 = artifacts.require("EphereFootballerERC721");

module.exports = async (deployer, network, accounts) => {
  const pinkAntiBotAddress = {
    "smartchain": "0x8EFDb3b642eb2a20607ffe0A56CFefF6a95Df002",
    "smartchaintest": "0xbb06F5C7689eA93d9DeACCf4aF8546C4Fe0Bf1E5",
    "test": accounts[0]
  };

  await deployer.deploy(EphereERC20, pinkAntiBotAddress[network]);
  await deployer.deploy(EphereFootballerERC721, 200000000);
};
