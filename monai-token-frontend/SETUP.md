# MonaiToken Frontend Setup Guide

## ✅ Files Already Created

All the necessary files have been created for you:

1. **`app/providers.tsx`** - Wagmi & QueryClient setup with Monad Testnet configuration
2. **`app/layout.tsx`** - Updated with Providers wrapper
3. **`app/page.tsx`** - Full dashboard with wallet connection and token interactions

## 🚀 How to Run

### 1. Install Dependencies (if not already done)
```bash
cd "c:\Projects\Blockchain Projects\monad token\monai-token-frontend"
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: http://localhost:3000

## 🦊 MetaMask Setup for Monad Testnet

Before you can connect your wallet, you need to add Monad Testnet to MetaMask:

### Add Monad Testnet Manually:
1. Open MetaMask
2. Click the network dropdown (top left)
3. Click "Add Network" or "Add a network manually"
4. Enter these details:

```
Network Name: Monad Testnet
RPC URL: https://testnet-rpc.monad.xyz
Chain ID: 10143
Currency Symbol: MON
Block Explorer URL: https://testnet.monadexplorer.com
```

5. Click "Save"
6. Switch to Monad Testnet network

## 📝 Features

### For All Users:
- ✅ Connect/Disconnect wallet
- ✅ View MONAI token balance
- ✅ View native MON balance
- ✅ Transfer MONAI tokens to any address

### For Minters Only:
- ✅ Mint new MONAI tokens to any address
- 🔒 Section only appears if your wallet has minter role

### For Admins Only:
- ✅ Pause the contract (stops all transfers/mints)
- ✅ Unpause the contract
- 🔒 Section only appears if your wallet has admin role

## 🎯 Contract Details

- **Contract Address:** `0xeD1EDCC815317a56370a436E055AfABddB2D6488`
- **Network:** Monad Testnet (Chain ID: 10143)
- **Token Name:** MonaiToken (MONAI)

## 🔑 Testing Different Roles

The UI will automatically show/hide sections based on your wallet's roles:

1. **Deploy wallet** - Has Owner, Admin, and Minter roles
2. **Regular wallet** - Only sees transfer functionality
3. **Minter wallet** - Sees transfer + mint section
4. **Admin wallet** - Sees transfer + pause/unpause section

To test, connect different wallets or use the contract's `addMinter()` and `addAdmin()` functions.

## 🛠️ Troubleshooting

### "Cannot find module" errors
Run: `npm install`

### Wallet won't connect
- Make sure MetaMask is installed
- Make sure you're on Monad Testnet network
- Refresh the page

### Transaction fails
- Check you have enough MON for gas
- Check the contract isn't paused
- Check you have the required role (for mint/pause operations)

## 📦 Tech Stack

- Next.js 14 (App Router)
- Wagmi v2 (wallet connection)
- Viem v2 (Ethereum interactions)
- TanStack Query (data fetching)
- Tailwind CSS (styling)
