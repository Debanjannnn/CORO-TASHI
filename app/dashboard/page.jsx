"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import abi from '@/utils/abi'; // Path to your ABI file
import { CONTRACT_ADDRESS } from '@/utils/constants';
import { toast } from 'sonner';


const UserDashboard = () => {
  // State variables
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [pools, setPools] = useState([]);
  const [userStakes, setUserStakes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [notificationCreating, setNotificationCreating] = useState(false);

  // Form states
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationAmount, setNotificationAmount] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
    // New state for user balance
  const [stakedTokenBalance, setStakedTokenBalance] = useState('0');
    const [stakedTokenContract, setStakedTokenContract] = useState(null);
  // Contract address - Update this with your actual deployed contract address
; // Replace with actual contract address

  // ERC20 ABI (minimal for approval)
  const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
        "function balanceOf(address account) external view returns (uint256)",
        "function decimals() external view returns (uint8)",
        "function symbol() external view returns (string)",
  ];

  // Connect to wallet and contract
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        setLoading(true); // Start loading indicator
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        setContract(contract);

        // Load data after connecting
        await loadData(contract, account);
      } else {
        setError('Please install MetaMask to use this dApp');
        toast.error('Please install MetaMask to use this dApp'); // Toast notification
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
      toast.error('Failed to connect wallet'); // Toast notification
    } finally {
      setLoading(false); // Stop loading indicator, regardless of success/failure
    }
  };

    const fetchStakedTokenBalance = useCallback(async (tokenAddress, account) => {
        if (!signer || !tokenAddress || !account) return;

        try {
            const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
            setStakedTokenContract(contract);
            const balance = await contract.balanceOf(account);
            const decimals = await contract.decimals();
            const formattedBalance = ethers.formatUnits(balance, decimals);
            setStakedTokenBalance(formattedBalance);
        } catch (error) {
            console.error("Error fetching staked token balance:", error);
            setStakedTokenBalance('0');
            toast.error('Failed to fetch staked token balance.');
        }
    }, [signer]);
  // Load contract data
  const loadData = async (contract, account) => {
    try {
      setLoading(true);

      // Get pool count
      const poolCount = await contract.poolCount();

      // Load pool information
      const poolsData = [];
      for (let i = 0; i < poolCount; i++) {
        const pool = await contract.poolInfo(i);

        // Get user stake information for this pool
        const userInfo = await contract.userInfo(i, account);

        // Calculate pending rewards
        const pendingRewards = await contract.pendingReward(i, account);

        poolsData.push({
          id: i,
          stakedToken: pool.stakedToken,
          rewardToken: pool.rewardToken,
          totalStaked: ethers.formatEther(pool.totalStaked),
          APY: pool.APY.toString() / 100, // Assuming APY is stored as percentage * 100
          lockDays: pool.lockDays.toString(),
          userStaked: ethers.formatEther(userInfo.amount),
          userRewards: ethers.formatEther(pendingRewards),
          lockUntil: new Date(Number(userInfo.lockUntil) * 1000).toLocaleDateString(),
          canWithdraw: Date.now() > Number(userInfo.lockUntil) * 1000
        });
      }

      setPools(poolsData);

      // Load notifications
      const notificationsData = await contract.getNotifications();
      setNotifications(notificationsData.map(notification => ({
        poolId: notification.poolId.toString(),
        amount: ethers.formatEther(notification.amount),
        sender: notification.sender,
        message: notification.message,
        timestamp: new Date(Number(notification.timestamp) * 1000).toLocaleString()
      })));

      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load contract data');
      toast.error('Failed to load contract data'); // Toast notification
    } finally {
      setLoading(false);
    }
  };

  const checkApproval = async (poolId, amountInWei) => {
    if (!signer || !pools[poolId]) return false;

    try {
      const stakedTokenContract = new ethers.Contract(pools[poolId].stakedToken, ERC20_ABI, signer);
      const allowance = await stakedTokenContract.allowance(account, CONTRACT_ADDRESS);

      return allowance.lt(amountInWei); // True if approval is needed
    } catch (error) {
      console.error("Error checking approval:", error);
      setError("Error checking token allowance");
      toast.error("Error checking token allowance");
      return false; // Assume approval needed in case of error
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const amountInWei = ethers.parseEther(depositAmount);

      const stakedTokenContract = new ethers.Contract(pools[selectedPool].stakedToken, ERC20_ABI, signer);
      const tx = await stakedTokenContract.approve(CONTRACT_ADDRESS, amountInWei);
      await tx.wait();

      toast.success("Token approval successful!");
      await loadData(contract, account);
      setApprovalRequired(false); // Update approval state
    } catch (err) {
      console.error("Error approving tokens:", err);
      setError("Failed to approve tokens");
      toast.error("Failed to approve tokens");
    } finally {
      setApproving(false);
    }
  };
  
    // New function to set max deposit amount
    const setMaxDeposit = () => {
        setDepositAmount(stakedTokenBalance);
    };

    useEffect(() => {
        if (pools.length > 0 && pools[selectedPool] && account && signer) {
            fetchStakedTokenBalance(pools[selectedPool].stakedToken, account);
        }
    }, [pools, selectedPool, account, signer, fetchStakedTokenBalance]);
  // Deposit tokens
  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      setDepositing(true);
      if (!contract || !depositAmount) return;

        if (isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
            setError("Invalid deposit amount. Please enter a positive number.");
            toast.error("Invalid deposit amount. Please enter a positive number.");
            return;
        }

      // Convert the amount to wei
      const amountInWei = ethers.parseEther(depositAmount);

      const needsApproval = await checkApproval(selectedPool, amountInWei);
      if (needsApproval) {
        setApprovalRequired(true);
        toast.warn("Token approval required before deposit");
        return;
      }

      // Deposit to the contract
      const tx = await contract.deposit(selectedPool, amountInWei);
      await tx.wait();

      toast.success("Deposit successful!");
      // Refresh data
      await loadData(contract, account);
      setDepositAmount('');
    } catch (err) {
      console.error('Error depositing tokens:', err);
      setError('Failed to deposit tokens: ' + err.message);
      toast.error('Failed to deposit tokens: ' + err.message);
    } finally {
      setDepositing(false);
      setApprovalRequired(false);
    }
  };

  // Withdraw tokens
  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      setWithdrawing(true);
      if (!contract || !withdrawAmount) return;

      // Convert the amount to wei
      const amountInWei = ethers.parseEther(withdrawAmount);

      // Withdraw from the contract
      const tx = await contract.withdraw(selectedPool, amountInWei);
      await tx.wait();

      toast.success("Withdrawal successful!");
      // Refresh data
      await loadData(contract, account);
      setWithdrawAmount('');
    } catch (err) {
      console.error('Error withdrawing tokens:', err);
      setError('Failed to withdraw tokens. Check if lock period has ended.');
      toast.error('Failed to withdraw tokens. Check if lock period has ended.');
    } finally {
      setWithdrawing(false);
    }
  };

  // Claim rewards
  const handleClaimRewards = async (poolId) => {
    try {
      setClaiming(true);
      if (!contract) return;

      const tx = await contract.claimReward(poolId);
      await tx.wait();

      toast.success("Rewards claimed successfully!");
      // Refresh data
      await loadData(contract, account);
    } catch (err) {
      console.error('Error claiming rewards:', err);
      setError('Failed to claim rewards');
      toast.error('Failed to claim rewards');
    } finally {
      setClaiming(false);
    }
  };

  // Create notification
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      setNotificationCreating(true);
      if (!contract || !notificationMessage) return;

      // Convert the amount to wei
      const amountInWei = ethers.parseEther(notificationAmount || '0');

      // Create notification
      const tx = await contract.createNotification(selectedPool, amountInWei, notificationMessage);
      await tx.wait();

      toast.success("Notification created successfully!");
      // Refresh data
      await loadData(contract, account);
      setNotificationMessage('');
      setNotificationAmount('');
    } catch (err) {
      console.error('Error creating notification:', err);
      setError('Failed to create notification');
      toast.error('Failed to create notification');
    } finally {
      setNotificationCreating(false);
    }
  };

  // Initial connection
  useEffect(() => {
    connectWallet();

    // Setup event listeners for MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      // Remove listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  // Refresh data every 30 seconds
  useEffect(() => {
    if (contract && account) {
      const interval = setInterval(() => {
        loadData(contract, account);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [contract, account]);

  // Helper to truncate addresses
  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CoroYami Staking Dashboard</h1>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      {/* Wallet Connection */}
      <div className="mb-6 p-4 border rounded">
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Connecting...</> : "Connect Wallet"}
          </button>
        ) : (
          <div>
            <span>Connected: {truncateAddress(account)}</span>
          </div>
        )}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <button onClick={() => setError('')}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
          </span>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading data...</span>
        </div>
      )}
      
      {/* Staking Pools */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Staking Pools</h2>
        
        {!loading && pools.length === 0 && (
          <div className="text-gray-500">No staking pools available</div>
        )}
        
        {pools.map((pool) => (
          <div key={pool.id} className="border rounded p-4 mb-4">
            <h3 className="font-medium">Pool #{pool.id}</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>Staked Token: {truncateAddress(pool.stakedToken)}</div>
              <div>Reward Token: {truncateAddress(pool.rewardToken)}</div>
              <div>APY: {pool.APY}%</div>
              <div>Lock Period: {pool.lockDays} days</div>
              <div>Total Staked: {pool.totalStaked}</div>
            </div>
            
            <div className="bg-gray-100 p-3 rounded">
              <h4 className="font-medium">Your Position</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>Staked: {pool.userStaked}</div>
                <div>Pending Rewards: {pool.userRewards}</div>
                <div>Locked Until: {pool.lockUntil}</div>
              </div>
              
              <button
                onClick={() => handleClaimRewards(pool.id)}
                disabled={parseFloat(pool.userRewards) <= 0 || claiming}
                className={`mt-3 px-4 py-2 rounded ${parseFloat(pool.userRewards) > 0 ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-gray-300 cursor-not-allowed'} disabled:opacity-50`}
              >
                {claiming ? <><i className="fas fa-spinner fa-spin mr-2"></i> Claiming...</> : "Claim Rewards"}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Deposit Form */}
      <div className="mb-6 border rounded p-4">
        <h2 className="text-xl font-semibold mb-3">Deposit Tokens</h2>
            {pools[selectedPool] && stakedTokenContract ? (
                <p className="mb-2">
                    Your {pools[selectedPool].stakedToken} Balance: {stakedTokenBalance}
                </p>
            ) : (
                <p className="mb-2">Loading Balance...</p>
            )}
        <form onSubmit={handleDeposit}>
          <div className="mb-3">
            <label className="block mb-1">Select Pool</label>
            <select
              value={selectedPool}
              onChange={(e) => {
                setSelectedPool(Number(e.target.value));
                setDepositAmount(''); // Reset deposit amount when changing pools
              }}
              className="border rounded p-2 w-full"
            >
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  Pool #{pool.id} - {pool.APY}% APY
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Amount</label>
            <div className="flex">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.0"
                className="border rounded p-2 w-full mr-2"
              />
              <button
                type="button"
                onClick={setMaxDeposit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Max
              </button>
            </div>
          </div>
          
          {approvalRequired && (
            <button
              type="button"
              onClick={handleApprove}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-3 w-full disabled:opacity-50"
              disabled={approving}
            >
              {approving ? <><i className="fas fa-spinner fa-spin mr-2"></i> Approving...</> : "Approve Tokens"}
            </button>
          )}
          
          <button
            type="submit"
            disabled={!account || !depositAmount || approvalRequired || depositing}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
          >
            {depositing ? <><i className="fas fa-spinner fa-spin mr-2"></i> Depositing...</> : "Deposit"}
          </button>
        </form>
      </div>
      
      {/* Withdraw Form */}
      <div className="mb-6 border rounded p-4">
        <h2 className="text-xl font-semibold mb-3">Withdraw Tokens</h2>
        <form onSubmit={handleWithdraw}>
          <div className="mb-3">
            <label className="block mb-1">Select Pool</label>
            <select
              value={selectedPool}
              onChange={(e) => setSelectedPool(Number(e.target.value))}
              className="border rounded p-2 w-full"
            >
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  Pool #{pool.id} - {pool.userStaked} staked
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Amount</label>
            <input
              type="text"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.0"
              className="border rounded p-2 w-full"
            />
          </div>
          
          <button
            type="submit"
            disabled={!account || !withdrawAmount || withdrawing}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
          >
            {withdrawing ? <><i className="fas fa-spinner fa-spin mr-2"></i> Withdrawing...</> : "Withdraw"}
          </button>
          <div className="text-sm text-gray-500 mt-1">
            Note: You can only withdraw after the lock period has ended
          </div>
        </form>
      </div>
      
      {/* Notifications Section */}
      <div className="mb-6 border rounded p-4">
        <h2 className="text-xl font-semibold mb-3">Notifications</h2>
        
        {/* Create Notification Form */}
        <div className="mb-4 border-b pb-4">
          <h3 className="font-medium mb-2">Create New Notification</h3>
          <form onSubmit={handleCreateNotification}>
            <div className="mb-3">
              <label className="block mb-1">Select Pool</label>
              <select
                value={selectedPool}
                onChange={(e) => setSelectedPool(Number(e.target.value))}
                className="border rounded p-2 w-full"
              >
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>Pool #{pool.id}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block mb-1">Amount (optional)</label>
              <input
                type="text"
                value={notificationAmount}
                onChange={(e) => setNotificationAmount(e.target.value)}
                placeholder="0.0"
                className="border rounded p-2 w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block mb-1">Message</label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Your message here..."
                className="border rounded p-2 w-full"
                rows="3"
              />
            </div>
            
            <button
              type="submit"
              disabled={!account || !notificationMessage || notificationCreating}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
            >
              {notificationCreating ? <><i className="fas fa-spinner fa-spin mr-2"></i> Posting...</> : "Post Notification"}
            </button>
          </form>
        </div>
        
        {/* Notifications List */}
        <div>
          <h3 className="font-medium mb-2">Recent Notifications</h3>
          
          {!loading && notifications.length === 0 && (
            <div className="text-gray-500">No notifications yet</div>
          )}
          
          {notifications.map((notification, index) => (
            <div key={index} className="border-b last:border-b-0 py-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pool #{notification.poolId}</span>
                <span>{notification.timestamp}</span>
              </div>
              <div className="mt-1">
                <span className="font-medium">{truncateAddress(notification.sender)}</span>
                {notification.amount !== '0.0' && (
                  <span className="ml-2">Amount: {notification.amount}</span>
                )}
              </div>
              <p className="mt-1">{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;