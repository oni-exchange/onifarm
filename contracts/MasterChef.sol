// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import '@oni-exchange/onilib/contracts/token/BEP20/IBEP20.sol';
import '@oni-exchange/onilib/contracts/token/BEP20/SafeBEP20.sol';

import "./OniToken.sol";

contract MasterChef is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeBEP20 for IBEP20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of ONIs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accOniPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accOniPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IBEP20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool.
                                  // ONIs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that ONIs distribution occurs.
        uint256 accOniPerShare; // Accumulated ONIs per share, times 1e12. See below.
    }

    // The ONI TOKEN!
    OniToken public oni;
    // Dev address.
    address public devAddr;
    // ONI tokens created per block.
    uint256 public oniPerBlock;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when ONI mining starts.
    uint256 public startBlock;
    // Referral Bonus in basis points. Initially set to 2%
    uint256 public refBonusBP = 200;
    // Max referral commission rate: 20%.
    uint16 public constant MAXIMUM_REFERRAL_BP = 2000;
    // Referral Mapping
    mapping(address => address) public referrers; // account_address -> referrer_address
    mapping(address => uint256) public referredCount; // referrer_address -> num_of_referred
    // Pool Exists Mapper
    mapping(IBEP20 => bool) public poolExistence;

    // Minimum emission rate: 0.5 ONI per block.
    uint256 public constant MINIMUM_EMISSION_RATE = 500 finney;
    // Reduce emission every 14,400 blocks ~ 12 hours.
    uint256 public constant EMISSION_REDUCTION_PERIOD_BLOCKS = 14400;
    // Emission reduction rate per period in basis points: 3%.
    uint256 public constant EMISSION_REDUCTION_RATE_PER_PERIOD = 300;
    // Last reduction period index
    uint256 public lastReductionPeriodIndex = 0;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    event Referral(address indexed _user, address indexed _referrer);
    event ReferralPaid(address indexed _user, address indexed _userTo, uint256 _reward);
    event ReferralBonusBpChanged(uint256 _oldBp, uint256 _newBp);

    constructor(
        OniToken _oni,
        address _devAddr,
        uint256 _initialEmissionRate,
        uint256 _startBlock
    ) public {
        devAddr = _devAddr;
        oni = _oni;
        oniPerBlock = _initialEmissionRate;
        startBlock = _startBlock;
    }

    // Get number of pools added.
    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(uint256 _allocPoint, IBEP20 _lpToken, bool _withUpdate)
        public onlyOwner
    {
        require(!poolExistence[_lpToken], "MS: duplicated");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolExistence[_lpToken] = true;
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                accOniPerShare: 0
            })
        );
    }

    // Update the given pool's ONI allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // View function to see pending ONIs on frontend.
    function pendingOni(uint256 _pid, address _user)
        external
        view
        returns (uint256)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accOniPerShare = pool.accOniPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = (block.number).sub(pool.lastRewardBlock);
            uint256 oniReward = multiplier
                .mul(oniPerBlock)
                .mul(pool.allocPoint)
                .div(totalAllocPoint);
            accOniPerShare = accOniPerShare.add(
                oniReward.mul(1e12).div(lpSupply)
            );
        }
        return user.amount.mul(accOniPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0 || pool.allocPoint == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = (block.number).sub(pool.lastRewardBlock);
        uint256 oniReward =
            multiplier
                .mul(oniPerBlock)
                .mul(pool.allocPoint)
                .div(totalAllocPoint);

        oni.mint(devAddr, oniReward.div(10));
        oni.mint(address(this), oniReward);
        pool.accOniPerShare =
            pool.accOniPerShare
                .add(oniReward
                .mul(1e12)
                .div(lpSupply));
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for ONI allocation.
    function deposit(uint256 _pid, uint256 _amount) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending =
                user.amount
                    .mul(pool.accOniPerShare)
                    .div(1e12)
                    .sub(user.rewardDebt);
            if (pending > 0) {
                safeOniTransfer(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );
            user.amount = user.amount.add(_amount);
        }
        user.rewardDebt = user.amount.mul(pool.accOniPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Deposit LP tokens to MasterChef for TNDR allocation with referral.
    function depositReferred(
        uint256 _pid,
        uint256 _amount,
        address _referrer
    ) public nonReentrant
    {
        require(msg.sender != address(_referrer), "MS: Invalid referrer address");
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending =
                user.amount
                    .mul(pool.accOniPerShare)
                    .div(1e12)
                    .sub(user.rewardDebt);
            if (pending > 0) {
                safeOniTransfer(msg.sender, pending);
                payReferralCommission(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            setReferral(msg.sender, _referrer);
            pool.lpToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );
            user.amount = user.amount.add(_amount);
        }

        user.rewardDebt = user.amount.mul(pool.accOniPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "MS: not good");
        updatePool(_pid);
        uint256 pending =
            user.amount
                .mul(pool.accOniPerShare)
                .div(1e12)
                .sub(user.rewardDebt);
        if(pending > 0) {
            safeOniTransfer(msg.sender, pending);
            payReferralCommission(msg.sender, pending);
        }
        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(pool.accOniPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Safe oni transfer function, just in case if rounding error causes pool to not have enough ONIs.
    function safeOniTransfer(address _to, uint256 _amount) internal {
        uint256 oniBal = oni.balanceOf(address(this));
        if (_amount > oniBal) {
            oni.transfer(_to, oniBal);
        } else {
            oni.transfer(_to, _amount);
        }
    }

    // Set Referral Address for a user
    function setReferral(address _user, address _referrer) internal {
        if (_referrer == address(_referrer) && referrers[_user] == address(0) && _referrer != address(0) && _referrer != _user) {
            referrers[_user] = _referrer;
            referredCount[_referrer] += 1;
            emit Referral(_user, _referrer);
        }
    }

    // Get Referral Address for a Account
    function getReferral(address _user) public view returns (address) {
        return referrers[_user];
    }

    // Pay referral commission to the referrer who referred this user.
    function payReferralCommission(address _user, uint256 _pending) internal {
        address referrer = getReferral(_user);
        if (referrer != address(0) && referrer != _user && refBonusBP > 0) {
            uint256 refBonusEarned = _pending.mul(refBonusBP).div(10000);
            oni.mint(referrer, refBonusEarned);
            emit ReferralPaid(_user, referrer, refBonusEarned);
        }
    }

    // Referral Bonus in basis points.
    // Initially set to 2%, this this the ability to increase or decrease the Bonus percentage based on
    // community voting and feedback.
    function updateReferralBonusBp(uint256 _newRefBonusBp) public onlyOwner {
        require(_newRefBonusBp <= MAXIMUM_REFERRAL_BP, "MS: invalid referral bonus basis points");
        require(_newRefBonusBp != refBonusBP, "MS: same bonus bp set");
        uint256 previousRefBonusBP = refBonusBP;
        refBonusBP = _newRefBonusBp;
        emit ReferralBonusBpChanged(previousRefBonusBP, _newRefBonusBp);
    }

    // Update dev address by the previous dev.
    function dev(address _devAddr) public {
        require(msg.sender == devAddr, "MS: wut?");
        devAddr = _devAddr;
    }
}
