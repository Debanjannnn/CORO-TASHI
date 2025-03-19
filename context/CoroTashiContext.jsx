"use client"
import abi from "@/utils/abi";
import { CONTRACT_ADDRESS, CORE_TESTNET_CHAIN_ID, CORE_TESTNET_PARAMS } from "@/utils/constants";
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";

export const CoroTashiContext = createContext();

export function CoroTashiProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);

    // Contract data
    const [pools, setPools] = useState([]);
    const [poolCount, setPoolCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [userStakes, setUserStakes] = useState({});
    const [pendingRewards, setPendingRewards] = useState({});
   
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            const providerInstance = new ethers.BrowserProvider(window.ethereum);
            setProvider(providerInstance);
          
            providerInstance.send("eth_accounts", [])
                .then(accounts => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setIsConnected(true);
                        
                        providerInstance.getSigner().then(signer => {
                            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
                            setContract(contractInstance);
                            
                            // Fetch initial data once connected
                            fetchPools();
                            fetchNotifications();
                        });
                    }
                })
                .catch(err => console.error("Error checking accounts:", err));
                
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                    
                    providerInstance.getSigner().then(signer => {
                        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
                        setContract(contractInstance);
                        
                        // Refresh data on account change
                        fetchPools();
                        fetchNotifications();
                        fetchUserStakes();
                    });
                } else {
                    setAccount(null);
                    setIsConnected(false);
                }
            });
        }
        
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, []);

    // Effect to fetch user stakes when account or contract changes
    useEffect(() => {
        if (account && contract && pools.length > 0) {
            fetchUserStakes();
            fetchPendingRewards();
        }
    }, [account, contract, pools.length]);

    async function shortenAddress(address) {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    const switchToCore = async () => {
        const ethereum = window.ethereum;
        if (!ethereum) {
            setError("Please install MetaMask!");
            return false;
        }
    
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CORE_TESTNET_CHAIN_ID }],
            });
            return true;
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [CORE_TESTNET_PARAMS],
                    });
                    return true;
                } catch (addError) {
                    console.error("Error adding Core Testnet:", addError);
                    setError("Failed to add Core Testnet network");
                    return false;
                }
            } else {
                console.error("Error switching to Core Testnet:", switchError);
                setError("Failed to switch to Core Testnet");
                return false;
            }
        }
    };

    async function copyAddress() {
        if (!account) return;
        try {
            await navigator.clipboard.writeText(account);
            console.log("Address copied to clipboard");
        } catch (err) {
            console.error("Failed to copy address:", err);
            setError("Failed to copy address to clipboard");
        }
    }
  
    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
            try {
                console.log("Connecting to wallet...");
                setLoading(true);
                
                // Check if we need to switch networks
                const networkSwitched = await switchToCore();
                if (!networkSwitched) {
                    throw new Error("Failed to switch to Core network");
                }
                
                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                setProvider(providerInstance);
    
                const signer = await providerInstance.getSigner();
                const accounts = await providerInstance.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
    
                const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
                setContract(contractInstance);
    
                setIsConnected(true);
                
                // Fetch data after connection
                await fetchPools();
                await fetchNotifications();
                await fetchUserStakes();
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
                setError("Error connecting to wallet: " + error.message);
            } finally {
                setLoading(false);
            }
        } else {
            alert("MetaMask is required to use this app.");
            window.open("https://metamask.io/download.html", "_blank");
        }
    }

    async function fetchPools() {
        try {
            setLoading(true);
            if (!contract) return;

            const count = await contract.poolCount();
            setPoolCount(Number(count));

            const poolsData = [];
            for (let i = 0; i < count; i++) {
                const pool = await contract.poolInfo(i);
                poolsData.push({
                    id: i,
                    stakedToken: pool.stakedToken,
                    rewardToken: pool.rewardToken,
                    totalStaked: ethers.formatEther(pool.totalStaked),
                    APY: pool.APY.toString(),
                    lockDays: pool.lockDays.toString()
                });
            }
            setPools(poolsData);
        } catch (error) {
            console.error("Error fetching pools:", error);
            setError("Error fetching pools");
        } finally {
            setLoading(false);
        }
    }

    async function fetchNotifications() {
        try {
            setLoading(true);
            if (!contract) return;

            const notificationsData = await contract.getNotifications();
            
            const formattedNotifications = notificationsData.map(notification => ({
                poolId: Number(notification.poolId),
                amount: ethers.formatEther(notification.amount),
                sender: notification.sender,
                message: notification.message,
                timestamp: new Date(Number(notification.timestamp) * 1000).toLocaleString()
            }));
            
            setNotifications(formattedNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError("Error fetching notifications");
        } finally {
            setLoading(false);
        }
    }

    async function fetchUserStakes() {
        try {
            if (!contract || !account) return;
            
            const userStakesData = {};
            
            for (let i = 0; i < poolCount; i++) {
                const userInfo = await contract.userInfo(i, account);
                
                userStakesData[i] = {
                    amount: ethers.formatEther(userInfo.amount),
                    lastRewardAt: new Date(Number(userInfo.lastRewardAt) * 1000).toLocaleString(),
                    lockUntil: new Date(Number(userInfo.lockUntil) * 1000).toLocaleString(),
                    isLocked: Number(userInfo.lockUntil) > Math.floor(Date.now() / 1000),
                    rewardDebt: ethers.formatEther(userInfo.rewardDebt)
                };
            }
            
            setUserStakes(userStakesData);
        } catch (error) {
            console.error("Error fetching user stakes:", error);
            setError("Error fetching user stakes");
        }
    }

    async function fetchPendingRewards() {
        try {
            if (!contract || !account) return;
            
            const pendingRewardsData = {};
            
            for (let i = 0; i < poolCount; i++) {
                const pending = await contract.pendingReward(i, account);
                pendingRewardsData[i] = ethers.formatEther(pending);
            }
            
            setPendingRewards(pendingRewardsData);
        } catch (error) {
            console.error("Error fetching pending rewards:", error);
            setError("Error fetching pending rewards");
        }
    }

    async function addPool(stakedToken, rewardToken, APY, lockDays) {
        try {
            setLoading(true);
            if (!contract) throw new Error("Contract not initialized");

            const tx = await contract.addPool(
                stakedToken,
                rewardToken,
                APY,
                lockDays
            );
            await tx.wait();
            await fetchPools();
            await fetchNotifications();
        } catch (error) {
            console.error("Error adding pool:", error);
            setError("Error adding pool: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function modifyPool(pid, newAPY) {
        try {
            setLoading(true);
            if (!contract) throw new Error("Contract not initialized");

            const tx = await contract.modifyPool(pid, newAPY);
            await tx.wait();
            await fetchPools();
            await fetchNotifications();
        } catch (error) {
            console.error("Error modifying pool:", error);
            setError("Error modifying pool: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function stake(pid, amount) {
        try {
            setLoading(true);
            if (!contract) throw new Error("Contract not initialized");

            // Convert amount to Wei
            const amountInWei = ethers.parseEther(amount.toString());
            
            // Get the staked token address
            const poolInfo = await contract.poolInfo(pid);
            const tokenContract = new ethers.Contract(
                poolInfo.stakedToken,
                [
                    "function approve(address spender, uint256 amount) public returns (bool)",
                    "function allowance(address owner, address spender) public view returns (uint256)"
                ],
                await provider.getSigner()
            );
            
            // Check allowance
            const allowance = await tokenContract.allowance(account, CONTRACT_ADDRESS);
            if (allowance < amountInWei) {
                // Approve tokens if allowance is insufficient
                const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, amountInWei);
                await approveTx.wait();
            }
            
            // Deposit to the staking contract
            const tx = await contract.deposit(pid, amountInWei);
            await tx.wait();
            
            // Refresh data
            await fetchPools();
            await fetchUserStakes();
            await fetchPendingRewards();
            await fetchNotifications();
        } catch (error) {
            console.error("Error staking:", error);
            setError("Error staking: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function unstake(pid, amount) {
        try {
            setLoading(true);
            if (!contract) throw new Error("Contract not initialized");
            
            // Convert amount to Wei
            const amountInWei = ethers.parseEther(amount.toString());
            
            // Withdraw from the staking contract
            const tx = await contract.withdraw(pid, amountInWei);
            await tx.wait();
            
            // Refresh data
            await fetchPools();
            await fetchUserStakes();
            await fetchPendingRewards();
            await fetchNotifications();
        } catch (error) {
            console.error("Error unstaking:", error);
            setError("Error unstaking: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function claimReward(pid) {
        try {
            setLoading(true);
            if (!contract) throw new Error("Contract not initialized");
            
            // Claim rewards from the staking contract
            const tx = await contract.claimReward(pid);
            await tx.wait();
            
            // Refresh data
            await fetchPools();
            await fetchUserStakes();
            await fetchPendingRewards();
            await fetchNotifications();
        } catch (error) {
            console.error("Error claiming reward:", error);
            setError("Error claiming reward: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function createNotification(pid, amount, message) {
        try {
            setLoading(true);
            if (!contract) throw new Error("Contract not initialized");
            
            // Convert amount to Wei
            const amountInWei = ethers.parseEther(amount.toString());
            
            // Create notification
            const tx = await contract.createNotification(pid, amountInWei, message);
            await tx.wait();
            
            // Refresh notifications
            await fetchNotifications();
        } catch (error) {
            console.error("Error creating notification:", error);
            setError("Error creating notification: " + error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Refreshes all data from the contract
    async function refreshData() {
        if (!contract || !account) return;
        
        setLoading(true);
        try {
            await fetchPools();
            await fetchUserStakes();
            await fetchPendingRewards();
            await fetchNotifications();
        } catch (error) {
            console.error("Error refreshing data:", error);
            setError("Error refreshing data");
        } finally {
            setLoading(false);
        }
    }

    const value = {
        connectWallet,
        account,
        isConnected,
        shortenAddress,
        copyAddress,
        switchToCore,
        pools,
        poolCount,
        notifications,
        userStakes,
        pendingRewards,
        loading,
        error,
        fetchPools,
        fetchNotifications,
        fetchUserStakes,
        fetchPendingRewards,
        addPool,
        modifyPool, 
        stake,
        unstake,
        claimReward,
        createNotification,
        refreshData
    };
  
    return (
        <CoroTashiContext.Provider value={value}>
            {children}
        </CoroTashiContext.Provider>
    );
}
  
export const useCoroTashi = () => {
    const context = useContext(CoroTashiContext);
    if (!context) {
        throw new Error("useCoroTashi must be used within a CoroTashiProvider");
    }
    return context;
};