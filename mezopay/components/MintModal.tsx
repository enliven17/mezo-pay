'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign } from 'lucide-react'
import { useMezoPay } from '@/hooks/useMezoPay'
import { TransactionStatus } from './TransactionStatus'

interface MintModalProps {
  onClose: () => void
  maxMintable: number
  currentDebt: number
  collateralValue: number
}

export function MintModal({ onClose, maxMintable, currentDebt, collateralValue }: MintModalProps) {
  const { mintMUSD, isPending, isConfirmed, hash } = useMezoPay()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const mintAmount = parseFloat(amount) || 0
  const newDebt = currentDebt + mintAmount
  const newCollateralRatio = newDebt > 0 ? (collateralValue / newDebt) * 100 : 0

  const handleMint = async () => {
    if (!amount || mintAmount <= 0 || mintAmount > maxMintable) return
    
    try {
      setError('')
      await mintMUSD(amount)
    } catch (error) {
      console.error('Mint failed:', error)
      setError(error instanceof Error ? error.message : 'Transaction failed')
    }
  }

  // Close modal when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      onClose()
    }
  }, [isConfirmed, onClose])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Mint MUSD</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (MUSD)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.01"
                min="0"
                max={maxMintable}
              />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">MUSD</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Maximum: ${maxMintable.toLocaleString()} MUSD
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Loan Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Debt:</span>
                <span>${currentDebt.toLocaleString()} MUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Debt:</span>
                <span>${newDebt.toLocaleString()} MUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate:</span>
                <span className="text-green-600">1% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Collateral Ratio:</span>
                <span className={newCollateralRatio >= 200 ? 'text-green-600' : 
                                newCollateralRatio >= 160 ? 'text-yellow-600' : 'text-red-600'}>
                  {newCollateralRatio.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {newCollateralRatio < 160 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-900 mb-1">⚠️ Liquidation Risk</h3>
              <p className="text-sm text-red-700">
                This amount would put your position at risk of liquidation. 
                Consider minting less or adding more collateral.
              </p>
            </div>
          )}

          {/* Transaction Status */}
          {(isPending || isConfirmed || error) && (
            <TransactionStatus 
              status={error ? 'error' : isConfirmed ? 'success' : isPending ? 'confirming' : 'pending'}
              hash={hash}
              message={error}
            />
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-1">About MUSD</h3>
            <p className="text-sm text-blue-700">
              MUSD is a stablecoin backed by Bitcoin collateral. 
              You can spend it using your MezoPay card anywhere cards are accepted.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMint}
              disabled={!amount || mintAmount <= 0 || mintAmount > maxMintable || newCollateralRatio < 150 || isPending}
              className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Minting...' : 'Mint MUSD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}