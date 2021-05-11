/* Load Artifacts */
const OniToken = artifacts.require('OniToken');
const SmartChef = artifacts.require('SmartChef');
const SyrupBar = artifacts.require('SyrupBar');
const MasterChef = artifacts.require('MasterChef');
const Timelock = artifacts.require('Timelock');

const config = {
    MasterChef: {
        oniPerBlock: '1000',
        dev: process.env.DEPLOYER_ACCOUNT,
        startBlock: 8620481
    },
    SmartChef: {
        rewardPerBlock: '10',
        startBlock: 8620481,
        bonusEndBlock: 8630481
    },
};

module.exports = function (deployer, network) {
  deployer.then(async () => {
    if (network === 'development' || network === 'test' || network === 'soliditycoverage' || network == 'otherhost') {
      // do nothing for now
    } else if (network === 'bsctestnet') { // binance testnet
      // deploy OniToken
      const oniToken = await deployer.deploy(OniToken, {from: process.env.DEPLOYER_ACCOUNT});
      // deploy SyrupBar
      const syrupBar = await deployer.deploy(SyrupBar, oniToken.address, {from: process.env.DEPLOYER_ACCOUNT});

      // deploy MasterChef
      await deployer.deploy(MasterChef,
        oniToken.address,
        syrupBar.address,
        config.MasterChef.oniPerBlock,
        config.MasterChef.startBlock,
        {from: process.env.DEPLOYER_ACCOUNT}
      );

//  alternatively deploy SmartChef

//    await deployer.deploy(SmartChef,
//        SyrupBarInstance.address,
//        OniTokenInstance.address,
//        config.SmartChef.rewardPerBlock,
//        config.SmartChef.startBlock,
//        config.SmartChef.bonusEndBlock,
//        { from: process.env.DEPLOYER_ACCOUNT }
//        );
//    const SmartChefInstance = await SmartChef.deployed();
//    await OniTokenInstance.transferOwnership(SmartChefInstance.address, { from: process.env.DEPLOYER_ACCOUNT });
//    await SyrupBarInstance.transferOwnership(SmartChefInstance.address, { from: process.env.DEPLOYER_ACCOUNT });


    } else if (network === 'bsc') {
      // do nothing for now
    }
  });
};
