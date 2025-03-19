"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Settings, Plus, Edit3, TrendingUp } from 'lucide-react';
import abi from "@/utils/abi"

export const CONTRACT_ADDRESS = "0xae55C3E2727259b688aE03c23d7cE2D559De7102";

const Admin = () => {
  const [pools, setPools] = useState([]);
  const [poolCount, setPoolCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newPool, setNewPool] = useState({
    stakedToken: '',
    rewardToken: '',
    APY: '',
    lockDays: ''
  });
  const [modifyPool, setModifyPool] = useState({
    pid: '',
    newAPY: ''
  });

  const connectContract = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      }
    } catch (error) {
      console.error("Error connecting to contract:", error);
    }
  };

  const fetchPools = async () => {
    try {
      const contract = await connectContract();
      if (!contract) return;

      const count = await contract.poolCount();
      setPoolCount(Number(count));

      const poolsData = [];
      for (let i = 0; i < count; i++) {
        const pool = await contract.poolInfo(i);
        poolsData.push({
          stakedToken: pool.stakedToken,
          rewardToken: pool.rewardToken,
          totalStaked: ethers.formatEther(pool.totalStaked),
          APY: pool.APY.toString(),
          lockDays: pool.lockDays.toString()
        });
      }
      setPools(poolsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pools:", error);
      setLoading(false);
    }
  };

  const handleAddPool = async (e) => {
    e.preventDefault();
    try {
      const contract = await connectContract();
      if (!contract) return;

      const tx = await contract.addPool(
        newPool.stakedToken,
        newPool.rewardToken,
        newPool.APY,
        newPool.lockDays
      );
      await tx.wait();
      fetchPools();
      setNewPool({ stakedToken: '', rewardToken: '', APY: '', lockDays: '' });
    } catch (error) {
      console.error("Error adding pool:", error);
    }
  };

  const handleModifyPool = async (e) => {
    e.preventDefault();
    try {
      const contract = await connectContract();
      if (!contract) return;

      const tx = await contract.modifyPool(
        modifyPool.pid,
        modifyPool.newAPY
      );
      await tx.wait();
      fetchPools();
      setModifyPool({ pid: '', newAPY: '' });
    } catch (error) {
      console.error("Error modifying pool:", error);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f86522] via-[#ffa02f] to-[#e54500] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-[#f86522]" />
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          {/* UI Code remains unchanged */}
        </div>
      </div>
    </div>
  );
};

export default Admin;
