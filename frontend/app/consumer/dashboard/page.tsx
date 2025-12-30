'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConsumerDashboard() {
  const { user, authenticated, logout } = usePrivy()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/20 rounded-full filter blur-2xl"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Top Navigation Glass Bar */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-white">Payperdo</h1>
              <nav className="flex space-x-4">
                <a href="/consumer/dashboard" className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-300 font-medium">Dashboard</a>
                <a href="/consumer/Tasks" className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/10 transition-all">Tasks</a>
                <a href="/consumer/Earning" className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/10 transition-all">Earnings</a>
              </nav>
            </div>
            <button onClick={logout} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome back! 🎉</h2>
                  <p className="text-white/70">Ready to earn some MOV tokens today?</p>
                </div>
                <div className="text-6xl">🚀</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm">Tasks Completed</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm">Total Earned</p>
                  <p className="text-2xl font-bold text-yellow-300">245 MOV</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/consumer/Tasks')}
                  className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-4 border border-white/10 hover:scale-105 transition-all"
                >
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-white font-medium">Browse Tasks</p>
                </button>
                <button 
                  onClick={() => router.push('/consumer/Earning')}
                  className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl p-4 border border-white/10 hover:scale-105 transition-all"
                >
                  <div className="text-2xl mb-2">💰</div>
                  <p className="text-white font-medium">View Earnings</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-300">✓</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Photo at Starbucks</p>
                      <p className="text-white/50 text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-yellow-300 font-bold">+10 MOV</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <span className="text-yellow-300">⏳</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">McDonald's Check-in</p>
                      <p className="text-white/50 text-sm">1 day ago</p>
                    </div>
                  </div>
                  <span className="text-white/50 font-bold">+5 MOV</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Your Wallet 💼</h3>
              <div className="space-y-4">
                <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-xs mb-1">Wallet Address</p>
                  <p className="text-white font-mono text-sm break-all">
                    {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Loading...'}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm">MOV Balance</p>
                  <p className="text-2xl font-bold text-yellow-300">245.5 MOV</p>
                  <p className="text-white/50 text-xs">≈ $12.28 USD</p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Your Stats 📊</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Success Rate</span>
                  <span className="text-green-300 font-bold">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Rank</span>
                  <span className="text-blue-300 font-bold">#127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">This Month</span>
                  <span className="text-yellow-300 font-bold">72 MOV</span>
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Latest Achievement 🏆</h3>
              <div className="text-center">
                <div className="text-4xl mb-2">🔥</div>
                <p className="text-white font-medium">Task Streak</p>
                <p className="text-white/70 text-sm">Completed 5 tasks in a row!</p>
                <div className="mt-3 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl p-2 border border-white/10">
                  <span className="text-orange-300 font-bold">+5 Bonus MOV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}