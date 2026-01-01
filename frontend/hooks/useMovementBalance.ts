"use client";

import { useState, useEffect } from "react";

interface MovementBalanceData {
  balance: string;
  loading: boolean;
  error: string | null;
}

export const useMovementBalance = (walletAddress: string): MovementBalanceData => {
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setBalance("0");
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);

      try {
        // Convert Ethereum-style address to Move/Aptos format (32 bytes)
        const convertToMoveAddress = (ethAddress: string): string => {
          // Remove 0x prefix
          const cleanAddress = ethAddress.startsWith('0x') ? ethAddress.slice(2) : ethAddress;
          // Pad with leading zeros to make it 64 characters (32 bytes)
          const paddedAddress = cleanAddress.padStart(64, '0');
          return '0x' + paddedAddress;
        };

        const moveAddress = convertToMoveAddress(walletAddress);
        console.log('Fetching MOV balance for:', walletAddress, '->', moveAddress);

        // Movement testnet RPC endpoint for MOV balance
        const balanceUrl = `https://testnet.movementnetwork.xyz/v1/accounts/${moveAddress}/resource/0x1::coin::CoinStore%3C0x1::aptos_coin::AptosCoin%3E`;
        console.log('Balance URL:', balanceUrl);
        
        const response = await fetch(balanceUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log('Balance response status:', response.status);

        if (!response.ok) {
          if (response.status === 404) {
            // Account not found or no balance - this is normal for new Privy wallets
            console.log('Account not found on Movement testnet (normal for new wallets)');
            setBalance("0.0000");
            return;
          }
          throw new Error(`Failed to fetch balance: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Balance data received:', data);
        
        // Extract balance from the coin store data
        const rawBalance = data?.data?.coin?.value || "0";
        console.log('Raw balance (octas):', rawBalance);
        
        // Convert from octas to MOV (1 MOV = 100,000,000 octas)
        const movBalance = (parseInt(rawBalance) / 100000000).toFixed(4);
        console.log('Converted MOV balance:', movBalance);
        
        setBalance(movBalance);
      } catch (err) {
        console.error("Error fetching MOV balance:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setBalance("0");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    
    return () => clearInterval(interval);
  }, [walletAddress]);

  return { balance, loading, error };
};