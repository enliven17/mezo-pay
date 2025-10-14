export const MEZOPAY_ABI = [
  // View functions
  "function getCreditLineInfo(address user) external view returns (uint256 collateralAmount, uint256 musdMinted, uint256 accruedInterest, uint256 collateralRatio, uint256 availableCredit, bool isActive)",
  "function getVirtualCardInfo(address user) external view returns (string memory cardNumber, string memory expiryDate, string memory cvv, string memory holderName, uint256 dailyLimit, uint256 monthlyLimit, uint256 dailySpent, uint256 monthlySpent, bool isActive)",
  
  // Write functions
  "function depositCollateral() external payable",
  "function mintMUSD(uint256 musdAmount) external",
  "function repayMUSD(uint256 musdAmount) external",
  "function spendWithCard(uint256 amount, string memory merchant) external",
  "function freezeCard(bool freeze) external",
  "function closePosition() external",
  "function liquidate(address user) external",
  
  // Events
  "event CollateralDeposited(address indexed user, uint256 amount)",
  "event MUSDMinted(address indexed user, uint256 amount)",
  "event MUSDRepaid(address indexed user, uint256 amount)",
  "event CardCreated(address indexed user, string cardNumber)",
  "event CardSpending(address indexed user, uint256 amount, string merchant)",
  "event CardFrozen(address indexed user, bool frozen)",
  "event PositionLiquidated(address indexed user, uint256 collateralLiquidated, uint256 debtRepaid)"
] as const

export const MUSD_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
] as const