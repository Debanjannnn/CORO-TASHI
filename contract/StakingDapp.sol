// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.28;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// contract CoroYami is Ownable, ReentrancyGuard {
//     using SafeERC20 for IERC20;

//     constructor() Ownable(msg.sender) {}

//     struct UserInfo {
//         uint256 amount;         // Staked amount
//         uint256 lastRewardAt;   // Last time rewards were calculated
//         uint256 lockUntil;      // Lock period end time
//         uint256 rewardDebt;     // Reward debt (for tracking rewards)
//     }

//     struct PoolInfo {
//         IERC20 stakedToken;     // Token being staked
//         IERC20 rewardToken;     // Reward token
//         uint256 totalStaked;    // Total staked amount
//         uint256 APY;            // Annual percentage yield (APY)
//         uint256 lockDays;       // Lock period in days
//     }

//     struct Notification {
//         uint256 poolId;
//         uint256 amount;
//         address sender;
//         string message;
//         uint256 timestamp;
//     }

//     uint256 public constant DECIMALS = 10 ** 18;
//     uint256 public poolCount;
//     // Changed lock period to 5 minutes for testing (300 seconds)
//     uint256 public constant TEST_LOCK_PERIOD = 300;

//     PoolInfo[] public poolInfo;
//     mapping(uint256 => mapping(address => UserInfo)) public userInfo;
//     Notification[] public notifications;

//     event PoolAdded(address indexed stakedToken, address indexed rewardToken, uint256 APY, uint256 lockDays);
//     event Deposited(address indexed user, uint256 indexed pid, uint256 amount);
//     event Withdrawn(address indexed user, uint256 indexed pid, uint256 amount);
//     event Claimed(address indexed user, uint256 indexed pid, uint256 reward);
//     event NotificationCreated(address indexed sender, string message);

//     function addPool(IERC20 _stakedToken, IERC20 _rewardToken, uint256 _APY, uint256 _lockDays) external onlyOwner {
//         poolInfo.push(PoolInfo({
//             stakedToken: _stakedToken,
//             rewardToken: _rewardToken,
//             totalStaked: 0,
//             APY: _APY,
//             lockDays: _lockDays
//         }));
//         poolCount++;
//         emit PoolAdded(address(_stakedToken), address(_rewardToken), _APY, _lockDays);
        
//         // Create notification for pool creation
//         createNotification(poolCount - 1, 0, "New staking pool created");
//     }

//     function deposit(uint256 _pid, uint256 _amount) external nonReentrant {
//         require(_pid < poolCount, "Invalid pool ID");
//         require(_amount > 0, "Amount must be greater than 0");

//         PoolInfo storage pool = poolInfo[_pid];
//         UserInfo storage user = userInfo[_pid][msg.sender];

//         require(pool.stakedToken.allowance(msg.sender, address(this)) >= _amount, "Insufficient token allowance");

//         uint256 pending = _calculatePendingRewards(_pid, msg.sender);
//         if (pending > 0) {
//             user.rewardDebt += pending;
//             pool.rewardToken.safeTransfer(msg.sender, pending);
//         }

//         pool.stakedToken.safeTransferFrom(msg.sender, address(this), _amount);

//         user.amount += _amount;
//         user.lastRewardAt = block.timestamp;
        
//         // Using 5 minutes (300 seconds) for testing instead of days calculation
//         user.lockUntil = block.timestamp + TEST_LOCK_PERIOD;

//         pool.totalStaked += _amount;
        
//         emit Deposited(msg.sender, _pid, _amount);
        
//         // Create notification for deposit
//         createNotification(_pid, _amount, "Tokens deposited for staking");
//     }

//     function withdraw(uint256 _pid, uint256 _amount) external nonReentrant {
//         require(_pid < poolCount, "Invalid pool ID");
//         UserInfo storage user = userInfo[_pid][msg.sender];
//         require(user.amount >= _amount, "Insufficient balance");
//         require(block.timestamp >= user.lockUntil, "Tokens are locked");

//         PoolInfo storage pool = poolInfo[_pid];

//         // Calculate and transfer pending rewards
//         uint256 pending = _calculatePendingRewards(_pid, msg.sender);
//         if (pending > 0) {
//             user.rewardDebt += pending;
//             pool.rewardToken.safeTransfer(msg.sender, pending);
//             emit Claimed(msg.sender, _pid, pending);
//         }

//         // Update user and pool data
//         user.amount -= _amount;
//         pool.totalStaked -= _amount;

//         // Transfer the staked tokens back to the user
//         pool.stakedToken.safeTransfer(msg.sender, _amount);
//         emit Withdrawn(msg.sender, _pid, _amount);
        
//         // Create notification for withdrawal
//         createNotification(_pid, _amount, "Tokens withdrawn from staking pool");
//     }

//     function claimReward(uint256 _pid) external nonReentrant {
//         require(_pid < poolCount, "Invalid pool ID");

//         UserInfo storage user = userInfo[_pid][msg.sender];
//         PoolInfo storage pool = poolInfo[_pid];

//         uint256 pending = _calculatePendingRewards(_pid, msg.sender);
//         require(pending > 0, "No rewards to claim");

//         user.rewardDebt += pending;
//         pool.rewardToken.safeTransfer(msg.sender, pending);
//         emit Claimed(msg.sender, _pid, pending);
        
//         // Create notification for reward claim
//         createNotification(_pid, pending, "Rewards claimed from staking pool");
//     }

//     function _calculatePendingRewards(uint256 _pid, address _user) internal view returns (uint256) {
//         UserInfo storage user = userInfo[_pid][_user];
//         PoolInfo storage pool = poolInfo[_pid];

//         if (user.amount == 0) {
//             return 0;
//         }

//         uint256 timeElapsed = block.timestamp - user.lastRewardAt;
//         uint256 rewardPerSecond = (user.amount * pool.APY) / (100 * 365 * 24 * 60 * 60);
//         uint256 totalReward = timeElapsed * rewardPerSecond;

//         return totalReward - user.rewardDebt;
//     }

//     function pendingReward(uint256 _pid, address _user) external view returns (uint256) {
//         return _calculatePendingRewards(_pid, _user);
//     }

//     function swap(uint256 _pid, uint256 _amount, address _to) external onlyOwner {
//         require(_pid < poolCount, "Invalid pool ID");
//         PoolInfo storage pool = poolInfo[_pid];

//         require(pool.totalStaked >= _amount, "Not enough liquidity");
//         pool.stakedToken.safeTransfer(_to, _amount);
        
//         // Create notification for swap
//         createNotification(_pid, _amount, "Owner swapped tokens from pool");
//     }

//     function modifyPool(uint256 _pid, uint256 _newAPY) external onlyOwner {
//         require(_pid < poolCount, "Invalid pool ID");
//         PoolInfo storage pool = poolInfo[_pid];
//         pool.APY = _newAPY;
        
//         // Create notification for pool modification
//         createNotification(_pid, _newAPY, "Pool APY modified by owner");
//     }

//     function createNotification(uint256 _pid, uint256 _amount, string memory _message) public {
//         notifications.push(Notification({
//             poolId: _pid,
//             amount: _amount,
//             sender: msg.sender,
//             message: _message,
//             timestamp: block.timestamp
//         }));
//         emit NotificationCreated(msg.sender, _message);
//     }

//     function getNotifications() external view returns (Notification[] memory) {
//         return notifications;
//     }
// }