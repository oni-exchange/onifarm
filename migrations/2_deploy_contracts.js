/* Load Artifacts */
const OniToken = artifacts.require('OniToken');
const SmartChef = artifacts.require('SmartChef');
const SyrupBar = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');
const Timelock = artifacts.require('Timelock');

const config = {
    MasterChef: {
        oniPerBlock: '10000000000000000000', // 10 oni
        startBlock: 8806060
    },
    SmartChef: {
        rewardPerBlock: '10000000000000000000',
        startBlock: 8806060,
        bonusEndBlock: 9006060
    },
};

module.exports = function (deployer, network) {
  deployer.then(async () => {
    if (network === 'development' || network === 'test' || network === 'soliditycoverage' || network == 'otherhost') {
      // do nothing for now
    } else if (network === 'bsctestnet') { // binance testnet
      // deploy OniToken
      const oniToken = await deployer.deploy(OniToken, {from: process.env.DEPLOYER_ACCOUNT});

      // deploy MasterChef
      const masterChef = await deployer.deploy(MasterChef,
        oniToken.address,
        config.MasterChef.oniPerBlock,
        config.MasterChef.startBlock,
        {from: process.env.DEPLOYER_ACCOUNT}
      );

      // deploy SmartChef
      const smartChef = await deployer.deploy(SmartChef,
       oniToken.address,
       oniToken.address,
       config.SmartChef.rewardPerBlock,
       config.SmartChef.startBlock,
       config.SmartChef.bonusEndBlock,
       { from: process.env.DEPLOYER_ACCOUNT }
       );

      await oniToken.mint(process.env.DEPLOYER_ACCOUNT, '1000000000000000000000000', { from: process.env.DEPLOYER_ACCOUNT });
      await oniToken.mint(smartChef.address, '1000000000000000000000000', { from: process.env.DEPLOYER_ACCOUNT });
      await oniToken.transferOwnership(masterChef.address, { from: process.env.DEPLOYER_ACCOUNT });
    } else if (network === 'bsc') {
      // do nothing for now
    }
  });
};
