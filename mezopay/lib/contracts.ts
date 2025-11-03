export const MEZOPAY_ABI = [
  {
    "type": "function",
    "name": "getCreditLineInfo",
    "inputs": [{"name": "user", "type": "address"}],
    "outputs": [
      {"name": "collateralAmount", "type": "uint256"},
      {"name": "musdMinted", "type": "uint256"},
      {"name": "accruedInterest", "type": "uint256"},
      {"name": "collateralRatio", "type": "uint256"},
      {"name": "availableCredit", "type": "uint256"},
      {"name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getVirtualCardInfo",
    "inputs": [{"name": "user", "type": "address"}],
    "outputs": [
      {"name": "cardNumber", "type": "string"},
      {"name": "expiryDate", "type": "string"},
      {"name": "cvv", "type": "string"},
      {"name": "holderName", "type": "string"},
      {"name": "dailyLimit", "type": "uint256"},
      {"name": "monthlyLimit", "type": "uint256"},
      {"name": "dailySpent", "type": "uint256"},
      {"name": "monthlySpent", "type": "uint256"},
      {"name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "depositCollateral",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "mintMUSD",
    "inputs": [{"name": "musdAmount", "type": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "repayMUSD",
    "inputs": [{"name": "musdAmount", "type": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "spendWithCard",
    "inputs": [
      {"name": "amount", "type": "uint256"},
      {"name": "merchant", "type": "string"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "freezeCard",
    "inputs": [{"name": "freeze", "type": "bool"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "closePosition",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "liquidate",
    "inputs": [{"name": "user", "type": "address"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CollateralDeposited",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "amount", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "MUSDMinted",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "amount", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "MUSDRepaid",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "amount", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "CardCreated",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "cardNumber", "type": "string", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "CardSpending",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "amount", "type": "uint256", "indexed": false},
      {"name": "merchant", "type": "string", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "CardFrozen",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "frozen", "type": "bool", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "PositionLiquidated",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "collateralLiquidated", "type": "uint256", "indexed": false},
      {"name": "debtRepaid", "type": "uint256", "indexed": false}
    ]
  }
] as const

export const MUSD_ABI = [
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{"name": "account", "type": "address"}],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {"name": "from", "type": "address"},
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  }
] as const