// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.16;

import "../contracts/Staking.sol";
import "truffle/Assert.sol";

contract TestStakingReward is Staking (1000*10**18) {

    uint public amountTokenStakedinEther = 2 ether;
    address staker = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    function testReward() public {
        uint rewardBLTExpected = (amountTokenStakedinEther*rate/TVL);

        //Retrieve balance of BLT token before reward, for the staking contract and the staker
        uint balanceStakerBeforeRewardtoken = token.balanceOf(staker);
        uint balanceContractBeforeRewardtoken = token.balanceOf(address(this));

        //Execute Reward function
        Reward(staker, amountTokenStakedinEther);

        //Retrieve balance of BLT token before reward, for the staking contract and the staker
        uint balanceContractAfterRewardtoken = token.balanceOf(address(this));
        uint balanceStakerAfterRewardtoken = token.balanceOf(staker);
        
        
        Assert.equal(balanceContractAfterRewardtoken, balanceContractBeforeRewardtoken - rewardBLTExpected, "it should return 920 BLT token left for Staking contract");
        Assert.equal(balanceStakerAfterRewardtoken, balanceStakerBeforeRewardtoken + rewardBLTExpected, "it should return 80 BLT token for the balance of the staker");
    }
}