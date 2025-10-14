'use client'

import { useState, useEffect } from 'react'
import { X, Bitcoin } from 'lucide-react'
import { useMezoPay } from '@/hooks/useMezoPay'
import { TransactionStatus } from './TransactionStatus'

interface DepositModalProps {
  onClose: () => void
}

export function DepositModal({ onClose }: DepositModalProps) {
  const { depositCollateral, isPending, isConfirmed, hash, creditLine } = useMezoPay()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const btcPrice = 30000 // Mock BTC price
  const usdValue = parseFloat(amount) * btcPrice || 0
  const currentCollateral = parseFloat(creditLine?.collateralAmount || '0')

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    
    try {
      setError('')
      await depositCollateral(amount)
    } catch (error) {
      console.error('Deposit failed:', error)
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add Bitcoin Collateral</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (BTC)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-bitcoin focus:border-transparent placeholder-gray-400"
                step="0.001"
                min="0"
              />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <Bitcoin className="w-5 h-5 text-bitcoin" />
                <span className="text-sm font-medium text-gray-300">BTC</span>
              </div>
            </div>
            {usdValue > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                ≈ ${usdValue.toLocaleString()} USD
              </p>
            )}
          </div>

          <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-white">Collateral Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Current Collateral:</span>
                <span className="text-white">{currentCollateral.toFixed(4)} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">New Collateral:</span>
                <span className="text-white">{(currentCollateral + parseFloat(amount || '0')).toFixed(4)} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Additional Credit:</span>
                <span className="text-green-400">
                  +${(usdValue * 0.66).toLocaleString()} MUSD
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Status */}
          {(isPending || isConfirmed || error) && (
            <TransactionStatus 
              status={error ? 'error' : isConfirmed ? 'success' : isPending ? 'confirming' : 'pending'}
              hash={hash}
              message={error}
            />
          )}

          <div className="bg-blue-900/20 border border-blue-600/30 p-4 rounded-lg">
            <h3 className="font-medium text-blue-300 mb-1">How it works</h3>
            <p className="text-sm text-blue-200">
              Your Bitcoin will be held as collateral in a smart contract. 
              You can mint up to 66% of the collateral value in MUSD at 1% APR.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeposit}
              disabled={!amount || parseFloat(amount) <= 0 || isPending}
              className="flex-1 bg-bitcoin text-white px-4 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Processing...' : 'Deposit BTC'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}