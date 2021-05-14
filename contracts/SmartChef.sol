pragma solidity ^0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@oni-exchange/onilib/contracts/token/BEP20/IBEP20.sol";
import "@oni-exchange/onilib/contracts/token/BEP20/SafeBEP20.sol";

// import "@nomiclabs/buidler/console.sol";

contract SmartChef is Ownable {
    using SafeMath for uint256;
    using SafeBEP20 for IBEP20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
    }

    // The ONI TOKEN!
    IBEP20 public stakingToken;
    IBEP20 public rewardToken;
    uint256 lastRewardBlock;  // Last block number that ONIs distribution occurs.
    uint256 accOniPerShare; // Accumulated ONIs per share, times 1e12. See below.

    // ONI tokens created per block.
    uint256 public rewardPerBlock;

    // Info of each user that stakes LP tokens.
    mapping (address => UserInfo) public userInfo;
    // The block number when ONI mining starts.
    uint256 public startBlock;
    // The block number when ONI mining ends.
    uint256 public endBlock;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    constructor(
        IBEP20 _stakingToken,
        IBEP20 _rewardToken,
        uint256 _rewardPerBlock,
        uint256 _startBlock,
        uint256 _endBlock
    ) public {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
        rewardPerBlock = _rewardPerBlock;
        startBlock = _startBlock;
        endBlock = _endBlock;

        // staking pool
        lastRewardBlock = startBlock;
        accOniPerShare = 0;
    }

    function stopReward() public onlyOwner {
        endBlock = block.number;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        if (_to <= endBlock) {
            return _to.sub(_from);
        } else if (_from >= endBlock) {
            return 0;
        } else {
            return endBlock.sub(_from);
        }
    }

    // View function to see pending Reward on frontend.
    function pendingReward(address _user) external view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 _accOniPerShare = accOniPerShare;
        uint256 lpSupply = stakingToken.balanceOf(address(this));
        if (block.number > lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(lastRewardBlock, block.number);
            uint256 oniReward = multiplier.mul(rewardPerBlock);
            _accOniPerShare = _accOniPerShare.add(oniReward.mul(1e12).div(lpSupply));
        }
        return user.amount.mul(_accOniPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool() public {
        if (block.number <= lastRewardBlock) {
            return;
        }
        uint256 lpSupply = stakingToken.balanceOf(address(this));
        if (lpSupply == 0) {
            lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(lastRewardBlock, block.number);
        uint256 oniReward = multiplier.mul(rewardPerBlock);
        accOniPerShare = accOniPerShare.add(oniReward.mul(1e12).div(lpSupply));
        lastRewardBlock = block.number;
    }

    // Stake stakingToken tokens to SmartChef
    function deposit(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];

        updatePool();
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(accOniPerShare).div(1e12).sub(user.rewardDebt);
            if(pending > 0) {
                rewardToken.safeTransfer(address(msg.sender), pending);
            }
        }
        if(_amount > 0) {
            stakingToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount.add(_amount);
        }
        user.rewardDebt = user.amount.mul(accOniPerShare).div(1e12);

        emit Deposit(msg.sender, _amount);
    }

    // Withdraw stakingToken tokens from STAKING.
    function withdraw(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool();
        uint256 pending = user.amount.mul(accOniPerShare).div(1e12).sub(user.rewardDebt);
        if(pending > 0) {
            rewardToken.safeTransfer(address(msg.sender), pending);
        }
        if(_amount > 0) {
            user.amount = user.amount.sub(_amount);
            stakingToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(accOniPerShare).div(1e12);

        emit Withdraw(msg.sender, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw() public {
        UserInfo storage user = userInfo[msg.sender];
        stakingToken.safeTransfer(address(msg.sender), user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
        emit EmergencyWithdraw(msg.sender, user.amount);
    }

    // Withdraw reward. EMERGENCY ONLY.
    function emergencyRewardWithdraw(uint256 _amount) public onlyOwner {
        require(_amount < rewardToken.balanceOf(address(this)), 'not enough token');
        rewardToken.safeTransfer(address(msg.sender), _amount);
    }

}
