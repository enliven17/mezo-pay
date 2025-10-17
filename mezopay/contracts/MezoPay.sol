// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IMUSD is IERC20 {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

contract MezoPay is ReentrancyGuard, Ownable {
    IMUSD public immutable musd;
    
    // Constants
    uint256 public constant MINIMUM_COLLATERAL_RATIO = 150; // 150%
    uint256 public constant LIQUIDATION_THRESHOLD = 110; // 110%
    uint256 public constant ANNUAL_INTEREST_RATE = 100; // 1% (in basis points)
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    struct CreditLine {
        uint256 collateralAmount; // BTC amount in wei
        uint256 musdMinted; // MUSD borrowed
        uint256 lastInterestUpdate; // Timestamp of last interest calculation
        uint256 accruedInterest; // Accumulated interest
        bool isActive;
        string cardNumber; // Virtual card number (encrypted)
        bool cardFrozen;
    }
    
    struct VirtualCard {
        string cardNumber;
        string expiryDate;
        string cvv;
        string holderName;
        uint256 dailyLimit;
        uint256 monthlyLimit;
        uint256 dailySpent;
        uint256 monthlySpent;
        uint256 lastDayReset;
        uint256 lastMonthReset;
        bool isActive;
    }
    
    mapping(address => CreditLine) public creditLines;
    mapping(address => VirtualCard) public virtualCards;
    mapping(address => uint256[]) public transactionHistory;
    
    // Events
    event CollateralDeposited(address indexed user, uint256 amount);
    event MUSDMinted(address indexed user, uint256 amount);
    event MUSDRepaid(address indexed user, uint256 amount);
    event CardCreated(address indexed user, string cardNumber);
    event CardSpending(address indexed user, uint256 amount, string merchant);
    event CardFrozen(address indexed user, bool frozen);
    event PositionLiquidated(address indexed user, uint256 collateralLiquidated, uint256 debtRepaid);
    
    constructor(address _musd) Ownable(msg.sender) {
        musd = IMUSD(_musd);
    }
    
    // Deposit BTC as collateral
    function depositCollateral() external payable nonReentrant {
        require(msg.value > 0, "Must deposit some BTC");
        
        CreditLine storage creditLine = creditLines[msg.sender];
        creditLine.collateralAmount += msg.value;
        creditLine.isActive = true;
        creditLine.lastInterestUpdate = block.timestamp;
        
        emit CollateralDeposited(msg.sender, msg.value);
    }
    
    // Mint MUSD against collateral
    function mintMUSD(uint256 musdAmount) external nonReentrant {
        CreditLine storage creditLine = creditLines[msg.sender];
        require(creditLine.isActive, "No active credit line");
        
        // Update accrued interest
        _updateInterest(msg.sender);
        
        uint256 totalDebt = creditLine.musdMinted + creditLine.accruedInterest + musdAmount;
        uint256 collateralValue = _getCollateralValue(creditLine.collateralAmount);
        uint256 collateralRatio = (collateralValue * 100) / totalDebt;
        
        require(collateralRatio >= MINIMUM_COLLATERAL_RATIO, "Insufficient collateral ratio");
        
        creditLine.musdMinted += musdAmount;
        
        // Create virtual card if first mint
        if (bytes(virtualCards[msg.sender].cardNumber).length == 0) {
            _createVirtualCard(msg.sender);
        }
        
        // Note: In production, this would integrate with Mezo's MUSD minting protocol
        // For demo purposes, we track the minted amount in contract state
        // Real MUSD minting would happen through Mezo's lending protocol
        
        emit MUSDMinted(msg.sender, musdAmount);
    }
    
    // Repay MUSD debt
    function repayMUSD(uint256 musdAmount) external nonReentrant {
        CreditLine storage creditLine = creditLines[msg.sender];
        require(creditLine.isActive, "No active credit line");
        
        _updateInterest(msg.sender);
        
        uint256 totalDebt = creditLine.musdMinted + creditLine.accruedInterest;
        require(musdAmount <= totalDebt, "Repay amount exceeds debt");
        
        // Note: In production, this would burn MUSD through Mezo protocol
        // For demo purposes, we just update the accounting
        
        // Apply repayment (interest first, then principal)
        if (musdAmount >= creditLine.accruedInterest) {
            uint256 principalRepayment = musdAmount - creditLine.accruedInterest;
            creditLine.accruedInterest = 0;
            creditLine.musdMinted -= principalRepayment;
        } else {
            creditLine.accruedInterest -= musdAmount;
        }
        
        emit MUSDRepaid(msg.sender, musdAmount);
    }
    
    // Spend using virtual card
    function spendWithCard(uint256 amount, string memory merchant) external nonReentrant {
        VirtualCard storage card = virtualCards[msg.sender];
        require(card.isActive, "Card not active");
        require(!card.isActive == false, "Card is frozen");
        
        _resetLimitsIfNeeded(msg.sender);
        
        require(card.dailySpent + amount <= card.dailyLimit, "Daily limit exceeded");
        require(card.monthlySpent + amount <= card.monthlyLimit, "Monthly limit exceeded");
        
        CreditLine storage creditLine = creditLines[msg.sender];
        uint256 availableCredit = _getAvailableCredit(msg.sender);
        require(amount <= availableCredit, "Insufficient credit");
        
        // Update spending limits
        card.dailySpent += amount;
        card.monthlySpent += amount;
        
        // Deduct from available MUSD balance
        creditLine.musdMinted += amount;
        
        emit CardSpending(msg.sender, amount, merchant);
    }
    
    // Freeze/unfreeze card
    function freezeCard(bool freeze) external {
        VirtualCard storage card = virtualCards[msg.sender];
        require(bytes(card.cardNumber).length > 0, "No card exists");
        
        card.isActive = !freeze;
        emit CardFrozen(msg.sender, freeze);
    }
    
    // Close position and withdraw collateral
    function closePosition() external nonReentrant {
        CreditLine storage creditLine = creditLines[msg.sender];
        require(creditLine.isActive, "No active position");
        
        _updateInterest(msg.sender);
        
        uint256 totalDebt = creditLine.musdMinted + creditLine.accruedInterest;
        // Note: In production, user would need to repay MUSD debt
        // For demo purposes, we allow closing position without MUSD repayment
        // if (totalDebt > 0) {
        //     require(musd.transferFrom(msg.sender, address(this), totalDebt), "Must repay all debt");
        // }
        
        uint256 collateralToReturn = creditLine.collateralAmount;
        
        // Reset credit line
        creditLine.collateralAmount = 0;
        creditLine.musdMinted = 0;
        creditLine.accruedInterest = 0;
        creditLine.isActive = false;
        
        // Return collateral
        payable(msg.sender).transfer(collateralToReturn);
    }
    
    // Liquidate undercollateralized position
    function liquidate(address user) external nonReentrant {
        CreditLine storage creditLine = creditLines[user];
        require(creditLine.isActive, "No active position");
        
        _updateInterest(user);
        
        uint256 totalDebt = creditLine.musdMinted + creditLine.accruedInterest;
        uint256 collateralValue = _getCollateralValue(creditLine.collateralAmount);
        uint256 collateralRatio = (collateralValue * 100) / totalDebt;
        
        require(collateralRatio < LIQUIDATION_THRESHOLD, "Position not liquidatable");
        
        // Liquidation logic (simplified)
        uint256 liquidationReward = (creditLine.collateralAmount * 5) / 1000; // 0.5%
        uint256 remainingCollateral = creditLine.collateralAmount - liquidationReward;
        
        // Reset position
        creditLine.collateralAmount = 0;
        creditLine.musdMinted = 0;
        creditLine.accruedInterest = 0;
        creditLine.isActive = false;
        
        // Pay liquidator
        payable(msg.sender).transfer(liquidationReward);
        
        emit PositionLiquidated(user, remainingCollateral, totalDebt);
    }
    
    // Internal functions
    function _updateInterest(address user) internal {
        CreditLine storage creditLine = creditLines[user];
        if (creditLine.musdMinted == 0) return;
        
        uint256 timeElapsed = block.timestamp - creditLine.lastInterestUpdate;
        uint256 interestAccrued = (creditLine.musdMinted * ANNUAL_INTEREST_RATE * timeElapsed) / 
                                 (BASIS_POINTS * SECONDS_PER_YEAR);
        
        creditLine.accruedInterest += interestAccrued;
        creditLine.lastInterestUpdate = block.timestamp;
    }
    
    function _createVirtualCard(address user) internal {
        VirtualCard storage card = virtualCards[user];
        
        // Generate card details (in production, use secure random generation)
        card.cardNumber = _generateCardNumber(user);
        card.expiryDate = "12/28";
        card.cvv = "123";
        card.holderName = "MEZOPAY USER";
        card.dailyLimit = 2500 * 1e18; // $2,500
        card.monthlyLimit = 25000 * 1e18; // $25,000
        card.isActive = true;
        card.lastDayReset = block.timestamp;
        card.lastMonthReset = block.timestamp;
        
        emit CardCreated(user, card.cardNumber);
    }
    
    function _generateCardNumber(address user) internal pure returns (string memory) {
        // Simple card number generation (not secure for production)
        uint256 hash = uint256(keccak256(abi.encodePacked(user)));
        return string(abi.encodePacked("4532", _uint2str(hash % 10000000000000000)));
    }
    
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    function _getCollateralValue(uint256 btcAmount) internal view returns (uint256) {
        // In production, use Chainlink or other oracle
        // For demo, assume 1 BTC = $30,000
        return (btcAmount * 30000) / 1e18;
    }
    
    function _getAvailableCredit(address user) internal view returns (uint256) {
        CreditLine storage creditLine = creditLines[user];
        uint256 collateralValue = _getCollateralValue(creditLine.collateralAmount);
        uint256 maxBorrow = (collateralValue * 100) / MINIMUM_COLLATERAL_RATIO;
        uint256 currentDebt = creditLine.musdMinted + creditLine.accruedInterest;
        
        return maxBorrow > currentDebt ? maxBorrow - currentDebt : 0;
    }
    
    function _resetLimitsIfNeeded(address user) internal {
        VirtualCard storage card = virtualCards[user];
        
        // Reset daily limit
        if (block.timestamp >= card.lastDayReset + 1 days) {
            card.dailySpent = 0;
            card.lastDayReset = block.timestamp;
        }
        
        // Reset monthly limit
        if (block.timestamp >= card.lastMonthReset + 30 days) {
            card.monthlySpent = 0;
            card.lastMonthReset = block.timestamp;
        }
    }
    
    // View functions
    function getCreditLineInfo(address user) external view returns (
        uint256 collateralAmount,
        uint256 musdMinted,
        uint256 accruedInterest,
        uint256 collateralRatio,
        uint256 availableCredit,
        bool isActive
    ) {
        CreditLine storage creditLine = creditLines[user];
        
        collateralAmount = creditLine.collateralAmount;
        musdMinted = creditLine.musdMinted;
        
        // Calculate current interest
        uint256 timeElapsed = block.timestamp - creditLine.lastInterestUpdate;
        uint256 currentInterest = creditLine.accruedInterest;
        if (creditLine.musdMinted > 0) {
            currentInterest += (creditLine.musdMinted * ANNUAL_INTEREST_RATE * timeElapsed) / 
                              (BASIS_POINTS * SECONDS_PER_YEAR);
        }
        accruedInterest = currentInterest;
        
        uint256 totalDebt = musdMinted + accruedInterest;
        if (totalDebt > 0) {
            uint256 collateralValue = _getCollateralValue(collateralAmount);
            collateralRatio = (collateralValue * 100) / totalDebt;
        } else {
            collateralRatio = 0;
        }
        
        availableCredit = _getAvailableCredit(user);
        isActive = creditLine.isActive;
    }
    
    function getVirtualCardInfo(address user) external view returns (
        string memory cardNumber,
        string memory expiryDate,
        string memory cvv,
        string memory holderName,
        uint256 dailyLimit,
        uint256 monthlyLimit,
        uint256 dailySpent,
        uint256 monthlySpent,
        bool isActive
    ) {
        VirtualCard storage card = virtualCards[user];
        
        return (
            card.cardNumber,
            card.expiryDate,
            card.cvv,
            card.holderName,
            card.dailyLimit,
            card.monthlyLimit,
            card.dailySpent,
            card.monthlySpent,
            card.isActive
        );
    }
}