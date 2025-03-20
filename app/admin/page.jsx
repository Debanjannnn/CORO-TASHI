"use client"
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, CoinsIcon, UserPlus } from "lucide-react";
import abi from "@/utils/abi";
import ERC20_ABI from "@/utils/erc20abi"
import { CONTRACT_ADDRESS } from "@/utils/constants";



const AdminPage = () => {
  const [account, setAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [pools, setPools] = useState([]);

  // Form states
  const [newPool, setNewPool] = useState({
    stakedToken: "",
    rewardToken: "",
    APY: "",
    lockDays: "",
  });
  const [rewardDeposit, setRewardDeposit] = useState({
    poolId: "0",
    amount: "",
  });
  const [newOwner, setNewOwner] = useState("");

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage({ type: "error", text: "Please install MetaMask!" });
        return;
      }

      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      setAccount(accounts[0]);
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase());
      await fetchData();
      setLoading(false);

    } catch (error) {
      console.error("Error connecting wallet:", error);
      setMessage({ type: "error", text: "Failed to connect wallet" });
      setLoading(false);
    }
  };

  // Connect to contract
  const connectContract = async () => {
    if (!window.ethereum) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  };

  const getTokenContract = async (tokenAddress) => {
    if (!window.ethereum || !tokenAddress) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  };

  // Initial data fetch
  const fetchData = async () => {
    try {
      const contract = await connectContract();
      if (!contract) return;
      await fetchPools();
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: "error", text: "Failed to fetch initial data" });
    }
  };

  const fetchPools = async () => {
    try {
      const contract = await connectContract();
      if (!contract) return;

      const count = await contract.poolCount();
      const poolsData = [];

      for (let i = 0; i < count; i++) {
        const pool = await contract.poolInfo(i);
        const stakedTokenContract = await getTokenContract(pool.stakedToken);
        const rewardTokenContract = await getTokenContract(pool.rewardToken);
        let stakedTokenSymbol = "Unknown";
        let rewardTokenSymbol = "Unknown";
        let availableRewards = "0";

        if (stakedTokenContract) {
          try {
            stakedTokenSymbol = await stakedTokenContract.symbol();
          } catch (error) {
            console.error("Error fetching staked token symbol:", error);
          }
        }
        if (rewardTokenContract) {
          try {
            rewardTokenSymbol = await rewardTokenContract.symbol();
            const rewards = await rewardTokenContract.balanceOf(CONTRACT_ADDRESS);
            availableRewards = ethers.formatEther(rewards);
          } catch (error) {
            console.error("Error fetching reward token info:", error);
          }
        }

        poolsData.push({
          id: i,
          stakedToken: pool.stakedToken,
          rewardToken: pool.rewardToken,
          stakedTokenSymbol,
          rewardTokenSymbol,
          totalStaked: ethers.formatEther(pool.totalStaked),
          APY: pool.APY.toString(),
          lockDays: pool.lockDays.toString(),
          availableRewards,
        });
      }
      setPools(poolsData);
    } catch (error) {
      console.error("Error fetching pools:", error);
      setMessage({ type: "error", text: "Failed to fetch pools" });
    }
  };

  // Add Pool
  const handleAddPool = async () => {
    try {
      setLoading(true);
      const contract = await connectContract();
      if (!contract) return;
      const tx = await contract.addPool(
        newPool.stakedToken,
        newPool.rewardToken,
        newPool.APY,
        newPool.lockDays
      );
      setMessage({ type: "info", text: "Adding pool... Please wait for confirmation" });
      await tx.wait();
      setMessage({ type: "success", text: "Pool added successfully!" });
      setNewPool({ stakedToken: "", rewardToken: "", APY: "", lockDays: "" });
      await fetchPools();
    } catch (error) {
      console.error("Error adding pool:", error);
      setMessage({ type: "error", text: "Failed to add pool: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Deposit Rewards
  const handleDepositRewards = async () => {
    try {
      setLoading(true);
      const contract = await connectContract();
      if (!contract) return;

      const poolId = rewardDeposit.poolId;
      const amount = ethers.parseEther(rewardDeposit.amount);

      const pool = pools.find((p) => p.id === parseInt(poolId));
      if (!pool) {
        setMessage({ type: "error", text: "Pool not found" });
        return;
      }

      const rewardTokenContract = await getTokenContract(pool.rewardToken);
      if (!rewardTokenContract) {
        setMessage({ type: "error", text: "Could not connect to reward token contract." });
        return;
      }

      const balance = await rewardTokenContract.balanceOf(account);
      console.log(ethers.formatEther(balance));

      await rewardTokenContract.approve(CONTRACT_ADDRESS, amount);
      setMessage({ type: "info", text: "Approve reward token to contract... Please wait for confirmation" });
      
      const allowance = await rewardTokenContract.allowance(account, CONTRACT_ADDRESS);
      if (allowance < amount) return;
      console.log(ethers.formatEther(allowance));

      setMessage({ type: "info", text: `Transferring rewards to pool ${poolId}...` });

      const tx = await rewardTokenContract.transfer(CONTRACT_ADDRESS, amount);
      await tx.wait();

      setMessage({ type: "success", text: "Rewards deposited successfully!" });
      setRewardDeposit({ poolId: "0", amount: "" });
      await fetchPools(); // Refresh pools to show updated rewards

    } catch (error) {
      console.error("Error depositing rewards:", error);
      setMessage({ type: "error", text: "Failed to deposit rewards: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Transfer Ownership
  const handleTransferOwnership = async () => {
    try {
      setLoading(true);
      const contract = await connectContract();
      if (!contract) return;
      const tx = await contract.transferOwnership(newOwner);
      setMessage({ type: "info", text: "Transferring ownership... Please wait for confirmation" });
      await tx.wait();
      setMessage({ type: "success", text: "Ownership transferred successfully!" });
      setIsOwner(false);
    } catch (error) {
      console.error("Error transferring ownership:", error);
      setMessage({ type: "error", text: "Failed to transfer ownership: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Form state handlers
  const handleNewPoolChange = (e) => {
    const { name, value } = e.target;
    setNewPool((prev) => ({ ...prev, [name]: value }));
  };

  const handleRewardDepositChange = (e) => {
    const { name, value } = e.target;
    setRewardDeposit((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewOwnerChange = (e) => {
    setNewOwner(e.target.value);
  };

  // Effect for wallet changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        fetchData();
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
            CoroYami Admin Panel
          </h1>

          {!account ? (
            <Button 
              onClick={connectWallet} 
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-zinc-800 text-white">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
              {isOwner ? (
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm">
                  Admin
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                  Not Admin
                </span>
              )}
            </div>
          )}
        </div>

        {message.text && (
          <Alert className={`mb-6 border-none ${
            message.type === "error" 
              ? "bg-red-950/50 text-red-200" 
              : message.type === "success" 
                ? "bg-green-950/50 text-green-200" 
                : "bg-orange-950/50 text-orange-200"
          }`}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {account && isOwner && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1 lg:col-span-2 bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-orange-400">Pools Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {pools.length === 0 ? (
                  <p className="text-zinc-400">No pools created yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pools.map((pool) => (
                      <Card key={pool.id} className="bg-zinc-800 border-zinc-700">
                        <CardHeader>
                          <CardTitle className="text-lg text-orange-400">Pool #{pool.id}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Staked Token:</span>
                            <span className="text-white">{pool.stakedTokenSymbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Reward Token:</span>
                            <span className="text-white">{pool.rewardTokenSymbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Total Staked:</span>
                            <span className="text-white">{pool.totalStaked} {pool.stakedTokenSymbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Available Rewards:</span>
                            <span className="text-orange-400">{pool.availableRewards} {pool.rewardTokenSymbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">APY:</span>
                            <span className="text-orange-400">{pool.APY}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Lock Period:</span>
                            <span className="text-white">{pool.lockDays} days</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Plus className="w-5 h-5" />
                  Add New Pool
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stakedToken" className="text-zinc-400">Staked Token Address</Label>
                    <Input
                      id="stakedToken"
                      name="stakedToken"
                      placeholder="0x..."
                      value={newPool.stakedToken}
                      onChange={handleNewPoolChange}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rewardToken" className="text-zinc-400">Reward Token Address</Label>
                    <Input
                      id="rewardToken"
                      name="rewardToken"
                      placeholder="0x..."
                      value={newPool.rewardToken}
                      onChange={handleNewPoolChange}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="APY" className="text-zinc-400">APY (%)</Label>
                      <Input
                        id="APY"
                        name="APY"
                        type="number"
                        placeholder="5"
                        value={newPool.APY}
                        onChange={handleNewPoolChange}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lockDays" className="text-zinc-400">Lock Period (Days)</Label>
                      <Input
                        id="lockDays"
                        name="lockDays"
                        type="number"
                        placeholder="30"
                        value={newPool.lockDays}
                        onChange={handleNewPoolChange}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAddPool} 
                  disabled={loading || !newPool.stakedToken || !newPool.rewardToken || !newPool.APY || !newPool.lockDays}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Add Pool
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <CoinsIcon className="w-5 h-5" />
                  Deposit Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="poolId" className="text-zinc-400">Select Pool</Label>
                    <select
                      id="poolId"
                      name="poolId"
                      value={rewardDeposit.poolId}
                      onChange={handleRewardDepositChange}
                      className="w-full p-2 rounded-md bg-zinc-800 border-zinc-700 text-white"
                    >
                      {pools.map((pool) => (
                        <option key={pool.id} value={pool.id}>
                          Pool #{pool.id} - {pool.stakedTokenSymbol} (Rewards: {pool.rewardTokenSymbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="amount" className="text-zinc-400">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="text"
                      placeholder="Amount to deposit"
                      value={rewardDeposit.amount}
                      onChange={handleRewardDepositChange}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleDepositRewards} 
                  disabled={loading || !rewardDeposit.amount}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Deposit Rewards
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <UserPlus className="w-5 h-5" />
                  Transfer Ownership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="newOwner" className="text-zinc-400">New Owner Address</Label>
                  <Input
                    id="newOwner"
                    name="newOwner"
                    placeholder="0x..."
                    value={newOwner}
                    onChange={handleNewOwnerChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleTransferOwnership} 
                  disabled={loading || !newOwner}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Transfer Ownership
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {account && !isOwner && (
          <div className="text-center p-12">
            <p className="text-xl text-zinc-400">
              You are connected but not the owner. Please connect with the owner account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;