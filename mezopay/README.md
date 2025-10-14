# MezoPay - Bitcoin Credit Card

A decentralized credit card system that allows users to spend their Bitcoin anywhere by using it as collateral to mint MUSD stablecoin.

## 🚀 Features

- **Bitcoin Collateral**: Deposit Bitcoin as collateral to secure credit lines
- **MUSD Minting**: Mint MUSD stablecoin up to 66% of collateral value at 1% APR
- **Virtual Credit Card**: Get a virtual card to spend MUSD anywhere cards are accepted
- **Real-time Monitoring**: Track collateral health and liquidation risk
- **Mezo Integration**: Built on Mezo testnet with native MUSD support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Mezo Testnet, Ethereum Sepolia
- **Web3**: Wagmi, Viem, RainbowKit
- **Smart Contracts**: Solidity (to be deployed)
- **Card System**: Stripe Issuing API (demo)

## 🏗️ Project Structure

```
mezopay/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Web3 providers
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── LandingPage.tsx    # Landing page
│   ├── VirtualCard.tsx    # Virtual card display
│   ├── CollateralHealth.tsx # Health indicator
│   ├── TransactionHistory.tsx # Transaction list
│   ├── DepositModal.tsx   # Deposit BTC modal
│   └── MintModal.tsx      # Mint MUSD modal
├── lib/                   # Utilities
│   └── wagmi.ts          # Wagmi configuration
└── contracts/            # Smart contracts (to be added)
```

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   cd mezopay
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.local` and fill in your values
   - Get a WalletConnect Project ID from https://cloud.walletconnect.com/
   - Add your private key for contract deployment

3. **Compile and deploy smart contracts**:
   ```bash
   npm run compile
   npm run deploy
   ```

4. **Update contract address**:
   - Copy the deployed contract address to `.env.local`
   - Update `NEXT_PUBLIC_MEZOPAY_CONTRACT`

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to http://localhost:3000

## 🔗 Mezo Integration

This project integrates with Mezo's testnet:

- **Network**: Mezo Testnet (Chain ID: 686868)
- **RPC**: https://testnet-rpc.mezo.org
- **Explorer**: https://testnet-explorer.mezo.org
- **MUSD**: Native stablecoin on Mezo

## 📱 Demo Flow

1. **Connect Wallet**: Connect your Web3 wallet
2. **Deposit Collateral**: Add Bitcoin as collateral
3. **Mint MUSD**: Borrow MUSD against your collateral
4. **Get Virtual Card**: Receive card details for spending
5. **Monitor Health**: Track collateral ratio and liquidation risk

## 🎯 Hackathon Categories

- **DeFi**: Bitcoin-backed lending with MUSD
- **Mass Adoption**: Familiar credit card UX
- **Daily Use**: Spend crypto anywhere cards are accepted

## ✅ On-Chain Features

- ✅ **Smart Contracts**: Deployed on Mezo Testnet
- ✅ **Real BTC Collateral**: Deposit actual testnet BTC
- ✅ **MUSD Integration**: Mint real MUSD tokens
- ✅ **Virtual Cards**: Generated on-chain with spending limits
- ✅ **Liquidation System**: Automated liquidation at 110% ratio
- ✅ **Interest Accrual**: Real-time 1% APR calculation

## 🔮 Future Roadmap

- [ ] Integrate real Stripe card issuing
- [ ] Add mobile app with NFC payments
- [ ] Implement yield farming for auto-repayment
- [ ] Add Bitcoin cashback rewards
- [ ] Mainnet deployment
- [ ] Multi-collateral support

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built for the Mezo Hackathon 🚀