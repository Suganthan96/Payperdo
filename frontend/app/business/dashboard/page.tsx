'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { MovTokenBalance } from '@/components/mov-balance'
import { useEffect, useState } from 'react'

export default function BusinessDashboard() {
  const { user, authenticated, getAccessToken, logout } = usePrivy()
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              🏢 Business Dashboard
            </h1>
            <p className="text-xl text-foreground/70">
              Welcome to Payperdo! Create tasks and get authentic customer engagement.
            </p>
          </div>

          {/* Wallet Info */}
          <div className="bg-border/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Business Wallet</h2>
            <div className="space-y-2">
              <p><strong>Business ID:</strong> {user?.id || 'Loading...'}</p>
              <p><strong>Email:</strong> {user?.email?.address || 'Loading...'}</p>
              <p><strong>Wallet Address:</strong> {walletAddress || 'Creating...'}</p>
              <p><strong>Status:</strong> <span className="text-green-400">✅ Connected</span></p>
              <p><strong>Available Balance:</strong> <span className="text-primary font-bold">₹0</span></p>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-border/10 p-6 rounded-lg border">
              <h3 className="text-lg font-bold mb-2">📊 Active Campaigns</h3>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-foreground/70">Running tasks</p>
            </div>
            <div className="bg-border/10 p-6 rounded-lg border">
              <h3 className="text-lg font-bold mb-2">✅ Completions</h3>
              <div className="text-3xl font-bold text-green-400">0</div>
              <p className="text-sm text-foreground/70">Tasks completed</p>
            </div>
            <div className="bg-border/10 p-6 rounded-lg border">
              <h3 className="text-lg font-bold mb-2">💰 Total Spent</h3>
              <div className="text-3xl font-bold">₹0</div>
              <p className="text-sm text-foreground/70">On verified tasks</p>
            </div>
            <MovTokenBalance walletAddress={walletAddress || ''} />
          </div>

          {/* Quick Actions */}
          <div className="bg-border/10 p-6 rounded-lg border mb-8">
            <h3 className="text-xl font-bold mb-4">🚀 Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-primary/5 p-4 rounded border border-primary/20">
                <h4 className="font-bold mb-2">📱 Social Media Campaign</h4>
                <p className="text-sm text-foreground/70 mb-3">
                  Get customers to visit your store and post on Instagram
                </p>
                <Button onClick={() => alert('Task creation coming soon!')}>
                  Create Task
                </Button>
              </div>
              <div className="bg-primary/5 p-4 rounded border border-primary/20">
                <h4 className="font-bold mb-2">⭐ Product Reviews</h4>
                <p className="text-sm text-foreground/70 mb-3">
                  Get authentic reviews from real customers
                </p>
                <Button onClick={() => alert('Task creation coming soon!')}>
                  Create Task
                </Button>
              </div>
              <div className="bg-primary/5 p-4 rounded border border-primary/20">
                <h4 className="font-bold mb-2">🔍 Mystery Shopping</h4>
                <p className="text-sm text-foreground/70 mb-3">
                  Audit your customer service quality
                </p>
                <Button onClick={() => alert('Task creation coming soon!')}>
                  Create Task
                </Button>
              </div>
              <div className="bg-primary/5 p-4 rounded border border-primary/20">
                <h4 className="font-bold mb-2">📊 Market Research</h4>
                <p className="text-sm text-foreground/70 mb-3">
                  Get consumer insights and feedback
                </p>
                <Button onClick={() => alert('Task creation coming soon!')}>
                  Create Task
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => alert('Task builder coming soon!')}
            >
              ➕ Create New Task
            </Button>
            <Button 
              className="bg-transparent border-primary text-primary"
              onClick={() => alert('Analytics coming soon!')}
            >
              📈 View Analytics
            </Button>
            <Button 
              className="bg-transparent border-foreground/30 text-foreground"
              onClick={() => router.push('/')}
            >
              ← Back to Home
            </Button>
          </div>

          {/* ROI Calculator */}
          <div className="mt-12 bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="text-xl font-bold mb-3">💡 Payperdo ROI</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">Traditional Marketing:</h4>
                <ul className="space-y-1 text-sm text-foreground/80">
                  <li>• Instagram ads: ₹50,000/month</li>
                  <li>• Influencer posts: ₹20,000 each</li>
                  <li>• Market research: ₹5,00,000</li>
                  <li>• No guarantee of results</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">With Payperdo:</h4>
                <ul className="space-y-1 text-sm text-foreground/80">
                  <li>• Pay only for verified results</li>
                  <li>• ₹200-500 per authentic action</li>
                  <li>• Real customers, real engagement</li>
                  <li>• 70% cost savings vs agencies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}