/* Load Artifacts */
const OniToken = artifacts.require('OniToken');
const SmartChef = artifacts.require('SmartChef');
const MasterChef = artifacts.require('MasterChef');
const Timelock = artifacts.require('Timelock');
const OniFactory = artifacts.require('OniFactory');
const WETH9 = artifacts.require('WETH9');
const MockBEP20 = artifacts.require('MockBEP20');

const config = {
    MasterChef: {
        oniPerBlock: '10000000000000000000', // 10 oni
        startBlock: 9000000
    },
    SmartChef: {
        rewardPerBlock: '3858024691358024',
        startBlock: 9000000,
        bonusEndBlock: 9864000
    },
};

module.exports = function (deployer, network) {
  deployer.then(async () => {
    if (network === 'development' || network === 'test' || network === 'soliditycoverage' || network == 'otherhost') {
      // do nothing for now
    } else if (network === 'bsctestnet') { // binance testnet
      // deploy OniToken
      const wbnb = await WETH9.at('0xae13d989dac2f0debff460ac112a837c89baa7cd', {from: process.env.DEPLOYER_ACCOUNT});
      const factory = await OniFactory.at('0x2f9e48744FE48d2E4846850e4206745aaeA53072', {from: process.env.DEPLOYER_ACCOUNT});

      const oniToken = await OniToken.at('0xb1e4289F57e9a341c484B34b632254BE45bB87Dd', {from: process.env.DEPLOYER_ACCOUNT});
      const busd = await MockBEP20.at('0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee', {from: process.env.DEPLOYER_ACCOUNT});
      const tndr = await MockBEP20.at('0xca0607b9C2508827769D532687672526c3c408e3', {from: process.env.DEPLOYER_ACCOUNT});
      const dai = await MockBEP20.at('0x996a17BDe75a8da62A781c9B0714a65C1f9d4B23', {from: process.env.DEPLOYER_ACCOUNT});
      const usdt = await MockBEP20.at('0xb498050eABa74446d84D7e411Ce73Df4A843648F', {from: process.env.DEPLOYER_ACCOUNT});
      const btcb = await MockBEP20.at('0xba6b25a156E8d659D66343c64587C2d6cda52853', {from: process.env.DEPLOYER_ACCOUNT});
      const eth = await MockBEP20.at('0x0ee6E89835B82856Ec8BF349A7fd8377Ecd673a0', {from: process.env.DEPLOYER_ACCOUNT});
      const usdc = await MockBEP20.at('0x94a22515EBc3aeba17382CE7d038e1B406581019', {from: process.env.DEPLOYER_ACCOUNT});
      const dot = await MockBEP20.at('0xf85070374c32ba36E3E726F4c82F1276f3F71C80', {from: process.env.DEPLOYER_ACCOUNT});
      const cake = await MockBEP20.at('0x5cF4B3bFfD615052F51b89B312D5Ed76f837c81B', {from: process.env.DEPLOYER_ACCOUNT});

      let oni_busd = await factory.getPair(oniToken.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (oni_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(oniToken.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        oni_busd = await factory.getPair(oniToken.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let oni_bnb = await factory.getPair(oniToken.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (oni_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(oniToken.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        oni_bnb = await factory.getPair(oniToken.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let oni_tndr = await factory.getPair(oniToken.address, tndr.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (oni_tndr == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(oniToken.address, tndr.address, {from: process.env.DEPLOYER_ACCOUNT});
        oni_tndr = await factory.getPair(oniToken.address, tndr.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let dai_busd = await factory.getPair(dai.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (dai_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(dai.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        dai_busd = await factory.getPair(dai.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let usdt_busd = await factory.getPair(usdt.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdt_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdt.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        usdt_busd = await factory.getPair(usdt.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let usdt_bnb = await factory.getPair(usdt.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdt_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdt.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        usdt_bnb = await factory.getPair(usdt.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let btcb_bnb = await factory.getPair(btcb.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (btcb_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(btcb.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        btcb_bnb = await factory.getPair(btcb.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let eth_bnb = await factory.getPair(eth.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (eth_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(eth.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        eth_bnb = await factory.getPair(eth.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let usdc_busd = await factory.getPair(usdc.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdc_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdc.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        usdc_busd = await factory.getPair(usdc.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let dot_bnb = await factory.getPair(dot.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (dot_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(dot.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        dot_bnb = await factory.getPair(dot.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      let cake_busd = await factory.getPair(cake.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (cake_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(cake.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        cake_busd = await factory.getPair(cake.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      // deploy MasterChef
      const masterChef = await deployer.deploy(MasterChef,
        oniToken.address,
        process.env.DEV_ADDRESS,
        config.MasterChef.oniPerBlock,
        config.MasterChef.startBlock,
        { from: process.env.DEPLOYER_ACCOUNT }
      );

      await masterChef.add(50, oni_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(2, oni_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, oni_tndr, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, dai_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, usdt_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, usdt_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, btcb_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, eth_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, usdc_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, dot_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, cake_busd, false, { from: process.env.DEPLOYER_ACCOUNT });

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

      const timeLock = await deployer.deploy(Timelock,
        process.env.DEPLOYER_ACCOUNT,
        86400 * 2,
        { from: process.env.DEPLOYER_ACCOUNT }
      );

      // await masterChef.transferOwnership(timeLock.address, { from: process.env.DEPLOYER_ACCOUNT });
      // await smartChef.transferOwnership(timeLock.address, { from: process.env.DEPLOYER_ACCOUNT });
    } else if (network === 'bsc') {
      // do nothing for now
    }
  });
};
