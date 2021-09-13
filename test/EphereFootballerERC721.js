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

  it('should fail if sender does not have minter role', async () => {
    try {
      const erc721 = await EphereFootballerERC721.new({ from: owner });
      await erc721.mint("1", stranger, { from: stranger });
    } catch (err) {
      assert.equal(err.reason, "Invalid param: quarter");
    }
  });
    
});
