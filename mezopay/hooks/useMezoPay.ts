'use client'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACTS } from '@/lib/wagmi'
import { MEZOPAY_ABI, MUSD_ABI } from '@/lib/contracts'

export function useMezoPay() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()

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
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Contract write functions
  const depositCollateral = (amount: string) => {
    if (!CONTRACTS.MEZOPAY) {
      console.error('Contract not deployed, MEZOPAY address:', CONTRACTS.MEZOPAY)
      throw new Error('Contract not deployed')
    }
    
    console.log('Calling depositCollateral with:', {
      address: CONTRACTS.MEZOPAY,
      amount,
      value: parseEther(amount).toString()
    })
    
    writeContract({
      address: CONTRACTS.MEZOPAY as `0x${string}`,
      abi: MEZOPAY_ABI,
      functionName: 'depositCollateral',
      value: parseEther(amount),
    })
  }

  const mintMUSD = (amount: string) => {
    if (!CONTRACTS.MEZOPAY) throw new Error('Contract not deployed')
    
    writeContract({
      address: CONTRACTS.MEZOPAY as `0x${string}`,
      abi: MEZOPAY_ABI,
      functionName: 'mintMUSD',
      args: [parseEther(amount)],
    })
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

  const parsedCardInfo = cardInfo ? {
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

  const parsedMusdBalance = musdBalance ? formatEther(musdBalance) : '0'

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
    
    // State
    isPending: isPending || isConfirming,
    isConfirmed,
    hash,
    writeError,
    
    // Refetch functions
    refetch: () => {
      refetchCreditLine()
      refetchCard()
      refetchMusdBalance()
    },
  }
}