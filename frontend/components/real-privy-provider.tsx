'use client'

import React from 'react'
import { PrivyProvider } from '@privy-io/react-auth'

interface PrivyClientProviderProps {
  children: React.ReactNode
}

export function RealPrivyProvider({ children }: PrivyClientProviderProps) {
  return (
    <PrivyProvider
      appId="cmjslk54v00tlk00d3ntez04k" // Your actual Privy App ID
      config={{
        // Appearance configuration
        appearance: {
          theme: 'dark',
          accentColor: '#FFC700', // Your Payperdo primary color
          logo: '/logo.png',
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
        
        // Additional chains (Movement blockchain)
        supportedChains: [
          // Default to Ethereum mainnet for now, Movement testnet will be added later
          {
            id: 1,
            name: 'Ethereum',
            network: 'ethereum',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: {
              default: { http: ['https://eth.llamarpc.com'] }
            },
            blockExplorers: {
              default: { name: 'Etherscan', url: 'https://etherscan.io' }
            }
          }
        ],
      }}
    >
      {children}
    </PrivyProvider>
  )
}