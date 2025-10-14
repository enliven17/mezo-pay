'use client'

import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

interface CollateralHealthProps {
  ratio: number
}

export function CollateralHealth({ ratio }: CollateralHealthProps) {
  const getHealthStatus = () => {
    if (ratio >= 200) return { color: 'green', icon: CheckCircle, text: 'Healthy', bg: 'bg-green-100' }
    if (ratio >= 160) return { color: 'yellow', icon: AlertCircle, text: 'Warning', bg: 'bg-yellow-100' }
    return { color: 'red', icon: AlertTriangle, text: 'Risk', bg: 'bg-red-100' }
  }

  const status = getHealthStatus()
  const Icon = status.icon

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">Collateral Health</p>
        <p className="text-2xl font-bold">{ratio}%</p>
        <div className="flex items-center space-x-1 mt-1">
          <Icon className={`w-4 h-4 text-${status.color}-600`} />
          <p className={`text-sm text-${status.color}-600 font-medium`}>{status.text}</p>
        </div>
      </div>
      <div className={`w-12 h-12 ${status.bg} rounded-full flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${status.color}-600`} />
      </div>
    </div>
  )
}