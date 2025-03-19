"use client"
import { createContext, useContext, useEffect, useState } from "react";
import {CONTRACT_ADDRESS} from "@/utils/constants";
import abi from "@/utils/abi";
import { ethers } from "ethers";

export const CoroTashiContext = createContext();

export function CoroTashiProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
   
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    // Initialize provider and contract
   // In CoroTashiProvider.jsx
useEffect(() => {
    // Initialize provider if ethereum is available
    if (typeof window.ethereum !== "undefined") {
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      setProvider(providerInstance);
      
      // Check if already connected
      providerInstance.send("eth_accounts", [])
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            // Initialize contract with connected account
            providerInstance.getSigner().then(signer => {
              const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
              setContract(contractInstance);
            });
          }
        })
        .catch(err => console.error("Error checking accounts:", err));
        
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });
    }
    
    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  async function shortenAddress(address) {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

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
  
    // Connect to MetaMask and retrieve account info
    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
            try {
                console.log("Connecting to wallet...");
                setLoading(true);
                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                setProvider(providerInstance);
    
                const signer = await providerInstance.getSigner(); // Get user signer
                const accounts = await providerInstance.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
                console.log(account)
    
                const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
                setContract(contractInstance);
    
                setIsConnected(true);
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
                setError("Error connecting to wallet.");
            } finally {
                setLoading(false);
            }
        } else {
            alert("MetaMask is required to use this app.");
            window.open("https://metamask.io/download.html", "_blank");
        }
    }
   
    
  
   
  
   
    
    
  
    const value = {
      connectWallet,
      account,
      isConnected, 
      shortenAddress
      
      
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