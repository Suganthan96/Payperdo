'use client'

import { usePrivy, useLogin, useLogout, useCreateWallet } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

export interface WalletCreationResult {
  success: boolean
  wallet?: any
  user?: any
  error?: string
}

export function usePayperdoWallet() {
  const { login } = useLogin()
  const { logout } = useLogout()
  const { createWallet } = useCreateWallet()
  
  const { user, authenticated, ready } = usePrivy()
  const router = useRouter()

  const createConsumerWallet = async (): Promise<WalletCreationResult> => {
    try {
      console.log('🚀 Starting consumer wallet creation flow...')
      console.log('📊 Current state:', { authenticated, user: !!user, wallet: !!user?.wallet?.address })
      
      // If not authenticated, show login modal
      if (!authenticated) {
        console.log('🔐 Showing Privy login modal...')
        login()
        return { success: false, error: 'Please complete authentication first' }
      }

      // If authenticated but no wallet, create one
      if (!user?.wallet?.address) {
        console.log('💰 Creating embedded wallet...')
        createWallet()
        return { success: false, error: 'Creating wallet...' }
      }
      
      // User has wallet, proceed with redirect
      const walletAddress = user.wallet.address
      console.log('✅ Consumer wallet ready:', walletAddress)
      
      localStorage.setItem('payperdo_user_type', 'consumer')
      localStorage.setItem('payperdo_wallet_address', walletAddress)
      
      router.push('/consumer/dashboard')
      
      return { 
        success: true, 
        wallet: { address: walletAddress }, 
        user 
      }
      
    } catch (error) {
      console.error('Consumer wallet creation failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  const createBusinessWallet = async (): Promise<WalletCreationResult> => {
    try {
      console.log('🚀 Starting business wallet creation flow...')
      console.log('📊 Current state:', { authenticated, user: !!user, wallet: !!user?.wallet?.address })
      
      // If not authenticated, show login modal
      if (!authenticated) {
        console.log('🔐 Showing Privy login modal...')
        login()
        return { success: false, error: 'Please complete authentication first' }
      }

      // If authenticated but no wallet, create one
      if (!user?.wallet?.address) {
        console.log('💰 Creating embedded wallet...')
        createWallet()
        return { success: false, error: 'Creating wallet...' }
      }
      
      // User has wallet, proceed with redirect
      const walletAddress = user.wallet.address
      console.log('✅ Business wallet ready:', walletAddress)
      
      localStorage.setItem('payperdo_user_type', 'business')
      localStorage.setItem('payperdo_wallet_address', walletAddress)
      
      router.push('/business/dashboard')
      
      return { 
        success: true, 
        wallet: { address: walletAddress }, 
        user 
      }
      
    } catch (error) {
      console.error('Business wallet creation failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  const clearUserData = () => {
    localStorage.removeItem('payperdo_user_type')
    localStorage.removeItem('payperdo_wallet_address')
    console.log('🧹 Cleared user data from localStorage')
  }

  return {
    createConsumerWallet,
    createBusinessWallet,
    logout,
    clearUserData,
    user,
    authenticated,
    ready,
    // Helper functions
    isConsumer: () => localStorage.getItem('payperdo_user_type') === 'consumer',
    isBusiness: () => localStorage.getItem('payperdo_user_type') === 'business',
    getWalletAddress: () => localStorage.getItem('payperdo_wallet_address'),
  }
}