"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Settings, Plus, Edit3, TrendingUp } from 'lucide-react';
import abi from "@/utils/abi"

export const CONTRACT_ADDRESS = "0xae55C3E2727259b688aE03c23d7cE2D559De7102";

interface Pool {
  stakedToken: string;
  rewardToken: string;
  totalStaked: string;
  APY: string;
  lockDays: string;
}

const Admin = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [poolCount, setPoolCount] = useState<number>(0);
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
      const { ethereum } = window as any;
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

  const handleAddPool = async (e: React.FormEvent) => {
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

  const handleModifyPool = async (e: React.FormEvent) => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add New Pool */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="w-6 h-6 text-[#f86522]" />
                <h2 className="text-xl font-semibold">Add New Pool</h2>
              </div>
              <form onSubmit={handleAddPool} className="space-y-4">
                <input
                  type="text"
                  placeholder="Staked Token Address"
                  value={newPool.stakedToken}
                  onChange={(e) => setNewPool({...newPool, stakedToken: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Reward Token Address"
                  value={newPool.rewardToken}
                  onChange={(e) => setNewPool({...newPool, rewardToken: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="APY"
                  value={newPool.APY}
                  onChange={(e) => setNewPool({...newPool, APY: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Lock Days"
                  value={newPool.lockDays}
                  onChange={(e) => setNewPool({...newPool, lockDays: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-[#f86522] hover:bg-[#e54500] text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Add Pool
                </button>
              </form>
            </div>

            {/* Modify Pool */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-6 h-6 text-[#f86522]" />
                <h2 className="text-xl font-semibold">Modify Pool</h2>
              </div>
              <form onSubmit={handleModifyPool} className="space-y-4">
                <input
                  type="number"
                  placeholder="Pool ID"
                  value={modifyPool.pid}
                  onChange={(e) => setModifyPool({...modifyPool, pid: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="New APY"
                  value={modifyPool.newAPY}
                  onChange={(e) => setModifyPool({...modifyPool, newAPY: e.target.value})}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-[#ffa02f] hover:bg-[#f86522] text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Modify Pool
                </button>
              </form>
            </div>
          </div>

          {/* Pool List */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-[#f86522]" />
              <h2 className="text-xl font-semibold">Active Pools</h2>
            </div>
            {loading ? (
              <p className="text-center text-gray-600">Loading pools...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staked Token</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Token</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Staked</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lock Days</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pools.map((pool, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{index}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pool.stakedToken}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pool.rewardToken}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pool.totalStaked}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pool.APY}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pool.lockDays} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;