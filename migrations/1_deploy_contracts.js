const EphereERC20 = artifacts.require("EphereERC20");
const EphereFootballerERC721 = artifacts.require("EphereFootballerERC721");

module.exports = async (deployer, network) => {
  await deployer.deploy(EphereERC20);
  await deployer.deploy(EphereFootballerERC721, 200000000);
};
