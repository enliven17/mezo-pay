'use client'

import { CreditCard, Shield, Zap, TrendingUp, Rocket, ArrowRight, Bitcoin, DollarSign } from 'lucide-react'

interface LandingPageProps {
  onLaunchDapp: () => void
}

export function LandingPage({ onLaunchDapp }: LandingPageProps) {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-bitcoin/10 text-bitcoin px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Bitcoin className="w-4 h-4" />
            <span>Live on Mezo Testnet</span>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Your Bitcoin
          <br />
          <span className="text-bitcoin">Credit Card</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Don't sell your Bitcoin to spend it. Use it as collateral to get instant credit 
          and spend anywhere with our virtual credit card.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={onLaunchDapp}
            className="flex items-center space-x-3 bg-bitcoin text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Rocket className="w-6 h-6" />
            <span className="text-lg font-semibold">Launch dApp</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <a
            href="https://explorer.test.mezo.org/address/0xc0b33Cc720025dD0AcF56e249C8b76A6A34170B6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>View Contract</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Demo Card */}
        <div className="flex justify-center">
          <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-md transform hover:scale-105 transition-transform duration-200">
            <div className="card-gradient p-6 rounded-xl text-white mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-sm opacity-90">MezoPay Card</p>
                  <p className="text-xs opacity-75">Bitcoin Backed</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">M</span>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <p className="text-xl font-mono tracking-wider">•••• •••• •••• 1234</p>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-xs opacity-75">EXPIRES</p>
                    <p>12/28</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">CVV</p>
                    <p>123</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-2">
                Launch dApp to get your Bitcoin credit card
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span>✓ Instant approval</span>
                <span>✓ 1% APR</span>
                <span>✓ Global acceptance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl text-center hover:bg-gray-750 transition-colors">
          <div className="w-16 h-16 bitcoin-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Bitcoin className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">150%</h3>
          <p className="text-gray-300">Minimum Collateral Ratio</p>
          <p className="text-sm text-gray-400 mt-1">Industry leading efficiency</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl text-center hover:bg-gray-750 transition-colors">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">1%</h3>
          <p className="text-gray-300">Annual Interest Rate</p>
          <p className="text-sm text-gray-400 mt-1">Fixed rate, no surprises</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl text-center hover:bg-gray-750 transition-colors">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">∞</h3>
          <p className="text-gray-300">Global Acceptance</p>
          <p className="text-sm text-gray-400 mt-1">Spend anywhere cards work</p>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:bg-gray-750 transition-all duration-200">
          <div className="w-12 h-12 bitcoin-gradient rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">Instant Credit</h3>
          <p className="text-gray-300 text-sm">Get credit instantly by depositing Bitcoin as collateral</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:bg-gray-750 transition-all duration-200">
          <div className="w-12 h-12 bitcoin-gradient rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">Secure & Safe</h3>
          <p className="text-gray-300 text-sm">Your Bitcoin stays in your control with smart contract security</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:bg-gray-750 transition-all duration-200">
          <div className="w-12 h-12 bitcoin-gradient rounded-full flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">Low 1% APR</h3>
          <p className="text-gray-300 text-sm">Fixed 1% annual rate on your MUSD borrowing</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:bg-gray-750 transition-all duration-200">
          <div className="w-12 h-12 bitcoin-gradient rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">Keep Upside</h3>
          <p className="text-gray-300 text-sm">Your Bitcoin collateral can still appreciate in value</p>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl text-white">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-20 h-20 bg-bitcoin rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Bitcoin className="w-10 h-10 text-white" />
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">1. Deposit Bitcoin</h3>
              <p className="text-gray-300">Deposit Bitcoin as collateral to secure your credit line on Mezo testnet</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">2. Mint MUSD</h3>
              <p className="text-gray-300">Mint MUSD stablecoin up to 66% of your collateral value at 1% APR</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">3. Spend Anywhere</h3>
              <p className="text-gray-300">Get your virtual card and spend MUSD anywhere cards are accepted</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Powered by Mezo • Smart Contracts • Decentralized
          </p>
        </div>
      </div>
    </div>
  )
}