# MezoPay Deployment Guide

## 🚀 Quick Start for Hackathon Demo

### Prerequisites
- Node.js 18+ installed
- MetaMask or compatible wallet
- Testnet BTC on Mezo Testnet

### 1. Environment Setup

1. **Get WalletConnect Project ID**:
   - Go to https://cloud.walletconnect.com/
   - Create a new project
   - Copy the Project ID

2. **Get Mezo Testnet BTC**:
   - Join Mezo Discord: https://discord.com/invite/mezo
   - Request testnet BTC in the faucet channel
   - Or use: https://faucet.test.mezo.org/

3. **Configure Environment**:
   ```bash
   cp .env.local .env.local.backup
   ```
   
   Update `.env.local`:
   ```env
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_actual_project_id
   PRIVATE_KEY=your_wallet_private_key_for_deployment
   ```

### 2. Installation & Deployment

```bash
# Install dependencies
npm install

# Compile smart contracts
npm run compile

# Deploy to Mezo Testnet
npm run deploy
```

**Important**: Copy the deployed contract address and update `.env.local`:
```env
NEXT_PUBLIC_MEZOPAY_CONTRACT=0xYourDeployedContractAddress
```

### 3. Run the Application

```bash
npm run dev
```

Open http://localhost:3000

## 🎯 Demo Flow

### For Hackathon Judges:

1. **Connect Wallet** (30 seconds)
   - Click "Connect Wallet"
   - Select MetaMask
   - Switch to Mezo Testnet (Chain ID: 31611)

2. **Deposit Collateral** (1 minute)
   - Click "Add Collateral"
   - Enter BTC amount (e.g., 0.001 BTC)
   - Confirm transaction
   - Wait for confirmation

3. **Mint MUSD** (1 minute)
   - Click "Mint MUSD"
   - Enter amount (up to 66% of collateral value)
   - Confirm transaction
   - Virtual card automatically created

4. **View Virtual Card** (30 seconds)
   - Card details appear on dashboard
   - Show/hide card information
   - Demonstrate freeze/unfreeze functionality

5. **Monitor Health** (30 seconds)
   - Show real-time collateral ratio
   - Explain liquidation threshold (110%)
   - Demonstrate risk warnings

## 🔧 Troubleshooting

### Common Issues:

1. **"Contract not deployed" error**:
   - Make sure you ran `npm run deploy`
   - Update `NEXT_PUBLIC_MEZOPAY_CONTRACT` in `.env.local`

2. **"Insufficient funds" error**:
   - Get more testnet BTC from Discord faucet
   - Check wallet is connected to Mezo Testnet

3. **Transaction fails**:
   - Check gas fees (should be very low on Mezo)
   - Ensure wallet has enough BTC for gas

4. **Wrong network**:
   - MetaMask should show "Mezo Testnet"
   - Chain ID should be 31611
   - RPC: https://rpc.test.mezo.org

### Network Configuration:

If MetaMask doesn't auto-detect Mezo Testnet:

```
Network Name: Mezo Testnet
RPC URL: https://rpc.test.mezo.org
Chain ID: 31611
Currency Symbol: BTC
Block Explorer: https://explorer.test.mezo.org
```

## 📊 Key Metrics to Highlight

- **Collateral Ratio**: Real-time calculation from blockchain
- **Interest Rate**: Fixed 1% APR
- **Liquidation Threshold**: 110% (industry standard: 150%)
- **Available Credit**: Dynamic based on collateral value
- **Transaction Speed**: ~2-3 seconds on Mezo
- **Gas Costs**: Extremely low (fractions of a cent)

## 🎪 Demo Script

**"Let me show you MezoPay - the first Bitcoin-backed credit card system."**

1. **Problem**: "Bitcoin holders can't spend their BTC without selling it"

2. **Solution**: "MezoPay lets you use Bitcoin as collateral to get instant credit"

3. **Demo**: 
   - "I'll deposit 0.001 BTC as collateral"
   - "This gives me $20 worth of MUSD credit at just 1% APR"
   - "Now I have a virtual credit card to spend anywhere"
   - "My Bitcoin stays mine and can still appreciate"

4. **Technical**: "Everything runs on Mezo's Bitcoin Layer 2 with real smart contracts"

5. **Business**: "Revenue from interchange fees, just like traditional credit cards"

## 🏆 Hackathon Categories

- ✅ **DeFi**: Bitcoin-backed lending protocol
- ✅ **Mass Adoption**: Familiar credit card UX  
- ✅ **Daily Use**: Spend crypto anywhere cards accepted

## 📱 Mobile Demo

The app is fully responsive and works great on mobile for live demos!