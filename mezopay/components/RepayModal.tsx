'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign } from 'lucide-react'
import { useMezoPay } from '@/hooks/useMezoPay'
import { TransactionStatus } from './TransactionStatus'

interface RepayModalProps {
  onClose: () => void
  currentDebt: number
  musdBalance: string
}

export function RepayModal({ onClose, currentDebt, musdBalance }: RepayModalProps) {
  const { repayMUSD, approveMUSD, isPending, isConfirmed, hash } = useMezoPay()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [needsApproval, setNeedsApproval] = useState(true)
  const [isApproving, setIsApproving] = useState(false)

  const repayAmount = parseFloat(amount) || 0
  const availableBalance = parseFloat(musdBalance)
  const maxRepayable = Math.min(currentDebt, availableBalance)

  const handleApprove = () => {
    if (!amount || repayAmount <= 0) return
    
    try {
      setError('')
      setIsApproving(true)
      approveMUSD(amount)
      setNeedsApproval(false)
    } catch (error) {
      console.error('Approval failed:', error)
      setError(error instanceof Error ? error.message : 'Approval failed')
    } finally {
      setIsApproving(false)
    }
  }

  const handleRepay = () => {
    if (!amount || repayAmount <= 0 || repayAmount > maxRepayable) return
    
    try {
      setError('')
      repayMUSD(amount)
    } catch (error) {
      console.error('Repay failed:', error)
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
          <h2 className="text-xl font-semibold text-white">Repay MUSD Debt</h2>
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
              Amount (MUSD)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                step="0.01"
                min="0"
                max={maxRepayable}
              />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">MUSD</span>
              </div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">
                Available: ${availableBalance.toFixed(2)} MUSD
              </span>
              <button
                onClick={() => setAmount(maxRepayable.toString())}
                className="text-blue-400 hover:text-blue-300"
              >
                Max
              </button>
            </div>
          </div>

          <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-white">Repayment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Current Debt:</span>
                <span className="text-white">${currentDebt.toFixed(2)} MUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Repay Amount:</span>
                <span className="text-white">${repayAmount.toFixed(2)} MUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Remaining Debt:</span>
                <span className="text-white">${Math.max(0, currentDebt - repayAmount).toFixed(2)} MUSD</span>
              </div>
            </div>
          </div>

          {repayAmount > maxRepayable && (
            <div className="bg-red-900/20 border border-red-600/30 p-4 rounded-lg">
              <h3 className="font-medium text-red-300 mb-1">⚠️ Insufficient Balance</h3>
              <p className="text-sm text-red-200">
                You can only repay up to ${maxRepayable.toFixed(2)} MUSD with your current balance.
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

          <div className="bg-blue-900/20 border border-blue-600/30 p-4 rounded-lg">
            <h3 className="font-medium text-blue-300 mb-1">About Repayment</h3>
            <p className="text-sm text-blue-200">
              Repaying MUSD reduces your debt and improves your collateral ratio. 
              Interest is paid first, then principal amount.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            
            {needsApproval ? (
              <button
                onClick={handleApprove}
                disabled={!amount || repayAmount <= 0 || repayAmount > maxRepayable || isApproving}
                className="flex-1 bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isApproving ? 'Approving...' : 'Approve MUSD'}
              </button>
            ) : (
              <button
                onClick={handleRepay}
                disabled={!amount || repayAmount <= 0 || repayAmount > maxRepayable || isPending}
                className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Repaying...' : 'Repay MUSD'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}