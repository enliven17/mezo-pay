'use client'

import { ArrowUpRight, ArrowDownLeft, CreditCard, Plus } from 'lucide-react'

const mockTransactions = [
  {
    id: '1',
    type: 'spend',
    description: 'Amazon Purchase',
    amount: -89.99,
    date: '2024-01-15T10:30:00Z',
    status: 'completed'
  },
  {
    id: '2',
    type: 'mint',
    description: 'MUSD Minted',
    amount: 5000,
    date: '2024-01-14T15:45:00Z',
    status: 'completed'
  },
  {
    id: '3',
    type: 'collateral',
    description: 'BTC Collateral Added',
    amount: 0.5,
    date: '2024-01-14T15:30:00Z',
    status: 'completed',
    currency: 'BTC'
  },
  {
    id: '4',
    type: 'spend',
    description: 'Starbucks',
    amount: -12.50,
    date: '2024-01-13T08:15:00Z',
    status: 'completed'
  },
  {
    id: '5',
    type: 'spend',
    description: 'Gas Station',
    amount: -45.00,
    date: '2024-01-12T18:20:00Z',
    status: 'completed'
  }
]

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

      <div className="space-y-4">
        {mockTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium text-white">{transaction.description}</p>
                <p className="text-sm text-gray-400">{formatDate(transaction.date)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatAmount(transaction.amount, transaction.currency)}
              </p>
              <p className="text-sm text-gray-400 capitalize">{transaction.status}</p>
            </div>
          </div>
        ))}
      </div>

      {mockTransactions.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-500">Your transaction history will appear here</p>
        </div>
      )}
    </div>
  )
}