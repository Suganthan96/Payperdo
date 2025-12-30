'use client'

import { usePrivy } from '@privy-io/react-auth'
import { ConsumerNav } from '@/components/consumer-nav'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Earning() {
  const { authenticated, user } = usePrivy()
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string>('')

  useEffect(() => {
    // Get wallet address from Privy user's embedded wallet
    if (user?.wallet) {
      setWalletAddress(user.wallet.address)
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push('/')
    }
  }, [authenticated, router])

  const earningHistory = [
    { id: 1, task: "Photo at Starbucks", amount: "10 MOV", status: "Completed", date: "Dec 30, 2025", txHash: "0x742...abc" },
    { id: 2, task: "McDonald's Check-in", amount: "5 MOV", status: "Pending", date: "Dec 30, 2025", txHash: "0x8ba...def" },
    { id: 3, task: "Coffee Post", amount: "15 MOV", status: "Completed", date: "Dec 29, 2025", txHash: "0x9cd...ghi" },
    { id: 4, task: "Gym Selfie", amount: "12 MOV", status: "Completed", date: "Dec 29, 2025", txHash: "0xabc...jkl" },
  ]

  const totalEarned = earningHistory.reduce((sum, item) => {
    if (item.status === 'Completed') {
      return sum + parseInt(item.amount.split(' ')[0])
    }
    return sum
  }, 0)

  const pendingEarnings = earningHistory.reduce((sum, item) => {
    if (item.status === 'Pending') {
      return sum + parseInt(item.amount.split(' ')[0])
    }
    return sum
  }, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ConsumerNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              💰 Your Earnings
            </h1>
            <p className="text-xl text-foreground/60">
              Track your MOV token earnings from completed tasks.
            </p>
          </div>

          {/* Wallet Info */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Wallet Address:</p>
              <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{walletAddress || 'Loading...'}</p>
            </div>
          </div>

          {/* Earnings Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-green-400">{totalEarned} MOV</h3>
              <p className="text-gray-400">Total Earned</p>
              <p className="text-xs text-gray-500 mt-1">≈ ${(totalEarned * 0.05).toFixed(2)} USD</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-yellow-400">{pendingEarnings} MOV</h3>
              <p className="text-gray-400">Pending</p>
              <p className="text-xs text-gray-500 mt-1">≈ ${(pendingEarnings * 0.05).toFixed(2)} USD</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-blue-400">{earningHistory.length}</h3>
              <p className="text-gray-400">Tasks Completed</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
          </div>

          {/* Recent Earnings Chart Placeholder */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Earnings Trend (Last 7 Days)</h2>
            <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">📈 Chart coming soon - Connect to Movement RPC to show real earnings</p>
            </div>
          </div>

          {/* Earning History */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold">Recent Earnings</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {earningHistory.map((earning) => (
                <div key={earning.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{earning.task}</h3>
                    <p className="text-sm text-gray-400">{earning.date}</p>
                    <p className="text-xs font-mono text-gray-500">{earning.txHash}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-yellow-400">{earning.amount}</p>
                      <p className="text-xs text-gray-400">≈ ${(parseInt(earning.amount.split(' ')[0]) * 0.05).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        earning.status === 'Completed' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {earning.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawal Section */}
          <div className="bg-gray-900 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Withdraw Earnings</h2>
            <p className="text-gray-400 mb-4">
              Your MOV tokens are automatically deposited to your embedded wallet. You can withdraw them to external wallets or exchange them.
            </p>
            <div className="flex gap-4">
              <button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-6 py-3 rounded-md transition-colors">
                Withdraw to External Wallet
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-md transition-colors">
                Exchange MOV Tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
