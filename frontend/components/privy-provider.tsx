'use client'

import React from 'react'
import { PrivyProvider } from '@privy-io/react-auth'

interface PrivyClientProviderProps {
  children: React.ReactNode
}

export function PrivyClientProvider({ children }: PrivyClientProviderProps) {
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
          termsAndConditionsUrl: 'https://payperdo.com/terms',
          privacyPolicyUrl: 'https://payperdo.com/privacy',
        },
        
        // Movement Network Configuration (Chain ID: 250)
        supportedChains: [
          {
            id: 250,
            name: 'Movement Testnet',
            network: 'movement-testnet',
            nativeCurrency: { 
              name: 'Movement', 
              symbol: 'MOV', 
              decimals: 8 
            },
            rpcUrls: {
              default: { http: ['https://testnet.movementnetwork.xyz/v1'] }
            },
            blockExplorers: {
              default: { 
                name: 'Movement Explorer', 
                url: 'https://explorer.movementnetwork.xyz/?network=bardock+testnet' 
              }
            },
            testnet: true
          }
        ],
      }}
    >
      {children}
    </PrivyProvider>
  )
}