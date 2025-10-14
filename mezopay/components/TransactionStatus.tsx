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
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        }
      case 'confirming':
        return {
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          text: 'Transaction confirming...',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50'
        }
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: 'Transaction successful!',
          color: 'text-green-600',
          bg: 'bg-green-50'
        }
      case 'error':
        return {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          text: message || 'Transaction failed',
          color: 'text-red-600',
          bg: 'bg-red-50'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`p-3 rounded-lg ${config.bg} border border-opacity-20`}>
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
              className="text-xs text-blue-600 hover:underline"
            >
              View on Explorer
            </a>
          )}
        </div>
      </div>
    </div>
  )
}