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
        startBlock: 7650000
    },
    SmartChef: {
        rewardPerBlock: '3858024691358024',
        startBlock: 7650000,
        bonusEndBlock: 8514000
    },
};

module.exports = function (deployer, network) {
  deployer.then(async () => {
    if (network === 'development' || network === 'test' || network === 'soliditycoverage' || network == 'otherhost') {
      // do nothing for now
    } else if (network === 'bsctestnet') { // binance testnet
      // deploy OniToken
      const wbnb = await WETH9.at('0xae13d989dac2f0debff460ac112a837c89baa7cd', {from: process.env.DEPLOYER_ACCOUNT});
      const factory = await OniFactory.at(process.env.ONI_FACTORY_TESTNET, {from: process.env.DEPLOYER_ACCOUNT});

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
      console.log('oni_busd:', oni_busd);
      let oni_bnb = await factory.getPair(oniToken.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (oni_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(oniToken.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        oni_bnb = await factory.getPair(oniToken.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('oni_bnb:', oni_bnb);
      let oni_tndr = await factory.getPair(oniToken.address, tndr.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (oni_tndr == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(oniToken.address, tndr.address, {from: process.env.DEPLOYER_ACCOUNT});
        oni_tndr = await factory.getPair(oniToken.address, tndr.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('oni_tndr:', oni_tndr);
      let bnb_busd = await factory.getPair(wbnb.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (bnb_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(wbnb.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        bnb_busd = await factory.getPair(wbnb.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('bnb_busd:', bnb_busd);
      let dai_busd = await factory.getPair(dai.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (dai_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(dai.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        dai_busd = await factory.getPair(dai.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('dai_busd:', dai_busd);
      let usdt_busd = await factory.getPair(usdt.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdt_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdt.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        usdt_busd = await factory.getPair(usdt.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('usdt_busd:', usdt_busd);
      let usdt_bnb = await factory.getPair(usdt.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdt_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdt.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        usdt_bnb = await factory.getPair(usdt.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('usdt_bnb:', usdt_bnb);
      let btcb_bnb = await factory.getPair(btcb.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (btcb_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(btcb.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        btcb_bnb = await factory.getPair(btcb.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('btcb_bnb:', btcb_bnb);
      let eth_bnb = await factory.getPair(eth.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (eth_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(eth.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        eth_bnb = await factory.getPair(eth.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('eth_bnb:', eth_bnb);
      let usdc_busd = await factory.getPair(usdc.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdc_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdc.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        usdc_busd = await factory.getPair(usdc.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('usdc_busd:', usdc_busd);
      let dot_bnb = await factory.getPair(dot.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (dot_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(dot.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
        dot_bnb = await factory.getPair(dot.address, wbnb.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('dot_bnb:', dot_bnb);
      let cake_busd = await factory.getPair(cake.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      if (cake_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(cake.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
        cake_busd = await factory.getPair(cake.address, busd.address, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('cake_busd:', cake_busd);
      // deploy MasterChef
      const masterChef = await deployer.deploy(MasterChef,
        oniToken.address,
        process.env.DEV_ADDRESS,
        config.MasterChef.oniPerBlock,
        config.MasterChef.startBlock,
        { from: process.env.DEPLOYER_ACCOUNT }
      );

      await masterChef.add(40, oni_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(24, oni_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, oni_tndr, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, bnb_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
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

      // await oniToken.mint(process.env.DEPLOYER_ACCOUNT, '1000000000000000000000000', { from: process.env.DEPLOYER_ACCOUNT });
      // await oniToken.mint(smartChef.address, '1000000000000000000000000', { from: process.env.DEPLOYER_ACCOUNT });
      // await oniToken.transferOwnership(masterChef.address, { from: process.env.DEPLOYER_ACCOUNT });

      const timeLock = await deployer.deploy(Timelock,
        process.env.DEPLOYER_ACCOUNT,
        86400 * 2,
        { from: process.env.DEPLOYER_ACCOUNT }
      );

      // await masterChef.transferOwnership(timeLock.address, { from: process.env.DEPLOYER_ACCOUNT });
      // await smartChef.transferOwnership(timeLock.address, { from: process.env.DEPLOYER_ACCOUNT });
    } else if (network === 'bsc') {
      // do nothing for now
      const wbnb = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
      const factory = await OniFactory.at(process.env.ONI_FACTORY_MAINNET, {from: process.env.DEPLOYER_ACCOUNT});

      const oniToken = '0x6c77bb19c69d66bea9e3cdaea108a76ea8d2fd2a';
      const busd = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
      const tndr = '0x7cc46141ab1057b1928de5ad5ee78bb37efc4868';
      const dai = '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3';
      const usdt = '0x55d398326f99059ff775485246999027b3197955';
      const btcb = '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c';
      const eth = '0x2170ed0880ac9a755fd29b2688956bd959f933f8';
      const usdc = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
      const dot = '0x7083609fce4d1d8dc0c979aab8c869ea2c873402';
      const cake = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';

      let oni_busd = await factory.getPair(oniToken, busd, {from: process.env.DEPLOYER_ACCOUNT});
      if (oni_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(oniToken, busd, {from: process.env.DEPLOYER_ACCOUNT});
        oni_busd = await factory.getPair(oniToken, busd, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('oni_busd:', oni_busd);
      let oni_bnb = await factory.getPair(oniToken, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      if (oni_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(oniToken, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
        oni_bnb = await factory.getPair(oniToken, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('oni_bnb:', oni_bnb);
      let oni_tndr = await factory.getPair(oniToken, tndr, {from: process.env.DEPLOYER_ACCOUNT});
      if (oni_tndr == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(oniToken, tndr, {from: process.env.DEPLOYER_ACCOUNT});
        oni_tndr = await factory.getPair(oniToken, tndr, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('oni_tndr:', oni_tndr);
      let bnb_busd = await factory.getPair(wbnb, busd, {from: process.env.DEPLOYER_ACCOUNT});
      if (bnb_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(wbnb, busd, {from: process.env.DEPLOYER_ACCOUNT});
        bnb_busd = await factory.getPair(wbnb, busd, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('bnb_busd:', bnb_busd);
      let dai_busd = await factory.getPair(dai, busd, {from: process.env.DEPLOYER_ACCOUNT});
      if (dai_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(dai, busd, {from: process.env.DEPLOYER_ACCOUNT});
        dai_busd = await factory.getPair(dai, busd, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('dai_busd:', dai_busd);
      let usdt_busd = await factory.getPair(usdt, busd, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdt_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdt, busd, {from: process.env.DEPLOYER_ACCOUNT});
        usdt_busd = await factory.getPair(usdt, busd, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('usdt_busd:', usdt_busd);
      let usdt_bnb = await factory.getPair(usdt, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdt_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdt, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
        usdt_bnb = await factory.getPair(usdt, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('usdt_bnb:', usdt_bnb);
      let btcb_bnb = await factory.getPair(btcb, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      if (btcb_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(btcb, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
        btcb_bnb = await factory.getPair(btcb, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('btcb_bnb:', btcb_bnb);
      let eth_bnb = await factory.getPair(eth, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      if (eth_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(eth, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
        eth_bnb = await factory.getPair(eth, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('eth_bnb:', eth_bnb);
      let usdc_busd = await factory.getPair(usdc, busd, {from: process.env.DEPLOYER_ACCOUNT});
      if (usdc_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(usdc, busd, {from: process.env.DEPLOYER_ACCOUNT});
        usdc_busd = await factory.getPair(usdc, busd, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('usdc_busd:', usdc_busd);
      let dot_bnb = await factory.getPair(dot, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      if (dot_bnb == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(dot, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
        dot_bnb = await factory.getPair(dot, wbnb, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('dot_bnb:', dot_bnb);
      let cake_busd = await factory.getPair(cake, busd, {from: process.env.DEPLOYER_ACCOUNT});
      if (cake_busd == '0x0000000000000000000000000000000000000000') {
        await factory.createPair(cake, busd, {from: process.env.DEPLOYER_ACCOUNT});
        cake_busd = await factory.getPair(cake, busd, {from: process.env.DEPLOYER_ACCOUNT});
      }
      console.log('cake_busd:', cake_busd);

      // deploy MasterChef
      const masterChef = await deployer.deploy(MasterChef,
        oniToken,
        process.env.DEV_ADDRESS,
        config.MasterChef.oniPerBlock,
        config.MasterChef.startBlock,
        { from: process.env.DEPLOYER_ACCOUNT }
      );

      await masterChef.add(40, oni_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(24, oni_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, oni_tndr, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, bnb_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, dai_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, usdt_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, usdt_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, btcb_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, eth_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, usdc_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, dot_bnb, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.add(1, cake_busd, false, { from: process.env.DEPLOYER_ACCOUNT });
      await masterChef.transferOwnership(process.env.MASTERCHEF_OWNER_MAINNET, { from: process.env.DEPLOYER_ACCOUNT });

      // deploy SmartChef
      const smartChef = await deployer.deploy(SmartChef,
        oniToken,
        oniToken,
        config.SmartChef.rewardPerBlock,
        config.SmartChef.startBlock,
        config.SmartChef.bonusEndBlock,
        { from: process.env.DEPLOYER_ACCOUNT }
      );
      await smartChef.transferOwnership(process.env.SMARTCHEF_OWNER_MAINNET, { from: process.env.DEPLOYER_ACCOUNT });

      await deployer.deploy(Timelock,
        process.env.MASTERCHEF_OWNER_MAINNET,
        86400 * 2,
        { from: process.env.DEPLOYER_ACCOUNT }
      );
    }
  });
};
