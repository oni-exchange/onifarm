/* Configure */
const Web3 = require("web3");
const { expectRevert, time, ether, expectEvent } = require('@openzeppelin/test-helpers');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const DotEnv = require('dotenv').config();
const fs = require('fs');
const truffle_config = require('../truffle-config.js');

const mnemonic = fs.readFileSync('../.secret').toString().trim();

/* Load Artifacts */
const MockBEP20 = artifacts.require('MockBEP20');

/** .env file content
DEPLOYER_ACCOUNT
BSCSCAN_API_KEY=
ONI_TOKEN_ADDRESS=
SYRUP_TOKEN_ADDRESS=
MINTER_ADDRESS=
IFO_ADMIN_ADDRESS=
NFT_ROLE_ADDRESS=
POINT_ROLE_ADDRESS=
SPECIAL_ROLE_ADDRESS=
*/

//const IFO = artifacts.require("IFO");
//const OniProfile = artifacts.require('OniProfile');
//const PointCenterIFO = artifacts.require('PointCenterIFO');
//const ClaimBackOni = artifacts.require('ClaimBackOni');
//
//const OniRobots = artifacts.require('OniRobots');
//const RobotMintingStation = artifacts.require('RobotMintingStation');
//const RobotFactoryV2 = artifacts.require('RobotFactoryV2');
//const RobotFactoryV3 = artifacts.require('RobotFactoryV3');
//
//const TradingCompV1= artifacts.require('TradingCompV1');
//const RobotSpecialV1 = artifacts.require('RobotSpecialV1');

const config = {
    MasterChef: {
        oniPerBlock: '1000',
        startBlock: '100',
        dev: process.env.DEPLOYER_ACCOUNT,
        startBlock: 8620481
    },
//    IFO: {
//        adminAddress: process.env.IFO_ADMIN_ADDRESS,
//        offeringAmount: '100',
//        raisingAmount: '80',
//        startBlock: '8571079', // + ~1 day
//        endBlock: '8892171' // + ~11 days
//    },
    SmartChef: {
        rewardPerBlock: '10',
        startBlock: '100',
        bonusEndBlock: '200'
    },
//    OniProfile: {
//        NFT_ROLE_ADDRESS: process.env.NFT_ROLE_ADDRESS,
//        POINT_ROLE_ADDRESS: process.env.POINT_ROLE_ADDRESS,
//        SPECIAL_ROLE_ADDRESS: process.env.SPECIAL_ROLE_ADDRESS,
//        numberOniToReactivate: '1',
//        numberOniToRegister: '1',
//        numberOniToUpdate: '1'
//    },
//    PointCenterIFO: {
//        maxViewLength: '10'
//    },
//    ClaimBackOni: {
//        numberOni: '10',
//        thresholdUser: '5'
//    },
//    Robots: {
//        baseUri: "127.0.0.1"
//    },
//    RobotFactory: { // V2 & V3
//        tokenPrice: '1',
//        ipfsHash: 'QmWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//        startBlockNumber: '8571079', // + ~1 day
//        endBlockNumber: '8892171' // + ~11 days
//    },
//    RobotSpecial: {
//        maxViewLength: '10'
//    }
};

module.exports = function(deployer) {
if (network === 'development' || network === 'test' || network === 'soliditycoverage' || network=='otherhost') {
    // do nothing for now
  } else if (network === 'bsctestnet') { // binance testnet
    // deploy OniToken
    await deployer.deploy(OniToken, { from: process.env.DEPLOYER_ACCOUNT });
    const OniTokenInstance = await OniToken.deployed();
    // deploy SyrupBar
    await deployer.deploy(SyrupBar, OniTokenInstance.address, { from: process.env.DEPLOYER_ACCOUNT });
    const SyrupBarInstance = await SyrupBar.deployed();

    // preserve usage hard-coded addresses as an option
    const oniTokenAddress = OniTokenInstance.address;   //process.env.ONI_TOKEN_ADDRESS;
    const syrupTokenAddress = SyrupBarInstance.address; //process.env.SYRUP_TOKEN_ADDRESS;

    // deploy MasterChef
    await deployer.deploy(MasterChef,
        OniTokenInstance.address,
        SyrupBarInstance.address,
        process.env.DEPLOYER_ACCOUNT,
        config.MasterChef.oniPerBlock,
        config.MasterChef.startBlock,
        { from: process.env.DEPLOYER_ACCOUNT }
        );
    const MasterChefInstance = await MasterChef.deployed();

    // chef owns oni & syrup tokens
    // TODO (IntegralTeam): need to consolidate owners
    await OniTokenInstance.transferOwnership(MasterChefInstance.address, { from: process.env.DEPLOYER_ACCOUNT });
    await SyrupBarInstance.transferOwnership(MasterChefInstance.address, { from: process.env.DEPLOYER_ACCOUNT });

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
};
