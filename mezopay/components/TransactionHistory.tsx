'use client'

import { ArrowUpRight, ArrowDownLeft, CreditCard, Plus } from 'lucide-react'

// Real transactions will be fetched from blockchain events

export function TransactionHistory() {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'spend':
        return <CreditCard className="w-5 h-5 text-red-500" />
      case 'mint':
        return <ArrowUpRight className="w-5 h-5 text-blue-500" />
      case 'collateral':
        return <Plus className="w-5 h-5 text-green-500" />
      default:
        return <ArrowDownLeft className="w-5 h-5 text-gray-500" />
    }
  }

  const formatAmount = (amount: number, currency: string = 'USD') => {
    if (currency === 'BTC') {
      return `${amount > 0 ? '+' : ''}${amount} BTC`
    }
    return `${amount > 0 ? '+' : ''}$${Math.abs(amount).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
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

      <div className="text-center py-12">
        <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No transactions yet</p>
        <p className="text-sm text-gray-500">Start by depositing Bitcoin collateral to see your transaction history</p>
      </div>
    </div>
  )
}