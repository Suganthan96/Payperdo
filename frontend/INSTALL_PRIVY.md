# 🔧 Install Privy SDK

## Current Status: Mock Implementation
The app is currently using mock wallet creation functions. To enable real Privy embedded wallets:

## Step 1: Install Privy Package
```bash
cd frontend
npm install @privy-io/react-auth
```

## Step 2: Uncomment Real Implementation
After installing the package, update these files:

### `components/privy-provider.tsx`
- Uncomment the `import { PrivyProvider } from '@privy-io/react-auth'` line
- Uncomment the `<PrivyProvider>` component and its configuration
- Remove the temporary `<div>` wrapper

### `hooks/usePayperdoWallet.ts`
- Uncomment the Privy imports
- Uncomment the real hook implementations
- Comment out or remove the mock functions

## Step 3: Get Privy App ID
1. Visit [https://dashboard.privy.io](https://dashboard.privy.io)
2. Create a new app
3. Copy your App ID
4. Replace `YOUR_PRIVY_APP_ID` in `privy-provider.tsx`

## Step 4: Test the Flow
1. Start the dev server: `npm run dev`
2. Click "For Consumers" or "For Business"
3. Complete Google sign-in
4. See real embedded wallet creation!

## Current Mock Behavior
Until you install Privy, the buttons will:
- Generate a random mock wallet address
- Store user type in localStorage
- Redirect to the appropriate dashboard
- Show mock wallet info in dashboard

This allows you to test the UI flow while setting up Privy!