// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;


import "../contracts/StakingLibrary.sol";
import "truffle/Assert.sol";

contract TestStakingLibrary {

    StakingLibrary.Position[] public tabPositions;

    function testgetIndexTokenStaked() public {

        uint result;

        //Initialize positions
        StakingLibrary.Position memory PositionWETH = StakingLibrary.Position(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, 10, 0);
        StakingLibrary.Position memory PositionLINK = StakingLibrary.Position(0x514910771AF9Ca656af840dff83E8264EcF986CA, 90, 0);
        StakingLibrary.Position memory PositionMANA = StakingLibrary.Position(0x0F5D2fB29fb7d3CFeE444a200298f468908cC942, 50, 0);
        StakingLibrary.Position memory PositionUSDT = StakingLibrary.Position(0xdAC17F958D2ee523a2206206994597C13D831ec7, 90, 0);

        tabPositions.push(PositionWETH);
        tabPositions.push(PositionLINK);
        tabPositions.push(PositionMANA);
        tabPositions.push(PositionUSDT);


        //Test when the staker have positions but no position for this token
        result = StakingLibrary.getIndexTokenStaked(tabPositions, 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);
        Assert.equal(result, 4, "It sould return 6 when the staker have no position staked for this token");

        //Test when the staker have positions for this token
        result = StakingLibrary.getIndexTokenStaked(tabPositions, 0x514910771AF9Ca656af840dff83E8264EcF986CA);
        Assert.equal(result, 1, "It should return the index of the token staked (index = 2)");
    }

    
}