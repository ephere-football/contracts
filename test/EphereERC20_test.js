const BN = require('bn.js');

const evm = require('./evm');
const EphereERC20 = artifacts.require('EphereERC20');

const daysToSecs = (days) => days * 86400;

contract('EphereERC20', (accounts) => {
  const owner = accounts[0];
  const stranger = accounts[1];

  const tle = 1647291600;
  const secsToTLE = Math.floor(tle - new Date().getTime() / 1000);

  var snapshotId;

  beforeEach(async () => {
    snapshot = await evm.snapshot();
    snapshotId = snapshot['result'];
  });

  afterEach(async () => {
    await evm.revert(snapshotId);
  });

  it('should fail when trying to mint advisors tokens before TLE + 60 year', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });

    try {
      await erc20.mintAdvisorsTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Advisors tokens cannot be minted before " + (tle + daysToSecs(365)));
    }
  });

  it('should fail if advisors tokens try to be minted twice', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(365) + 60);
    await erc20.mintAdvisorsTokens();

    try {
      await erc20.mintAdvisorsTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Advisors tokens were already minted");
    }
  });

  it('should return if advisors tokens try to be minted after TLE + 60 year', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(365) + 60);
    const tx = await erc20.mintAdvisorsTokens();
    const transfer = tx.logs[0];
    assert.equal(transfer.event, "Transfer");
    assert.equal(transfer.args.to, "0xB86bfB0d2b11E2B86b63F7fbD995765474c71f3f");
    assert.equal(transfer.args.value.toString(), "9000000000000000000000000");
  });

  it('should fail when trying to mint core team tokens before TLE + 60 year', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });

    try {
      await erc20.mintCoreTeamTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Core Team tokens cannot be minted before " + (tle + daysToSecs(365)));
    }
  });

  it('should fail if core team tokens try to be minted twice', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(365) + 60);
    await erc20.mintCoreTeamTokens();

    try {
      await erc20.mintCoreTeamTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Core Team tokens were already minted");
    }
  });

  it('should return if core team tokens try to be minted after TLE + 60 year', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(365) + 60);
    const tx = await erc20.mintCoreTeamTokens();
    const transfer = tx.logs[0];
    assert.equal(transfer.event, "Transfer");
    assert.equal(transfer.args.to, "0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93");
    assert.equal(transfer.args.value.toString(), "6000000000000000000000000");
  });

  it('should fail when trying to mint marketing tokens (0) before TLE', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + tle);
    }
  });

  it('should fail when trying to mint marketing tokens (1) before TLE + 1 quarter', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + 60);
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + (tle + daysToSecs(90)));
    }
  });

  it('should fail when trying to mint marketing tokens (2) before TLE + 2 quarter', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(90) + 60);
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + (tle + daysToSecs(180)));
    }
  });

  it('should fail when trying to mint marketing tokens (3) before TLE + 3 quarter', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(180) + 60);
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + (tle + daysToSecs(270)));
    }
  });

  it('should fail when trying to mint marketing tokens (4) before TLE + 4 quarter', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(270) + 60);
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + (tle + daysToSecs(360)));
    }
  });

  it('should fail when trying to mint marketing tokens (5) before TLE + 5 quarter', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(360) + 60);
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + (tle + daysToSecs(450)));
    }
  });

  it('should fail when trying to mint marketing tokens (6) before TLE + 6 quarter', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(450) + 60);
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + (tle + daysToSecs(540)));
    }
  });

  it('should fail when trying to mint marketing tokens (7) before TLE + 7 quarter', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(540) + 60);
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + (tle + daysToSecs(630)));
    }
  });

  it('should fail when trying to mint marketing tokens (8) before TLE + 8 quarter', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(630) + 60);
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens cannot be minted before " + (tle + daysToSecs(720)));
    }
  });

  it('should fail when trying to mint marketing tokens outside budget', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(720) + 60);
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();
    await erc20.mintMarketingTokens();

    try {
      await erc20.mintMarketingTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Marketing tokens were already minted");
    }
  });

  it('should return if marketing tokens try to be minted correctly', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });

    var sum = new BN(0);
    for (var i = 0; i < 9; i++) {
      await evm.increaseTime(secsToTLE + daysToSecs(90 * i) + 60);
      const tx = await erc20.mintMarketingTokens();
      const transfer = tx.logs[0];
      assert.equal(transfer.event, "Transfer");
      assert.equal(transfer.args.to, "0x84435fb5B645dd6290B9714f5a47482F2826b39D");
      assert.equal(transfer.args.value.toString(), i === 0 ? "3600000000000000000000000" : "1800000000000000000000000");
      sum = sum.add(transfer.args.value);
    }

    assert.equal(sum.toString(), "18000000000000000000000000");
  });

  it('should fail when trying to mint play to earn tokens (0) before TLE', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });

    try {
      await erc20.mintPlayToEarnTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Play to Earn tokens (0) cannot be minted before " + tle);
    }
  });
 
  it('should fail when trying to mint play to earn tokens (' + 1 + ') before TLE + ' + 1 + ' month', async () => {
    const i = 1;
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(30) * (i - 1) + 60);
    await erc20.mintPlayToEarnTokensBulk(i);

    try {
      await erc20.mintPlayToEarnTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Play to Earn tokens (" + i + ") cannot be minted before " + (tle + daysToSecs(30 * i)));
    }
  });
 
  it('should fail when trying to mint play to earn tokens (' + 23 + ') before TLE + ' + 23 + ' month', async () => {
    const i = 23;
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(30) * (i - 1) + 60);
    await erc20.mintPlayToEarnTokensBulk(i);

    try {
      await erc20.mintPlayToEarnTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Play to Earn tokens (" + i + ") cannot be minted before " + (tle + daysToSecs(30 * i)));
    }
  });
 
  it('should fail when trying to mint play to earn tokens (' + 46 + ') before TLE + ' + 46 + ' month', async () => {
    const i = 46;
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(30) * (i - 1) + 60);
    await erc20.mintPlayToEarnTokensBulk(i);

    try {
      await erc20.mintPlayToEarnTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Play to Earn tokens (" + i + ") cannot be minted before " + (tle + daysToSecs(30 * i)));
    }
  });
 
  it('should fail when trying to mint play to earn tokens outside budget', async () => {
    const i = 47;
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + daysToSecs(30) * (i - 1) + 60);
    await erc20.mintPlayToEarnTokensBulk(i);

    try {
      await erc20.mintPlayToEarnTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Play to Earn tokens were already minted");
    }
  });

  it('should return if play to earn tokens try to be minted correctly', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    const expectedDecrease = [
      new BN("0"),
      new BN("215760000000000000000000"),
      new BN("70680000000000000000000")
    ];

    var sum = new BN(0);
    for (var i = 0, previousTransfer = new BN("5725080000000000000000000"); i < 47; i++) {
      await evm.increaseTime(secsToTLE + daysToSecs(30 * i) + 60);
      const tx = await erc20.mintPlayToEarnTokens();
      const transfer = tx.logs[0];
      assert.equal(transfer.event, "Transfer");
      assert.equal(transfer.args.to, "0xD90918CB8adF7daEbaD19AB53bCe2917f8e36077");
      assert.equal(transfer.args.value.toString(), previousTransfer.sub(expectedDecrease[Math.min(i, 2)]).toString());
      previousTransfer = transfer.args.value;
      sum = sum.add(transfer.args.value);
    }

    assert.equal(sum.toString(), "186000000000000000000000000");
  });

  it('should fail when trying to mint private sale tokens before TLE', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });

    try {
      await erc20.mintPrivateSaleTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Private Sale tokens cannot be minted before " + (tle));
    }
  });

  it('should fail if private sale tokens try to be minted twice', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + 60);
    await erc20.mintPrivateSaleTokens();

    try {
      await erc20.mintPrivateSaleTokens();
      throw ({ reason: "Couldn't catch expected exception" });
    } catch (err) {
      assert.equal(err.reason, "Private Sale tokens were already minted");
    }
  });

  it('should return if private sale tokens try to be minted after TLE', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    await evm.increaseTime(secsToTLE + 60);
    const tx = await erc20.mintPrivateSaleTokens();
    const transfer = tx.logs[0];
    assert.equal(transfer.event, "Transfer");
    assert.equal(transfer.args.to, "0xf28FdC5aD77f1426A0cD7F2Dac3f96d93C11d385");
    assert.equal(transfer.args.value.toString(), "6000000000000000000000000");
  });

  it('should return if all tokens try to be minted correctly', async () => {
    const erc20 = await EphereERC20.new(owner, { from: owner });
    const expectedDecrease = [
      new BN("0"),
      new BN("215760000000000000000000"),
      new BN("70680000000000000000000")
    ];

    await evm.increaseTime(secsToTLE + daysToSecs(356 * 5) + 60);
    
    // advisors
    const txAdvisors = await erc20.mintAdvisorsTokens();
    const transferAdvisors = txAdvisors.logs[0];
    assert.equal(transferAdvisors.event, "Transfer");
    assert.equal(transferAdvisors.args.to, "0xB86bfB0d2b11E2B86b63F7fbD995765474c71f3f");
    assert.equal(transferAdvisors.args.value.toString(), "9000000000000000000000000");

    // core team
    const txCoreTeam = await erc20.mintCoreTeamTokens();
    const transferCoreTeam = txCoreTeam.logs[0];
    assert.equal(transferCoreTeam.event, "Transfer");
    assert.equal(transferCoreTeam.args.to, "0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93");
    assert.equal(transferCoreTeam.args.value.toString(), "6000000000000000000000000");

    // marketing
    var sumMarketing = new BN(0);
    for (var i = 0; i < 9; i++) {
      const txMarketing = await erc20.mintMarketingTokens();
      const transferMarketing = txMarketing.logs[0];
      assert.equal(transferMarketing.event, "Transfer");
      assert.equal(transferMarketing.args.to, "0x84435fb5B645dd6290B9714f5a47482F2826b39D");
      assert.equal(transferMarketing.args.value.toString(), i === 0 ? "3600000000000000000000000" : "1800000000000000000000000");
      sumMarketing = sumMarketing.add(transferMarketing.args.value);
    }
    assert.equal(sumMarketing.toString(), "18000000000000000000000000");

    // play to earn
    var sumPlayToEarn = new BN(0);
    for (var i = 0, previousTransfer = new BN("5725080000000000000000000"); i < 47; i++) {
      const txPlayToEarn = await erc20.mintPlayToEarnTokens();
      const transferP2E = txPlayToEarn.logs[0];
      assert.equal(transferP2E.event, "Transfer");
      assert.equal(transferP2E.args.to, "0xD90918CB8adF7daEbaD19AB53bCe2917f8e36077");
      assert.equal(transferP2E.args.value.toString(), previousTransfer.sub(expectedDecrease[Math.min(i, 2)]).toString());
      previousTransfer = transferP2E.args.value;
      sumPlayToEarn = sumPlayToEarn.add(transferP2E.args.value);
    }
    assert.equal(sumPlayToEarn.toString(), "186000000000000000000000000");

    // private sale
    const txPrivateSale = await erc20.mintPrivateSaleTokens();
    const transferPrivateSale = txPrivateSale.logs[0];
    assert.equal(transferPrivateSale.event, "Transfer");
    assert.equal(transferPrivateSale.args.to, "0xf28FdC5aD77f1426A0cD7F2Dac3f96d93C11d385");
    assert.equal(transferPrivateSale.args.value.toString(), "6000000000000000000000000");

    // assert supply
    const cap = await erc20.cap();
    const balance = await erc20.balanceOf(owner);

    const sum = balance
         .add(transferAdvisors.args.value)
         .add(transferCoreTeam.args.value)
         .add(sumMarketing)
         .add(sumPlayToEarn)
         .add(transferPrivateSale.args.value);

    assert.equal(cap.toString(), "300000000000000000000000000");
    assert.equal(sum.toString(), cap.toString());
  });
});
