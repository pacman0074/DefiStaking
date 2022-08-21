
// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.16;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library StakingLibrary {

    //This structure represents a staking position
    struct Position {
        address token;
        uint256 liquidity;
    }

    function getLatestPrice(address priceFeedContract) public view returns (int) {
        AggregatorV3Interface  priceFeed = AggregatorV3Interface(priceFeedContract);
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }


    function getIndexTokenStaked(Position[] memory _deposits, address _token) public pure returns (uint) {

        for (uint index = 0; index < _deposits.length; index++) {
            if (_deposits[index].token == _token && _deposits[index].liquidity != 0){
               return index;
            }
        }
        return _deposits.length;
    }
}
