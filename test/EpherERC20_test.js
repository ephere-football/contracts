const evm = require('./evm');
const EpherERC20 = artifacts.require('EpherERC20');

const daysToSeconds = (days) => days * 86400;

contract('EpherERC20', (accounts) => {
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

  it('should fail if quarter param is invalid (less than 1) when trying to mint Core Team tokens', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await epher.mintCoreTeam(0);
    } catch (err) {
      assert.equal(err.reason, "Invalid param: quarter");
    }
  });

  it('should fail if quarter param is invalid (greater than 6) when trying to mint Core Team tokens', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await epher.mintCoreTeam(7);
    } catch (err) {
      assert.equal(err.reason, "Invalid param: quarter");
    }
  });

  it('should fail if Core Team Q1 tokens try to be minted before 30 days has passed after EPH creation', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(30) - 1);
      await epher.mintCoreTeam(1);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q1 tokens can only be minted 30 days after EPH token creation");
    }
  });

  it('should fail if Core Team Q1 tokens try to be minted twice', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(30) + 1);
      await epher.mintCoreTeam(1);
      await epher.mintCoreTeam(1);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q1 tokens were minted already");
    }
  });

  it('should return if Core Team Q1 tokens try to be minted 30 days after EPH creation', async () => {
    const epher = await EpherERC20.new({ from: owner });
    await evm.increaseTime(daysToSeconds(30) + 1);
    const tx = await epher.mintCoreTeam(1);
    const transferToM1 = tx.logs[0];
    const transferToM2 = tx.logs[1];
    const transferToM3 = tx.logs[2];
    assert.equal(transferToM1.event, "Transfer");
    assert.equal(transferToM1.args.to, "0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93");
    assert.equal(transferToM1.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM2.event, "Transfer");
    assert.equal(transferToM2.args.to, "0x13C7cECb0ea3987Ded126b59624C898fCBa8feB9");
    assert.equal(transferToM2.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM3.event, "Transfer");
    assert.equal(transferToM3.args.to, "0x2Af22f3A5899fE765036d5FeEE97BABa512507E6");
    assert.equal(transferToM3.args.value.toString(), "3000000000000000000000000");
  });

  it('should fail if Core Team Q2 tokens try to be minted before 120 days has passed after EPH creation', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(120) - 1);
      await epher.mintCoreTeam(2);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q2 tokens can only be minted 120 days after EPH token creation");
    }
  });

  it('should fail if Core Team Q2 tokens try to be minted twice', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(120) + 1);
      await epher.mintCoreTeam(2);
      await epher.mintCoreTeam(2);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q2 tokens were minted already");
    }
  });

  it('should return if Core Team Q2 tokens try to be minted 120 days after EPH creation', async () => {
    const epher = await EpherERC20.new({ from: owner });
    await evm.increaseTime(daysToSeconds(120) + 1);
    const tx = await epher.mintCoreTeam(2);
    const transferToM1 = tx.logs[0];
    const transferToM2 = tx.logs[1];
    const transferToM3 = tx.logs[2];
    assert.equal(transferToM1.event, "Transfer");
    assert.equal(transferToM1.args.to, "0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93");
    assert.equal(transferToM1.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM2.event, "Transfer");
    assert.equal(transferToM2.args.to, "0x13C7cECb0ea3987Ded126b59624C898fCBa8feB9");
    assert.equal(transferToM2.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM3.event, "Transfer");
    assert.equal(transferToM3.args.to, "0x2Af22f3A5899fE765036d5FeEE97BABa512507E6");
    assert.equal(transferToM3.args.value.toString(), "3000000000000000000000000");
  });

  it('should fail if Core Team Q3 tokens try to be minted before 210 days has passed after EPH creation', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(210) - 1);
      await epher.mintCoreTeam(3);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q3 tokens can only be minted 210 days after EPH token creation");
    }
  });

  it('should fail if Core Team Q3 tokens try to be minted twice', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(210) + 1);
      await epher.mintCoreTeam(3);
      await epher.mintCoreTeam(3);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q3 tokens were minted already");
    }
  });

  it('should return if Core Team Q3 tokens try to be minted 210 days after EPH creation', async () => {
    const epher = await EpherERC20.new({ from: owner });
    await evm.increaseTime(daysToSeconds(210) + 1);
    const tx = await epher.mintCoreTeam(3);
    const transferToM1 = tx.logs[0];
    const transferToM2 = tx.logs[1];
    const transferToM3 = tx.logs[2];
    assert.equal(transferToM1.event, "Transfer");
    assert.equal(transferToM1.args.to, "0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93");
    assert.equal(transferToM1.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM2.event, "Transfer");
    assert.equal(transferToM2.args.to, "0x13C7cECb0ea3987Ded126b59624C898fCBa8feB9");
    assert.equal(transferToM2.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM3.event, "Transfer");
    assert.equal(transferToM3.args.to, "0x2Af22f3A5899fE765036d5FeEE97BABa512507E6");
    assert.equal(transferToM3.args.value.toString(), "3000000000000000000000000");
  });

  it('should fail if Core Team Q4 tokens try to be minted before 300 days has passed after EPH creation', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(300) - 1);
      await epher.mintCoreTeam(4);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q4 tokens can only be minted 300 days after EPH token creation");
    }
  });

  it('should fail if Core Team Q4 tokens try to be minted twice', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(300) + 1);
      await epher.mintCoreTeam(4);
      await epher.mintCoreTeam(4);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q4 tokens were minted already");
    }
  });

  it('should return if Core Team Q4 tokens try to be minted 300 days after EPH creation', async () => {
    const epher = await EpherERC20.new({ from: owner });
    await evm.increaseTime(daysToSeconds(300) + 1);
    const tx = await epher.mintCoreTeam(4);
    const transferToM1 = tx.logs[0];
    const transferToM2 = tx.logs[1];
    const transferToM3 = tx.logs[2];
    assert.equal(transferToM1.event, "Transfer");
    assert.equal(transferToM1.args.to, "0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93");
    assert.equal(transferToM1.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM2.event, "Transfer");
    assert.equal(transferToM2.args.to, "0x13C7cECb0ea3987Ded126b59624C898fCBa8feB9");
    assert.equal(transferToM2.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM3.event, "Transfer");
    assert.equal(transferToM3.args.to, "0x2Af22f3A5899fE765036d5FeEE97BABa512507E6");
    assert.equal(transferToM3.args.value.toString(), "3000000000000000000000000");
  });

  it('should fail if Core Team Q5 tokens try to be minted before 390 days has passed after EPH creation', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(390) - 1);
      await epher.mintCoreTeam(5);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q5 tokens can only be minted 390 days after EPH token creation");
    }
  });

  it('should fail if Core Team Q5 tokens try to be minted twice', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(390) + 1);
      await epher.mintCoreTeam(5);
      await epher.mintCoreTeam(5);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q5 tokens were minted already");
    }
  });

  it('should return if Core Team Q5 tokens try to be minted 390 days after EPH creation', async () => {
    const epher = await EpherERC20.new({ from: owner });
    await evm.increaseTime(daysToSeconds(390) + 1);
    const tx = await epher.mintCoreTeam(5);
    const transferToM1 = tx.logs[0];
    const transferToM2 = tx.logs[1];
    const transferToM3 = tx.logs[2];
    assert.equal(transferToM1.event, "Transfer");
    assert.equal(transferToM1.args.to, "0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93");
    assert.equal(transferToM1.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM2.event, "Transfer");
    assert.equal(transferToM2.args.to, "0x13C7cECb0ea3987Ded126b59624C898fCBa8feB9");
    assert.equal(transferToM2.args.value.toString(), "3000000000000000000000000");
    assert.equal(transferToM3.event, "Transfer");
    assert.equal(transferToM3.args.to, "0x2Af22f3A5899fE765036d5FeEE97BABa512507E6");
    assert.equal(transferToM3.args.value.toString(), "3000000000000000000000000");
  });

  it('should fail if Core Team Q6 tokens try to be minted before 480 days has passed after EPH creation', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(480) - 1);
      await epher.mintCoreTeam(6);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q6 tokens can only be minted 480 days after EPH token creation");
    }
  });

  it('should fail if Core Team Q6 tokens try to be minted twice', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await evm.increaseTime(daysToSeconds(480) + 1);
      await epher.mintCoreTeam(6);
      await epher.mintCoreTeam(6);
    } catch (err) {
      assert.equal(err.reason, "Core Team Q6 tokens were minted already");
    }
  });

  it('should return if Core Team Q6 tokens try to be minted 480 days after EPH creation', async () => {
    const epher = await EpherERC20.new({ from: owner });
    await evm.increaseTime(daysToSeconds(480) + 1);
    const tx = await epher.mintCoreTeam(6);
    const transferToM1 = tx.logs[0];
    const transferToM2 = tx.logs[1];
    const transferToM3 = tx.logs[2];
    assert.equal(transferToM1.event, "Transfer");
    assert.equal(transferToM1.args.to, "0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93");
    assert.equal(transferToM1.args.value.toString(), "6000000000000000000000000");
    assert.equal(transferToM2.event, "Transfer");
    assert.equal(transferToM2.args.to, "0x13C7cECb0ea3987Ded126b59624C898fCBa8feB9");
    assert.equal(transferToM2.args.value.toString(), "6000000000000000000000000");
    assert.equal(transferToM3.event, "Transfer");
    assert.equal(transferToM3.args.to, "0x2Af22f3A5899fE765036d5FeEE97BABa512507E6");
    assert.equal(transferToM3.args.value.toString(), "3000000000000000000000000");
  });

  it('should fail if Play to Earn tokens try to be minted beyond the _maxSupply*0.40 cap', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await epher.mintPlayToEarn(stranger, "120000000000000000000000001");
    } catch (err) {
      assert.equal(err.reason, "Play to Earn tokens were minted already");
    }
  });

  it('should return if Play to Earn tokens try to be minted', async () => {
    const epher = await EpherERC20.new({ from: owner });
    const tx = await epher.mintPlayToEarn(stranger, "120000000000000000000000000");
    const transfer = tx.logs[0];
    assert.equal(transfer.event, "Transfer");
    assert.equal(transfer.args.to, stranger);
    assert.equal(transfer.args.value.toString(), "120000000000000000000000000");
  });

  it('should return if Play to Earn tokens try to be minted (several invocations)', async () => {
    const epher = await EpherERC20.new({ from: owner });
    const tx1 = await epher.mintPlayToEarn(stranger, "60000000000000000000000000");
    const tx2 = await epher.mintPlayToEarn(stranger, "60000000000000000000000000");
    const transfer1 = tx1.logs[0];
    const transfer2 = tx2.logs[0];
    assert.equal(transfer1.event, "Transfer");
    assert.equal(transfer1.args.to, stranger);
    assert.equal(transfer1.args.value.toString(), "60000000000000000000000000");
    assert.equal(transfer2.event, "Transfer");
    assert.equal(transfer2.args.to, stranger);
    assert.equal(transfer2.args.value.toString(), "60000000000000000000000000");
  });

  it('should fail if Reserve tokens try to be minted twice', async () => {
    try {
      const epher = await EpherERC20.new({ from: owner });
      await epher.mintReserve();
      await epher.mintReserve();
    } catch (err) {
      assert.equal(err.reason, "Reserve tokens were minted already");
    }
  });

  it('should return if Reserve tokens try to be minted', async () => {
    const epher = await EpherERC20.new({ from: owner });
    const tx = await epher.mintReserve();
    const transferToReserve = tx.logs[0];
    assert.equal(transferToReserve.event, "Transfer");
    assert.equal(transferToReserve.args.to, "0xD90918CB8adF7daEbaD19AB53bCe2917f8e36077");
    assert.equal(transferToReserve.args.value.toString(), "60000000000000000000000000");
  });
    
});
