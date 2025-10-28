'use client'

import { useState, useRef } from 'react'
import { Eye, EyeOff, Copy, Lock, CreditCard } from 'lucide-react'
import { useMezoPay } from '@/hooks/useMezoPay'

export function VirtualCard() {
  const { cardInfo, freezeCard, isPending } = useMezoPay()
  const [showDetails, setShowDetails] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Virtual Card</h2>
        {cardExists && (
          <button
            onClick={() => freezeCard(!cardInfo.isActive)}
            disabled={isPending}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
              isFrozen ? 'bg-red-900/30 text-red-400' : 'bg-gray-700 text-gray-300'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Lock className="w-4 h-4" />
            <span>{isFrozen ? 'Frozen' : 'Active'}</span>
          </button>
        )}
      </div>

      {/* 3D Interactive Card */}
      <div className="perspective-1000 mb-6">
        <div 
          ref={cardRef}
          className={`card-3d ${isFlipped ? 'flipped' : ''} ${isFrozen ? 'opacity-50' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            transform: `rotateY(${isFlipped ? 180 : 0}deg) rotateX(${mousePosition.y / 20}deg) rotateZ(${mousePosition.x / 40}deg)`,
          }}
        >
          {/* Card Front */}
          <div className="card-face card-front">
            <div className="card-gradient p-6 rounded-xl text-white h-full relative overflow-hidden">
              {/* Holographic effect */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                }}
              />
              
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/3 rounded-full -ml-12 -mb-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-sm opacity-90 font-medium">MezoPay Card</p>
                  <p className="text-xs opacity-75">Bitcoin Backed</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-lg font-bold">M</span>
                </div>
              </div>

              {/* Chip */}
              <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md mb-4 relative z-10">
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md p-1">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-sm"></div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <p className="text-xl font-mono tracking-wider font-medium">
                    {showDetails ? cardDetails.number : '•••• •••• •••• 9012'}
                  </p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-75 mb-1 uppercase tracking-wide">Cardholder Name</p>
                    <p className="text-sm font-medium">{cardDetails.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75 mb-1 uppercase tracking-wide">Expires</p>
                    <p className="text-sm font-medium">{cardDetails.expiry}</p>
                  </div>
                </div>
              </div>

              {/* Contactless payment symbol */}
              <div className="absolute top-6 right-20 opacity-60">
                <div className="w-6 h-6">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
              </div>

              {isFrozen && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <Lock className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Card Frozen</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Back */}
          <div className="card-face card-back">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl text-white h-full relative">
              {/* Magnetic stripe */}
              <div className="w-full h-12 bg-black mt-4 mb-6"></div>
              
              {/* CVV area */}
              <div className="bg-white p-3 rounded mb-4">
                <div className="flex justify-end">
                  <div className="bg-gray-100 px-3 py-1 rounded text-black font-mono text-sm">
                    {showDetails ? cardDetails.cvv : '•••'}
                  </div>
                </div>
              </div>

              {/* Back info */}
              <div className="text-xs opacity-75 space-y-2">
                <p>This card is property of MezoPay</p>
                <p>Bitcoin-backed credit card</p>
                <p>For customer service: support@mezopay.com</p>
              </div>

              {/* Logo */}
              <div className="absolute bottom-6 right-6">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm">{showDetails ? 'Hide' : 'Show'}</span>
          </button>
          
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Flip Card</span>
          </button>
        </div>

        {showDetails && (
          <div className="space-y-3 p-4 bg-gray-700 border border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Card Number</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm text-white">{cardDetails.number}</span>
                <button
                  onClick={() => copyToClipboard(cardDetails.number.replace(/\s/g, ''))}
                  className="p-1 hover:bg-gray-600 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">CVV</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm text-white">{cardDetails.cvv}</span>
                <button
                  onClick={() => copyToClipboard(cardDetails.cvv)}
                  className="p-1 hover:bg-gray-600 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Expiry</span>
              <span className="font-mono text-sm text-white">{cardDetails.expiry}</span>
            </div>
          </div>
        )}

        {cardExists && (
          <div className="pt-4 border-t border-gray-600">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Daily Limit</span>
              <span className="font-medium text-white">${parseFloat(cardInfo.dailyLimit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Monthly Limit</span>
              <span className="font-medium text-white">${parseFloat(cardInfo.monthlyLimit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Daily Spent</span>
              <span className="font-medium text-white">${parseFloat(cardInfo.dailySpent).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Monthly Spent</span>
              <span className="font-medium text-white">${parseFloat(cardInfo.monthlySpent).toLocaleString()}</span>
            </div>
          </div>
        )}

        {cardExists && (
          <div className="pt-4 border-t border-gray-600">
            <button
              onClick={() => {
                // Demo spending functionality
                const merchant = prompt('Enter merchant name:')
                const amount = prompt('Enter amount in MUSD:')
                if (merchant && amount) {
                  // This would call spendWithCard from useMezoPay
                  console.log(`Spending ${amount} MUSD at ${merchant}`)
                }
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Test Card Payment
            </button>
          </div>
        )}

        {!cardExists && (
          <div className="pt-4 border-t border-gray-600 text-center">
            <p className="text-sm text-gray-400">
              Mint MUSD to get your virtual credit card
            </p>
          </div>
        )}
      </div>
    </div>
  )
}