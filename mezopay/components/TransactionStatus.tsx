'use client'

import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'

interface TransactionStatusProps {
  status: 'pending' | 'confirming' | 'success' | 'error'
  hash?: string
  message?: string
}

export function TransactionStatus({ status, hash, message }: TransactionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <LoadingSpinner size="sm" />,
          text: 'Waiting for signature...',
          color: 'text-blue-400',
          bg: 'bg-blue-900/20',
          border: 'border-blue-600/30'
        }
      case 'confirming':
        return {
          icon: <Clock className="w-5 h-5 text-yellow-400" />,
          text: 'Transaction confirming...',
          color: 'text-yellow-400',
          bg: 'bg-yellow-900/20',
          border: 'border-yellow-600/30'
        }
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          text: 'Transaction successful!',
          color: 'text-green-400',
          bg: 'bg-green-900/20',
          border: 'border-green-600/30'
        }
      case 'error':
        return {
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          text: message || 'Transaction failed',
          color: 'text-red-400',
          bg: 'bg-red-900/20',
          border: 'border-red-600/30'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
      <div className="flex items-center space-x-3">
        {config.icon}
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </p>
          {hash && (
            <a
              href={`https://explorer.test.mezo.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
            >
              View on Explorer
            </a>
          )}
        </div>
      </div>
    </div>
  )
}