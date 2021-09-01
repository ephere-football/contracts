const EpherERC20 = artifacts.require("EpherERC20");

module.exports = async (deployer, network) => {
  await deployer.deploy(EpherERC20);
};
