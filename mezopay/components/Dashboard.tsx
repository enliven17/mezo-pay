'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { VirtualCard } from './VirtualCard'
import { CollateralHealth } from './CollateralHealth'
import { TransactionHistory } from './TransactionHistory'
import { DepositModal } from './DepositModal'
import { MintModal } from './MintModal'
import { RepayModal } from './RepayModal'
import { useMezoPay } from '@/hooks/useMezoPay'
import { useAccount } from 'wagmi'

export function Dashboard() {
  const { isConnected } = useAccount()
  const { creditLine, musdBalance, refetch } = useMezoPay()
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showMintModal, setShowMintModal] = useState(false)
  const [showRepayModal, setShowRepayModal] = useState(false)

  // Refetch data periodically
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refetch, 10000) // Refetch every 10 seconds
      return () => clearInterval(interval)
    }
  }, [isConnected, refetch])

  // Eğer wallet bağlı değilse, bağlantı ekranı göster
  if (!isConnected) {
    return (
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bitcoin-gradient rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Connect your wallet to start using MezoPay and get your Bitcoin-backed credit card.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  // Calculate values from blockchain data
  const collateralAmount = parseFloat(creditLine?.collateralAmount || '0')
  const collateralValue = collateralAmount * 30000 // BTC price from smart contract oracle
  const musdMinted = parseFloat(creditLine?.musdMinted || '0')
  const accruedInterest = parseFloat(creditLine?.accruedInterest || '0')
  const totalDebt = musdMinted + accruedInterest
  const availableCredit = parseFloat(creditLine?.availableCredit || '0')
  const collateralRatio = creditLine?.collateralRatio || 0
  const isActive = creditLine?.isActive || false

  // Health color logic moved to CollateralHealth component

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-2xl hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total Collateral</p>
              <p className="text-2xl font-bold text-white">{collateralAmount.toFixed(4)} BTC</p>
              <p className="text-sm text-gray-400">${collateralValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bitcoin-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold">₿</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-2xl hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">MUSD Minted</p>
              <p className="text-2xl font-bold text-white">${totalDebt.toLocaleString()}</p>
              <p className="text-sm text-gray-400">1% APR</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-2xl hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Available Credit</p>
              <p className="text-2xl font-bold text-white">${availableCredit.toLocaleString()}</p>
              <p className="text-sm text-green-400">{isActive ? 'Ready to spend' : 'Deposit collateral'}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-2xl hover:bg-gray-750 transition-colors">
          <CollateralHealth ratio={collateralRatio} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowDepositModal(true)}
          className="flex items-center space-x-2 bg-bitcoin text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Collateral</span>
        </button>
        
        <button
          onClick={() => setShowMintModal(true)}
          className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowUpRight className="w-5 h-5" />
          <span>Mint MUSD</span>
        </button>
        
        <button 
          onClick={() => setShowRepayModal(true)}
          disabled={totalDebt === 0}
          className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowDownLeft className="w-5 h-5" />
          <span>Repay Debt</span>
        </button>
      </div>

      {/* Liquidation Warning */}
      {collateralRatio > 0 && collateralRatio < 180 && (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="font-semibold text-yellow-300">Liquidation Risk Warning</p>
              <p className="text-yellow-200">
                Your collateral ratio is {collateralRatio}%. Add more collateral or repay debt to avoid liquidation at 110%.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Position Warning */}
      {!isActive && (
        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-semibold text-blue-300">Get Started</p>
              <p className="text-blue-200">
                Deposit Bitcoin as collateral to start borrowing MUSD and get your virtual credit card.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Virtual Card */}
        <div className="lg:col-span-1">
          <VirtualCard />
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <TransactionHistory />
        </div>
      </div>

      {/* Modals */}
      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
      
      {showMintModal && (
        <MintModal 
          onClose={() => setShowMintModal(false)}
          maxMintable={availableCredit}
          currentDebt={totalDebt}
          collateralValue={collateralValue}
        />
      )}
      
      {showRepayModal && (
        <RepayModal 
          onClose={() => setShowRepayModal(false)}
          currentDebt={totalDebt}
          musdBalance={musdBalance}
        />
      )}
    </div>
  )
}