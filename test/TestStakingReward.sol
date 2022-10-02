// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.17;

import "../contracts/Staking.sol";
import "../contracts/BlueToken.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "truffle/Assert.sol";

contract TestStakingReward is Staking (1000*10**18, address(new BlueToken(1000*10**18))) {

    address staker = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    // DAI
    address tokenDAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address priceFeedContractDAI = 0x773616E4d11A78F511299002da57A0a94577F1f4;
    uint amountDAI = 100 * 10**IERC20Metadata(tokenDAI).decimals();

    // USDT
    address tokenUSDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address priceFeedContractUSDT = 0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46;
    uint amountUSDT = 80 * 10**IERC20Metadata(tokenUSDT).decimals();

    
    function testgetReward() public {
        
        // Calculate the reward expected
        uint amountinEtherDAI;
        amountinEtherDAI = uint(StakingLibrary.getLatestPrice(priceFeedContractDAI)) * amountDAI/ 10**IERC20Metadata(tokenDAI).decimals();

        uint amountinEtherUSDT;
        amountinEtherUSDT = uint(StakingLibrary.getLatestPrice(priceFeedContractUSDT)) * amountUSDT/ 10**IERC20Metadata(tokenUSDT).decimals();

        // Calculate reward expected
        uint rewardBLTExpectedDAI = (amountinEtherDAI*rate)*REWARD_RATE/100;
        uint rewardBLTExpectedUSDT = (amountinEtherUSDT*rate)*REWARD_RATE/100;

        //get Reward for DAI et USDT
        uint rewardBLTDAI = getReward(tokenDAI, priceFeedContractDAI, amountDAI, block.timestamp - rewardFrequency);
        uint rewardBLTUSDT = getReward(tokenUSDT, priceFeedContractUSDT, amountUSDT, block.timestamp - rewardFrequency);

        Assert.equal(rewardBLTDAI, rewardBLTExpectedDAI, "it should return 5% of DAI amount in BLT token");
        Assert.equal(rewardBLTUSDT, rewardBLTExpectedUSDT, "it should return 5% of USDT amount in BLT token");
    }

        function testupdateCurrentReward() public {

        //Initialize positions
        PositionsList[staker].push(StakingLibrary.Position(tokenDAI, amountDAI, 0, 0, block.timestamp - rewardFrequency, 0));
        PositionsList[staker].push(StakingLibrary.Position(tokenUSDT, amountUSDT, 0, 0, block.timestamp - rewardFrequency, 0));

        // Current reward expected 
        uint currentRewardBLTExpectedDAI = getReward(tokenDAI, priceFeedContractDAI, amountDAI, PositionsList[staker][0].lastUpdateReward);
        uint currentRewardBLTExpectedUSDT = getReward(tokenUSDT, priceFeedContractUSDT, amountUSDT, PositionsList[staker][1].lastUpdateReward);

        // Update current Reward for DAI et USDT
        updateCurrentReward(staker, priceFeedContractDAI , 0);
        updateCurrentReward(staker, priceFeedContractUSDT , 1);

        // Verify position currentRewardBLT for DAI et USDT
        Assert.equal(PositionsList[staker][0].currentRewardBLT, currentRewardBLTExpectedDAI, "it should return 5% of DAI amount in BLT token for current Reward");
        Assert.equal(PositionsList[staker][1].currentRewardBLT, currentRewardBLTExpectedUSDT, "it should return 5% of USDT amount in BLT token for current Reward");

        // Verify position lastUpdateReward for DAI et USDT
        Assert.equal(PositionsList[staker][0].lastUpdateReward, block.timestamp, "it should return block.timestamp (DAI)");
        Assert.equal(PositionsList[staker][1].lastUpdateReward, block.timestamp, "it should return block.timestamp (USDT)");
    }
}