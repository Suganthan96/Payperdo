'use client'

import React from 'react'
// TODO: Uncomment when you install: npm install @privy-io/react-auth
// import { PrivyProvider } from '@privy-io/react-auth'

interface PrivyClientProviderProps {
  children: React.ReactNode
}

export function PrivyClientProvider({ children }: PrivyClientProviderProps) {
  // Temporary wrapper - replace with PrivyProvider after installing package
  return (
    <>
      {children}
    </>
  )
  
  /* 
  // Uncomment this after running: npm install @privy-io/react-auth
  return (
    <PrivyProvider
      appId="cmjslk54v00tlk00d3ntez04k" // Your actual Privy App ID
      config={{
        // Appearance configuration
        appearance: {
          theme: 'dark',
          accentColor: '#FFC700', // Your Payperdo primary color
          logo: '/logo.png', // You can add your Payperdo logo here
        },
        
        // Login methods - Google sign-in for Web 2.5 UX
        loginMethods: ['email', 'google', 'apple'],
        
        // Embedded wallets configuration
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Auto-create wallets for new users
          requireUserPasswordOnCreate: false, // Seamless UX - no password required
        },
        
        // Legal configuration
        legal: {
          terms: 'https://payperdo.com/terms',
          privacy: 'https://payperdo.com/privacy',
        },
        
        // Additional chains (you'll add Movement chain here later)
        supportedChains: [
          // Will add Movement testnet configuration here
        ],
      }}
    >
      {children}
    </PrivyProvider>
  )
  */
}