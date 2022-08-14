// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.16;


import "./BlueToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PriceConsumer.sol";
import {StakingLibrary} from "./StakingLibrary.sol";

//import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

//Créer un smart contract à part pour le token ALYRA, faire comme le TP crowdsale
contract Staking {

    using SafeERC20 for IERC20;

    BlueToken public token;

    //Rate BLK/ETH : 100 BLK = 1 ETH or 1 BLK = 10^16 WEI
    uint public rate = 200;

    //Total value locked in the contract in Wei
    uint public TVL = 0;

    //List of stakers address
    address [] private Stakers;

    //List of deposits attached to the staker address
    mapping (address => StakingLibrary.Deposit[]) private DepositListStaker;

    //staking event
    event stake(address staker, address token, uint amount);
    event unStake(address staker, address token, uint amount);
    event reward(address staker, uint amount);


    //Constructor mint reward's token and send them to staking contract
    constructor(uint256 initialSupply){
        token = new BlueToken(initialSupply);
        TVL = initialSupply/200; 
    }


    //Return the token's index in the DepositListStaker, if not found MAX_TOKEN_PER_STAKER is returned
    /*function getIndexTokenStaked(Deposit[] memory _depositList, address _token) public pure returns (uint) {
        this.g
        for (uint index = 0; index < _depositList.length; index++) {
            if (_depositList[index].token == _token){
               return index;
            }
        }
        return _depositList.length;
    }*/

    /*function getIndexTokenStaked(address _staker, address _token) public view returns (uint) {

        for (uint index = 0; index < DepositListStaker[_staker].length; index++) {
            if (DepositListStaker[_staker][index].token == _token){
               return index;
            }
        }
        return DepositListStaker[_staker].length;
    }*/


    //Reward the staker with Blue Token 
    function Reward(address _staker, uint TVLToken ) internal {

        //The reward has to be proportional to the TVL in the contract
        uint rewardBLT = (TVLToken*200)/TVL;
        IERC20(address(token)).safeTransfer(_staker, rewardBLT);

        emit reward(_staker, rewardBLT);
        
    }

    //Investors can stake any amount of an ERC20 token
    function Stake(address _token, uint256 _amount, address _priceFeedContract) external {
        require(_amount >= 0.1 ether, "you can't stake less than 0.1 ether");

        //Init instance of the contract which will retrieve price of the token in Wei
        

        //Send the token of the staker to the contract Staking
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        //Check if the staker already stakes this token
       
        //msg.sender.sender.getIndexTokenStaked(DepositListStaker[msg.sender], _token);
        
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(DepositListStaker[msg.sender], _token);
        
        //Add the new deposit to the DepositListStaker or 
        //only updates the amount if a deposit has been already done for this token
        if (indexTokenStaked != DepositListStaker[msg.sender].length) {
            //The deposit of the staker is updated with new amount of token staked
            DepositListStaker[msg.sender][indexTokenStaked].liquidity += _amount;
        }

        else {
            //A new deposit is created for this staker
            DepositListStaker[msg.sender].push(StakingLibrary.Deposit({token : _token, liquidity : _amount}));
        }

        //Update the TVL with the token just staked
        uint TVLToken = uint(StakingLibrary.getLatestPrice(_priceFeedContract)) * _amount;
        TVL += TVLToken;

        //Event log position staked
        emit stake(msg.sender, _token, _amount);

        Reward(msg.sender, TVLToken);
    }

    function UnstakePosition(address _token, uint256 _amount, address _priceFeedContract ) external {
        require(DepositListStaker[msg.sender].length > 0, "You don't have any tokens staked");
        
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(DepositListStaker[msg.sender], _token);
        require(DepositListStaker[msg.sender].length != indexTokenStaked, "You don't stake this token");
        require(DepositListStaker[msg.sender][indexTokenStaked].liquidity < _amount, "You don't) have that many tokens staked");

        PriceConsumer priceFeed = PriceConsumer(_priceFeedContract);

        //Unstake staking position 
        IERC20(_token).safeTransfer(msg.sender, _amount);

        //Updates the DepositListStaker
        if (DepositListStaker[msg.sender][indexTokenStaked].liquidity == _amount) {
            //Erase staking position 
            DepositListStaker[msg.sender][indexTokenStaked] =  StakingLibrary.Deposit({token : address(0), liquidity : 0});

        } else DepositListStaker[msg.sender][indexTokenStaked].liquidity -= _amount;

        //Update the TVL with the token just unstaked
        uint TVLToken = uint(priceFeed.getLatestPrice()) * _amount;
        TVL -= TVLToken;

        emit unStake(msg.sender, _token, _amount);

    }

    /*function getDeposit(address _staker) public view returns (Deposit [] memory) {
        return DepositListStaker[_staker];
    }*/

    receive() external payable {

    }

}