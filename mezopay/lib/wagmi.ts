import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

// Mezo Testnet configuration (correct chain ID and RPC)
const mezoTestnet = {
  id: 31611,
  name: 'Mezo Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Bitcoin',
    symbol: 'BTC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test.mezo.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Mezo Explorer', url: 'https://explorer.test.mezo.org' },
  },
  testnet: true,
} as const

export const config = getDefaultConfig({
  appName: 'MezoPay',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
  chains: [mezoTestnet, sepolia],
  ssr: true,
})

// Contract addresses
export const CONTRACTS = {
  MEZOPAY: process.env.NEXT_PUBLIC_MEZOPAY_CONTRACT || '',
  MUSD: '0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503',
} as const