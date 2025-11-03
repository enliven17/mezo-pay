'use client'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACTS } from '@/lib/wagmi'
import { MEZOPAY_ABI, MUSD_ABI } from '@/lib/contracts'

export function useMezoPay() {
  const { address, isConnected, chain } = useAccount()
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  
  // Demo MUSD balance system (localStorage)
  const getDemoMusdBalance = () => {
    if (!address) return '0'
    const stored = localStorage.getItem(`demo_musd_${address}`)
    return stored || '0'
  }
  
  const setDemoMusdBalance = (amount: string) => {
    if (!address) return
    localStorage.setItem(`demo_musd_${address}`, amount)
  }
  
  const addDemoMusdBalance = (amount: string) => {
    const current = parseFloat(getDemoMusdBalance())
    const additional = parseFloat(amount)
    const newBalance = (current + additional).toString()
    setDemoMusdBalance(newBalance)
    return newBalance
  }

  // Demo card system (localStorage)
  const getDemoCardInfo = () => {
    if (!address) return null
    const stored = localStorage.getItem(`demo_card_${address}`)
    return stored ? JSON.parse(stored) : null
  }
  
  const createDemoCard = () => {
    if (!address) return null
    
    // Generate demo card details
    const cardNumber = `4532 ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)}`
    const demoCard = {
      cardNumber,
      expiryDate: '12/28',
      cvv: '123',
      holderName: 'MEZOPAY USER',
      dailyLimit: '2500',
      monthlyLimit: '25000',
      dailySpent: '0',
      monthlySpent: '0',
      isActive: true
    }
    
    localStorage.setItem(`demo_card_${address}`, JSON.stringify(demoCard))
    console.log('Demo card created:', demoCard)
    return demoCard
  }
  
  const getDemoCardExists = () => {
    const demoBalance = parseFloat(getDemoMusdBalance())
    return demoBalance > 0 // Card exists if user has MUSD balance
  }
  
  // Debug log
  console.log('useMezoPay state:', { 
    address, 
    isConnected, 
    chain: chain?.id, 
    chainName: chain?.name,
    isPending, 
    hash,
    writeError,
    demoMusdBalance: getDemoMusdBalance()
  })

  // Read credit line info
  const { data: creditLineInfo, refetch: refetchCreditLine } = useReadContract({
    address: CONTRACTS.MEZOPAY as `0x${string}`,
    abi: MEZOPAY_ABI,
    functionName: 'getCreditLineInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.MEZOPAY,
    },
  })

  // Read virtual card info
  const { data: cardInfo, refetch: refetchCard } = useReadContract({
    address: CONTRACTS.MEZOPAY as `0x${string}`,
    abi: MEZOPAY_ABI,
    functionName: 'getVirtualCardInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.MEZOPAY,
    },
  })

  // Read MUSD balance
  const { data: musdBalance, refetch: refetchMusdBalance } = useReadContract({
    address: CONTRACTS.MUSD as `0x${string}`,
    abi: MUSD_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  // Debug transaction receipt
  if (receipt) {
    console.log('Transaction receipt:', receipt)
  }
  if (receiptError) {
    console.error('Transaction receipt error:', receiptError)
  }

  // Contract write functions
  const depositCollateral = (amount: string) => {
    if (!CONTRACTS.MEZOPAY) {
      console.error('Contract not deployed, MEZOPAY address:', CONTRACTS.MEZOPAY)
      throw new Error('Contract not deployed')
    }
    
    if (!isConnected) {
      console.error('Wallet not connected')
      throw new Error('Wallet not connected')
    }
    
    if (chain?.id !== 31611) {
      console.error('Wrong network. Expected: 31611, Current:', chain?.id)
      throw new Error('Please switch to Mezo Testnet')
    }
    
    console.log('Calling depositCollateral with:', {
      contractAddress: CONTRACTS.MEZOPAY,
      userAddress: address,
      amount,
      value: parseEther(amount).toString(),
      chainId: chain?.id
    })
    
    try {
      writeContract({
        address: CONTRACTS.MEZOPAY as `0x${string}`,
        abi: MEZOPAY_ABI,
        functionName: 'depositCollateral',
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('writeContract error:', error)
      throw error
    }
  }

  const mintMUSD = (amount: string) => {
    if (!CONTRACTS.MEZOPAY) {
      console.error('Contract not deployed, MEZOPAY address:', CONTRACTS.MEZOPAY)
      throw new Error('Contract not deployed')
    }
    
    if (!isConnected) {
      console.error('Wallet not connected')
      throw new Error('Wallet not connected')
    }
    
    if (chain?.id !== 31611) {
      console.error('Wrong network. Expected: 31611, Current:', chain?.id)
      throw new Error('Please switch to Mezo Testnet')
    }
    
    console.log('Calling mintMUSD with:', {
      contractAddress: CONTRACTS.MEZOPAY,
      userAddress: address,
      amount,
      parsedAmount: parseEther(amount).toString(),
      chainId: chain?.id
    })
    
    try {
      // Add demo MUSD to user's balance immediately after signature
      const newBalance = addDemoMusdBalance(amount)
      console.log('Demo MUSD added to balance:', { amount, newBalance })
      
      // Create demo card if first mint
      if (!getDemoCardInfo()) {
        createDemoCard()
      }
      
      writeContract({
        address: CONTRACTS.MEZOPAY as `0x${string}`,
        abi: MEZOPAY_ABI,
        functionName: 'mintMUSD',
        args: [parseEther(amount)],
      })
    } catch (error) {
      console.error('mintMUSD writeContract error:', error)
      throw error
    }
  }

  const repayMUSD = (amount: string) => {
    if (!CONTRACTS.MEZOPAY) throw new Error('Contract not deployed')
    
    writeContract({
      address: CONTRACTS.MEZOPAY as `0x${string}`,
      abi: MEZOPAY_ABI,
      functionName: 'repayMUSD',
      args: [parseEther(amount)],
    })
  }

  const spendWithCard = (amount: string, merchant: string) => {
    if (!CONTRACTS.MEZOPAY) throw new Error('Contract not deployed')
    
    writeContract({
      address: CONTRACTS.MEZOPAY as `0x${string}`,
      abi: MEZOPAY_ABI,
      functionName: 'spendWithCard',
      args: [parseEther(amount), merchant],
    })
  }

  const freezeCard = (freeze: boolean) => {
    if (!CONTRACTS.MEZOPAY) throw new Error('Contract not deployed')
    
    writeContract({
      address: CONTRACTS.MEZOPAY as `0x${string}`,
      abi: MEZOPAY_ABI,
      functionName: 'freezeCard',
      args: [freeze],
    })
  }

  const closePosition = () => {
    if (!CONTRACTS.MEZOPAY) throw new Error('Contract not deployed')
    
    writeContract({
      address: CONTRACTS.MEZOPAY as `0x${string}`,
      abi: MEZOPAY_ABI,
      functionName: 'closePosition',
    })
  }

  // Approve MUSD spending (for repayments)
  const approveMUSD = (amount: string) => {
    writeContract({
      address: CONTRACTS.MUSD as `0x${string}`,
      abi: MUSD_ABI,
      functionName: 'approve',
      args: [CONTRACTS.MEZOPAY, parseEther(amount)],
    })
  }

  // Parsed data
  const parsedCreditLine = creditLineInfo ? {
    collateralAmount: formatEther(creditLineInfo[0]),
    musdMinted: formatEther(creditLineInfo[1]),
    accruedInterest: formatEther(creditLineInfo[2]),
    collateralRatio: Number(creditLineInfo[3]),
    availableCredit: formatEther(creditLineInfo[4]),
    isActive: creditLineInfo[5],
  } : null

  // Use demo card info if available, otherwise use contract data
  const demoCard = getDemoCardInfo()
  const contractCardInfo = cardInfo ? {
    cardNumber: cardInfo[0],
    expiryDate: cardInfo[1],
    cvv: cardInfo[2],
    holderName: cardInfo[3],
    dailyLimit: formatEther(cardInfo[4]),
    monthlyLimit: formatEther(cardInfo[5]),
    dailySpent: formatEther(cardInfo[6]),
    monthlySpent: formatEther(cardInfo[7]),
    isActive: cardInfo[8],
  } : null
  
  const parsedCardInfo = demoCard || contractCardInfo

  // Use demo MUSD balance for better UX
  const actualMusdBalance = musdBalance ? formatEther(musdBalance) : '0'
  const demoBalance = getDemoMusdBalance()
  const parsedMusdBalance = demoBalance
  
  console.log('MUSD Balance calculation:', {
    actualMusdBalance,
    demoBalance,
    parsedMusdBalance,
    creditLineMinted: parsedCreditLine?.musdMinted
  })

  return {
    // Data
    creditLine: parsedCreditLine,
    cardInfo: parsedCardInfo,
    musdBalance: parsedMusdBalance,
    
    // Actions
    depositCollateral,
    mintMUSD,
    repayMUSD,
    spendWithCard,
    freezeCard,
    closePosition,
    approveMUSD,
    
    // Demo functions
    getDemoMusdBalance,
    setDemoMusdBalance,
    addDemoMusdBalance,
    getDemoCardInfo,
    createDemoCard,
    getDemoCardExists,
    
    // State
    isPending: isPending || isConfirming,
    isConfirmed,
    hash,
    writeError,
    receipt,
    receiptError,
    
    // Refetch functions
    refetch: () => {
      refetchCreditLine()
      refetchCard()
      refetchMusdBalance()
    },
  }
}