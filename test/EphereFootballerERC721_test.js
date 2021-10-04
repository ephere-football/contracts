const evm = require('./evm');
const EphereFootballerERC721 = artifacts.require('EphereFootballerERC721');

const daysToSeconds = (days) => days * 86400;

contract('EphereFootballerERC721', (accounts) => {
  const owner = accounts[0];
  const stranger = accounts[1];

  var snapshotId;

  beforeEach(async () => {
    snapshot = await evm.snapshot();
    snapshotId = snapshot['result'];
  });

  afterEach(async () => {
    await evm.revert(snapshotId);
  });

  it('should fail to mint if sender does not have minter role', async () => {
    try {
      const erc721 = await EphereFootballerERC721.new(200000000, { from: owner });
      await erc721.mint("cid", stranger, { from: stranger });
    } catch (err) {
      assert.equal(err.reason, "EphereFootballerERC721: must have minter role to mint");
    }
  });

  it('should mint if sender has minter role', async () => {
    const erc721 = await EphereFootballerERC721.new(2, { from: owner });
    await erc721.mint("cid", stranger, { from: owner });
  });

  it('should fail to mint {_maxSupply + 1} tokens', async () => {
    try {
      const erc721 = await EphereFootballerERC721.new(2, { from: owner });
      await erc721.mint("cid_01", stranger, { from: owner });
      await erc721.mint("cid_02", stranger, { from: owner });
      await erc721.mint("cid_03", stranger, { from: owner });
    } catch (err) {
      assert.equal(err.reason, "EphereFootballerERC721: cannot exceed max total supply");
    }
  });

  it('should mint {_maxSupply} tokens', async () => {
    const erc721 = await EphereFootballerERC721.new(2, { from: owner });
    await erc721.mint("cid_01", stranger, { from: owner });
    await erc721.mint("cid_02", stranger, { from: owner });
  });

  it('should mint {_maxSupply + 1} tokens if at least 1 token was burned', async () => {
    const erc721 = await EphereFootballerERC721.new(2, { from: owner });
    await erc721.mint("cid_01", stranger, { from: owner });
    await erc721.mint("cid_02", stranger, { from: owner });
    await erc721.burn(1, { from: stranger });
    await erc721.mint("cid_03", stranger, { from: owner });
  });

  it('should return token URL for existent token', async () => {
    const erc721 = await EphereFootballerERC721.new(200000000, { from: owner });
    await erc721.mint("cid", stranger, { from: owner });
    const tokenURI = await erc721.tokenURI(1, { from: owner });
    assert.equal(tokenURI, "https://ipfs.ephere.io/ipfs/cid");
  });

  it('should fail to pause if sender does not have pauser role', async () => {
    try {
      const erc721 = await EphereFootballerERC721.new(200000000, { from: owner });
      await erc721.pause({ from: stranger });
    } catch (err) {
      assert.equal(err.reason, "EphereFootballerERC721: must have pauser role to pause");
    }
  });

  it('should pause if sender does have pauser role', async () => {
    const erc721 = await EphereFootballerERC721.new(200000000, { from: owner });
    await erc721.pause({ from: owner });
  });

  it('should fail to unpause if sender does not have pauser role', async () => {
    try {
      const erc721 = await EphereFootballerERC721.new(200000000, { from: owner });
      await erc721.pause({ from: owner });
      await erc721.unpause({ from: stranger });
    } catch (err) {
      assert.equal(err.reason, "EphereFootballerERC721: must have pauser role to unpause");
    }
  });

  it('should unpause if sender does have pauser role', async () => {
    const erc721 = await EphereFootballerERC721.new(200000000, { from: owner });
    await erc721.pause({ from: owner });
    await erc721.unpause({ from: owner });
  });
    
});
