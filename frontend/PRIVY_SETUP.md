# Payperdo - Privy Integration Setup

## 🚀 Privy Embedded Wallets Integration

This project integrates Privy's embedded wallets for seamless Web 2.5 user onboarding in the Payperdo micro-task marketplace.

## 📋 Setup Instructions

### 1. Install Privy SDK
The `@privy-io/react-auth` package has been added to package.json. Install it:

```bash
npm install
# or
pnpm install
```

### 2. Get Your Privy App ID
1. Visit [https://dashboard.privy.io](https://dashboard.privy.io)
2. Create a new app or use existing one
3. Copy your App ID from the dashboard
4. Replace `YOUR_PRIVY_APP_ID` in `components/privy-provider.tsx` with your actual App ID

### 3. Configure Environment Variables
Create a `.env.local` file:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_actual_privy_app_id_here
```

Update `components/privy-provider.tsx` to use the environment variable:

```tsx
appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
```

### 4. Test the Integration
1. Run the development server: `npm run dev`
2. Click "For Consumers" or "For Business" buttons
3. Complete Google sign-in flow
4. Embedded wallet will be created automatically
5. User gets redirected to appropriate dashboard

## 🏗️ Architecture

### Components Created:
- `components/privy-provider.tsx` - Privy configuration wrapper
- `hooks/usePayperdoWallet.ts` - Custom hook for wallet creation
- `app/consumer/dashboard/page.tsx` - Consumer dashboard
- `app/business/dashboard/page.tsx` - Business dashboard

### User Flow:
1. **Click Button** → "For Consumers" or "For Business"
2. **Authentication** → Google sign-in via Privy (if not authenticated)
3. **Wallet Creation** → Embedded wallet created automatically
4. **User Type Storage** → Consumer/Business type stored in localStorage
5. **Redirect** → Appropriate dashboard based on user type

### Features Implemented:
- ✅ One-click wallet creation
- ✅ Google OAuth integration
- ✅ Automatic user type detection
- ✅ Web 2.5 UX (no crypto knowledge required)
- ✅ Dashboard routing
- ✅ Wallet address storage
- ✅ Loading states and error handling

## 🎯 Payperdo User Experience

### For Consumers:
1. Click "For Consumers" → Sign in with Google → Wallet created → Dashboard
2. See available tasks, earnings, and wallet info
3. Ready to complete tasks and earn money instantly

### For Businesses:
1. Click "For Business" → Sign in with Google → Wallet created → Dashboard  
2. See campaign stats, task creation options, and ROI calculator
3. Ready to create tasks and get authentic customer engagement

## 🔧 Next Steps

After setup, you can:
1. Add Movement chain configuration to Privy
2. Implement x402 payment rails integration
3. Build task creation and completion flows
4. Add AI verification system
5. Create smart contracts for task escrow

## 🎪 Demo Flow

Perfect for hackathon demo:
1. **Home Page** → Clean Payperdo landing
2. **Click Button** → Choose Consumer or Business
3. **Google Sign-in** → 2-second authentication 
4. **Wallet Created** → Embedded wallet appears
5. **Dashboard** → User-specific interface
6. **"Magic Moment"** → From click to wallet in ~10 seconds

This showcases Privy's seamless Web 2.5 onboarding perfectly for the hackathon judges!