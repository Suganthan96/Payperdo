// MOV Token Balance Checker
// Add this to your dashboard to show real MOV balance

import { useState, useEffect } from 'react'

interface MovBalanceProps {
  walletAddress: string
}

export function MovTokenBalance({ walletAddress }: MovBalanceProps) {
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)

  const checkMovBalance = async () => {
    if (!walletAddress || walletAddress.includes('mock')) {
      setBalance('Mock address - no real balance')
      return
    }

    setLoading(true)
    try {
      // TODO: Replace with actual Movement blockchain RPC call
      // const response = await fetch(`https://movement-rpc-url/balance/${walletAddress}`)
      // const data = await response.json()
      // setBalance(data.balance || '0')
      
      // For now, show placeholder
      setBalance('Connect to Movement RPC to check balance')
    } catch (error) {
      console.error('Error checking MOV balance:', error)
      setBalance('Error loading balance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkMovBalance()
  }, [walletAddress])

  return (
    <div className="bg-border/10 p-4 rounded-lg border">
      <h3 className="font-bold mb-2">💰 MOV Token Balance</h3>
      <div className="text-2xl font-bold text-primary">
        {loading ? 'Loading...' : balance}
      </div>
      <p className="text-sm text-foreground/70 mt-1">
        Movement blockchain tokens
      </p>
      <button 
        onClick={checkMovBalance}
        className="mt-2 text-sm bg-primary/10 px-3 py-1 rounded border border-primary/20"
      >
        Refresh Balance
      </button>
    </div>
  )
}