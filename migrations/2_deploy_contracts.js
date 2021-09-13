const EpherERC20 = artifacts.require("EpherERC20");
const EphereFootballerERC721 = artifacts.require("EphereFootballerERC721");

module.exports = async (deployer, network) => {
  await deployer.deploy(EpherERC20);
  await deployer.deploy(EphereFootballerERC721);
};
