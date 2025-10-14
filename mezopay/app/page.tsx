'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Dashboard } from '@/components/Dashboard'
import { LandingPage } from '@/components/LandingPage'
import { SimpleAnimatedBackground } from '@/components/ui/animated-background'
import { Rocket, ArrowRight } from 'lucide-react'

export default function Home() {
  const { isConnected } = useAccount()
  const [showDashboard, setShowDashboard] = useState(false)

  const handleLaunchDapp = () => {
    if (isConnected) {
      setShowDashboard(true)
    } else {
      // Wallet bağlantısı gerekiyor, ConnectButton'a tıklamaya yönlendir
      // Bu durumda modal açılacak veya wallet bağlantısı başlatılacak
      setShowDashboard(true) // Dashboard'a git, orada wallet bağlantısı isteyeceğiz
    }
  }

  return (
    <main className="min-h-screen relative">
      {/* Animated Background */}
      <SimpleAnimatedBackground />
      
      <nav className="relative z-10 flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bitcoin-gradient rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white">MezoPay</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {showDashboard && (
            <button
              onClick={() => setShowDashboard(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              Back to Home
            </button>
          )}
          {/* Sadece dashboard'da wallet connect butonu göster */}
          {showDashboard && <ConnectButton />}
        </div>
      </nav>
      
      {!showDashboard ? (
        <LandingPage 
          onLaunchDapp={handleLaunchDapp}
        />
      ) : (
        <Dashboard />
      )}
    </main>
  )
}