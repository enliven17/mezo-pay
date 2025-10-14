'use client'

import { useState } from 'react'
import { Eye, EyeOff, Copy, Freeze } from 'lucide-react'
import { useMezoPay } from '@/hooks/useMezoPay'

export function VirtualCard() {
  const { cardInfo, freezeCard, isPending } = useMezoPay()
  const [showDetails, setShowDetails] = useState(false)

  const cardExists = cardInfo && cardInfo.cardNumber
  const isFrozen = cardInfo ? !cardInfo.isActive : false

  const cardDetails = cardExists ? {
    number: cardInfo.cardNumber,
    expiry: cardInfo.expiryDate,
    cvv: cardInfo.cvv,
    name: cardInfo.holderName
  } : {
    number: '•••• •••• •••• ••••',
    expiry: '••/••',
    cvv: '•••',
    name: 'NO CARD'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In real app, show toast notification
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Virtual Card</h2>
        {cardExists && (
          <button
            onClick={() => freezeCard(!cardInfo.isActive)}
            disabled={isPending}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
              isFrozen ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Freeze className="w-4 h-4" />
            <span>{isFrozen ? 'Frozen' : 'Active'}</span>
          </button>
        )}
      </div>

      {/* Card Display */}
      <div className={`card-gradient p-6 rounded-xl text-white mb-6 relative ${
        isFrozen ? 'opacity-50' : ''
      }`}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-sm opacity-90">MezoPay Card</p>
            <p className="text-xs opacity-75">Bitcoin Backed</p>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">M</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-lg font-mono tracking-wider">
              {showDetails ? cardDetails.number : '•••• •••• •••• 9012'}
            </p>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-75 mb-1">CARDHOLDER NAME</p>
              <p className="text-sm font-medium">{cardDetails.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75 mb-1">EXPIRES</p>
              <p className="text-sm font-medium">{cardDetails.expiry}</p>
            </div>
          </div>
        </div>

        {isFrozen && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Freeze className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Card Frozen</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Controls */}
      <div className="space-y-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors"
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
        </button>

        {showDetails && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Card Number</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{cardDetails.number}</span>
                <button
                  onClick={() => copyToClipboard(cardDetails.number.replace(/\s/g, ''))}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CVV</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{cardDetails.cvv}</span>
                <button
                  onClick={() => copyToClipboard(cardDetails.cvv)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expiry</span>
              <span className="font-mono text-sm">{cardDetails.expiry}</span>
            </div>
          </div>
        )}

        {cardExists && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Daily Limit</span>
              <span className="font-medium">${parseFloat(cardInfo.dailyLimit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Monthly Limit</span>
              <span className="font-medium">${parseFloat(cardInfo.monthlyLimit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Daily Spent</span>
              <span className="font-medium">${parseFloat(cardInfo.dailySpent).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monthly Spent</span>
              <span className="font-medium">${parseFloat(cardInfo.monthlySpent).toLocaleString()}</span>
            </div>
          </div>
        )}

        {!cardExists && (
          <div className="pt-4 border-t text-center">
            <p className="text-sm text-gray-500">
              Mint MUSD to get your virtual credit card
            </p>
          </div>
        )}
      </div>
    </div>
  )
}