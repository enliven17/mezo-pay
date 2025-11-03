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
  const { mintMUSD, isPending, isConfirmed, hash, refetch, writeError } = useMezoPay()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  // Detailed debug log
  console.log('MintModal detailed state:', {
    amount,
    maxMintable,
    currentDebt,
    collateralValue,
    isPending,
    isConfirmed,
    hash,
    writeError,
    mintAmount: parseFloat(amount) || 0
  })

  const mintAmount = parseFloat(amount) || 0
  const newDebt = currentDebt + mintAmount
  const newCollateralRatio = newDebt > 0 ? (collateralValue / newDebt) * 100 : 0

  const handleMint = () => {
    console.log('Mint MUSD clicked:', { amount, mintAmount, maxMintable })
    
    if (!amount || mintAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    if (mintAmount > maxMintable) {
      setError(`Amount exceeds maximum mintable: ${maxMintable}`)
      return
    }
    
    try {
      setError('')
      console.log('Calling mintMUSD with amount:', amount)
      mintMUSD(amount)
    } catch (error) {
      console.error('Mint failed:', error)
      setError(error instanceof Error ? error.message : 'Transaction failed')
    }
  }
  
  // Monitor writeError from hook
  useEffect(() => {
    if (writeError) {
      console.error('Mint write error from hook:', writeError)
      setError(writeError.message || 'Transaction failed')
    }
  }, [writeError])

  // Close modal when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && hash && amount) {
      console.log('Transaction confirmed, refetching data...')
      
      // Add demo transaction to history
      const demoTx = {
        id: hash,
        type: 'mint' as const,
        description: 'MUSD Minted (Demo)',
        amount: parseFloat(amount).toFixed(2),
        currency: 'MUSD' as const,
        hash: hash,
        timestamp: Date.now(),
        status: 'completed' as const
      }
      
      // Add to localStorage for persistence
      if (typeof window !== 'undefined') {
        const address = window.ethereum?.selectedAddress
        if (address) {
          const stored = localStorage.getItem(`demo_transactions_${address}`)
          const current = stored ? JSON.parse(stored) : []
          const updated = [demoTx, ...current.filter((t: any) => t.id !== demoTx.id)]
          localStorage.setItem(`demo_transactions_${address}`, JSON.stringify(updated))
        }
      }
      
      refetch() // Refresh all contract data
      setTimeout(() => {
        onClose()
      }, 1000) // Wait 1 second before closing to show success
    }
  }, [isConfirmed, onClose, refetch, hash, amount])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Mint MUSD</h2>
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
                max={maxMintable}
              />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">MUSD</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Maximum: ${maxMintable.toLocaleString()} MUSD
            </p>
          </div>

          <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-white">Loan Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Current Debt:</span>
                <span className="text-white">${currentDebt.toLocaleString()} MUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">New Debt:</span>
                <span className="text-white">${newDebt.toLocaleString()} MUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Interest Rate:</span>
                <span className="text-green-400">1% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">New Collateral Ratio:</span>
                <span className={newCollateralRatio >= 200 ? 'text-green-400' : 
                                newCollateralRatio >= 160 ? 'text-yellow-400' : 'text-red-400'}>
                  {newCollateralRatio.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {newCollateralRatio < 160 && (
            <div className="bg-red-900/20 border border-red-600/30 p-4 rounded-lg">
              <h3 className="font-medium text-red-300 mb-1">⚠️ Liquidation Risk</h3>
              <p className="text-sm text-red-200">
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

          <div className="bg-blue-900/20 border border-blue-600/30 p-4 rounded-lg">
            <h3 className="font-medium text-blue-300 mb-1">About MUSD</h3>
            <p className="text-sm text-blue-200">
              MUSD is a stablecoin backed by Bitcoin collateral. 
              You can spend it using your MezoPay card anywhere cards are accepted.
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