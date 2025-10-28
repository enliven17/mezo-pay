'use client'

import { ArrowUpRight, ArrowDownLeft, CreditCard, Plus } from 'lucide-react'
import { useAccount, useWatchContractEvent } from 'wagmi'
import { useState } from 'react'
import { CONTRACTS } from '@/lib/wagmi'
import { MEZOPAY_ABI } from '@/lib/contracts'

interface Transaction {
  id: string
  type: 'deposit' | 'mint' | 'repay' | 'spend' | 'freeze'
  description: string
  amount: string
  currency: 'BTC' | 'MUSD'
  hash: string
  timestamp: number
  status: 'completed'
}

export function TransactionHistory() {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Watch for CollateralDeposited events
  useWatchContractEvent({
    address: CONTRACTS.MEZOPAY as `0x${string}`,
    abi: MEZOPAY_ABI,
    eventName: 'CollateralDeposited',
    args: { user: address },
    onLogs(logs) {
      logs.forEach((log) => {
        const newTx: Transaction = {
          id: log.transactionHash,
          type: 'deposit',
          description: 'Bitcoin Collateral Deposited',
          amount: (Number(log.args.amount) / 1e18).toFixed(4),
          currency: 'BTC',
          hash: log.transactionHash,
          timestamp: Date.now(),
          status: 'completed'
        }
        setTransactions(prev => [newTx, ...prev.filter(tx => tx.id !== newTx.id)])
      })
    },
  })

  // Watch for MUSDMinted events
  useWatchContractEvent({
    address: CONTRACTS.MEZOPAY as `0x${string}`,
    abi: MEZOPAY_ABI,
    eventName: 'MUSDMinted',
    args: { user: address },
    onLogs(logs) {
      logs.forEach((log) => {
        const newTx: Transaction = {
          id: log.transactionHash,
          type: 'mint',
          description: 'MUSD Minted',
          amount: (Number(log.args.amount) / 1e18).toFixed(2),
          currency: 'MUSD',
          hash: log.transactionHash,
          timestamp: Date.now(),
          status: 'completed'
        }
        setTransactions(prev => [newTx, ...prev.filter(tx => tx.id !== newTx.id)])
      })
    },
  })

  // Watch for MUSDRepaid events
  useWatchContractEvent({
    address: CONTRACTS.MEZOPAY as `0x${string}`,
    abi: MEZOPAY_ABI,
    eventName: 'MUSDRepaid',
    args: { user: address },
    onLogs(logs) {
      logs.forEach((log) => {
        const newTx: Transaction = {
          id: log.transactionHash,
          type: 'repay',
          description: 'MUSD Debt Repaid',
          amount: (Number(log.args.amount) / 1e18).toFixed(2),
          currency: 'MUSD',
          hash: log.transactionHash,
          timestamp: Date.now(),
          status: 'completed'
        }
        setTransactions(prev => [newTx, ...prev.filter(tx => tx.id !== newTx.id)])
      })
    },
  })

  // Watch for CardSpending events
  useWatchContractEvent({
    address: CONTRACTS.MEZOPAY as `0x${string}`,
    abi: MEZOPAY_ABI,
    eventName: 'CardSpending',
    args: { user: address },
    onLogs(logs) {
      logs.forEach((log) => {
        const newTx: Transaction = {
          id: log.transactionHash,
          type: 'spend',
          description: `Card Payment - ${log.args.merchant}`,
          amount: (Number(log.args.amount) / 1e18).toFixed(2),
          currency: 'MUSD',
          hash: log.transactionHash,
          timestamp: Date.now(),
          status: 'completed'
        }
        setTransactions(prev => [newTx, ...prev.filter(tx => tx.id !== newTx.id)])
      })
    },
  })

  // Watch for CardFrozen events
  useWatchContractEvent({
    address: CONTRACTS.MEZOPAY as `0x${string}`,
    abi: MEZOPAY_ABI,
    eventName: 'CardFrozen',
    args: { user: address },
    onLogs(logs) {
      logs.forEach((log) => {
        const newTx: Transaction = {
          id: log.transactionHash,
          type: 'freeze',
          description: log.args.frozen ? 'Card Frozen' : 'Card Unfrozen',
          amount: '0',
          currency: 'MUSD',
          hash: log.transactionHash,
          timestamp: Date.now(),
          status: 'completed'
        }
        setTransactions(prev => [newTx, ...prev.filter(tx => tx.id !== newTx.id)])
      })
    },
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'spend':
        return <CreditCard className="w-5 h-5 text-red-400" />
      case 'mint':
        return <ArrowUpRight className="w-5 h-5 text-blue-400" />
      case 'deposit':
        return <Plus className="w-5 h-5 text-green-400" />
      case 'repay':
        return <ArrowDownLeft className="w-5 h-5 text-yellow-400" />
      case 'freeze':
        return <CreditCard className="w-5 h-5 text-gray-400" />
      default:
        return <ArrowDownLeft className="w-5 h-5 text-gray-400" />
    }
  }

  const formatAmount = (amount: string, currency: 'BTC' | 'MUSD') => {
    if (currency === 'BTC') {
      return `+${amount} BTC`
    }
    if (amount === '0') return ''
    return `${amount} MUSD`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Transaction History</h2>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium text-white">{transaction.description}</p>
                <p className="text-sm text-gray-400">{formatDate(transaction.timestamp)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'deposit' || transaction.type === 'mint' ? 'text-green-400' : 
                transaction.type === 'spend' || transaction.type === 'repay' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {formatAmount(transaction.amount, transaction.currency)}
              </p>
              <a
                href={`https://explorer.test.mezo.org/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
              >
                View on Explorer
              </a>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-500">Start by depositing Bitcoin collateral to see your transaction history</p>
        </div>
      )}
    </div>
  )
}