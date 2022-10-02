// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.17;


import "./BlueToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {StakingLibrary} from "./StakingLibrary.sol";

/*
Pour éviter de créer une fonction getindex il est préférable de créer PositionList de la manière suivante
mapping(address staker => mapping (address token => StakingLibrary.Position ))

Faire un claim reward toutes les minutes en se basant sur le timestamp

Dans la fonction stake vérifier que le token passé en argument est bien un ERC20 token

*/

contract Staking {

    using SafeERC20 for IERC20Metadata;

    BlueToken public token;

    // Rate BLK/ETH : 100 BLK = 1 ETH or 1 BLK = 10^16 WEI
    uint public rate = 200;

    // Total value locked in the contract in Wei
    uint public TVL = 0;

    // Reward = 5% of amount staked in ether
    uint public REWARD_RATE = 5;

    uint public rewardFrequency = 1 minutes;

    // TVL (in ether) by token
    mapping(address => uint) public TVLtokeninEther;

    // TVL (in ERC20) by token
    mapping(address => uint) public TVLtoken;

    // Total reward (in BLT) earned by token
    mapping(address => uint) public TotalRewardtoken;

    // List of Positions attached to the staker address
    mapping (address => StakingLibrary.Position[]) private PositionsList;

    // staking event
    event stake(address staker, address token, uint amount);
    event unStake(address staker, address token, uint amount);
    event reward(address staker, uint amount);


    // Constructor mint reward's token and send them to staking contract
    constructor(uint256 initialSupply, address _tokenReward){
        //token = new BlueToken(initialSupply);
        token = BlueToken(_tokenReward);
        TVL = (initialSupply/rate);  
        
    }

    //Reward the staker with Blue Token 

    /*
    Cas 1 : Le staker 

    */

    function getReward(address _token, address _priceFeedContract, uint _amount, uint startStakingTime) public view returns(uint) {
        if(_amount > 0){
            uint amountinEther;
            amountinEther = uint(StakingLibrary.getLatestPrice(_priceFeedContract)) * _amount/ 10**IERC20Metadata(_token).decimals();

            uint rewardBLT = ((amountinEther*rate)*REWARD_RATE/100) * ((block.timestamp - startStakingTime)/rewardFrequency);

            return rewardBLT;

        } else return 0;

    }
    
    function updateCurrentReward(address _staker, address _priceFeedContract, uint _indexTokenStaked ) internal{

        // Get past reward since the last update current Reward
        uint pastRewardBLT = getReward(PositionsList[_staker][_indexTokenStaked].token, _priceFeedContract, PositionsList[_staker][_indexTokenStaked].liquidity, PositionsList[_staker][_indexTokenStaked].lastUpdateReward);
      
        // Update current Reward in BLT and last update reward
        PositionsList[_staker][_indexTokenStaked].currentRewardBLT += pastRewardBLT;
        PositionsList[_staker][_indexTokenStaked].lastUpdateReward = block.timestamp;

    }

    function claimReward(address _token, address _priceFeedContract) external returns(uint) {

        // Get index Token Staked
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(PositionsList[msg.sender], _token);

        require(PositionsList[msg.sender].length > 0, "You don't have any tokens staked");     
        require(PositionsList[msg.sender].length != indexTokenStaked, "You don't have this token staked");
        require(block.timestamp -  PositionsList[msg.sender][indexTokenStaked].lastClaimReward >= rewardFrequency, "You cannot claim reward yet, the staking period is not over");
        

        // Update current reward to get the reward to send
        updateCurrentReward(msg.sender, _priceFeedContract, indexTokenStaked);

        // Pay reward
        uint rewardBLT = PositionsList[msg.sender][indexTokenStaked].currentRewardBLT;
        token.transfer(msg.sender, rewardBLT);

        // Reset to zero current Reward
        PositionsList[msg.sender][indexTokenStaked].currentRewardBLT = 0;

        // Update last claim reward
        PositionsList[msg.sender][indexTokenStaked].lastClaimReward = block.timestamp;

        //Update paid reward amount for this position
        PositionsList[msg.sender][indexTokenStaked].paidRewardBLT += rewardBLT;

        // Update the total reward earned by token
        TotalRewardtoken[_token] += rewardBLT;
        
        // Log reward 
        emit reward(msg.sender, rewardBLT);

        return rewardBLT;
    }

    //Investors can stake any amount of an ERC20 token
    function Stake(address _token, uint256 _amount, address _priceFeedContract) external {

        require(_amount != 0, "You cannot stake zero amount !");
        require(IERC20Metadata(_token).balanceOf(msg.sender) > _amount, "You don't have enough tokens");
        // Send the token of the staker to the contract Staking
        IERC20Metadata(_token).safeTransferFrom(msg.sender, address(this), _amount); 
        
        // Add the new Position to the PositionsList or only updates the amount
        // if a Position has been already created for this token
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(PositionsList[msg.sender], _token);
        if (indexTokenStaked != PositionsList[msg.sender].length) {
            //Update current reward before update liquidity
            updateCurrentReward(msg.sender, _priceFeedContract , indexTokenStaked);

            //The Position of the staker is updated with new amount of token staked
            PositionsList[msg.sender][indexTokenStaked].liquidity += _amount;
        }
        else {
            //A new Position is created for this staker
            PositionsList[msg.sender].push(StakingLibrary.Position(_token, _amount, 0, 0, block.timestamp, block.timestamp));
        }

        // Update the TVL with the token just staked
        uint amountTokenStakedinEther;
        amountTokenStakedinEther = uint(StakingLibrary.getLatestPrice(_priceFeedContract)) * _amount/ 10**IERC20Metadata(_token).decimals();
    
        // Update the TVL by token
        TVLtoken[_token] += _amount;
        TVLtokeninEther[_token] += amountTokenStakedinEther;
 
        // Update the TVL
        TVL += amountTokenStakedinEther;

        //Log position staked
        emit stake(msg.sender, _token, _amount);
        
    }

    function UnstakePosition(address _token, uint256 _amount, address _priceFeedContract ) external returns(uint){
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(PositionsList[msg.sender], _token);

        require(PositionsList[msg.sender].length > 0, "You don't have any tokens staked");     
        require(PositionsList[msg.sender].length != indexTokenStaked, "You don't have this token staked");
        require(PositionsList[msg.sender][indexTokenStaked].liquidity >= _amount, "Your unstake amount is greater than the token staked amount !");

        // Unstake staking position 
        IERC20Metadata(_token).safeTransfer(msg.sender, _amount);

        //Update current reward before update liquidity
        updateCurrentReward(msg.sender,  _priceFeedContract, indexTokenStaked );

        // Updates the PositionsList
        if (PositionsList[msg.sender][indexTokenStaked].liquidity == _amount) {
            // Erase staking position 
            PositionsList[msg.sender][indexTokenStaked] =  StakingLibrary.Position(address(0),  0, 0, 0, 0, 0);

        } else PositionsList[msg.sender][indexTokenStaked].liquidity -= _amount;

        // Update the TVL with the token just unstaked
        uint amountTokenUnstakedinEther = uint(StakingLibrary.getLatestPrice(_priceFeedContract)) * _amount/ 10**IERC20Metadata(_token).decimals();

        // Update the TVL by token
        TVLtoken[_token] -= _amount;
        TVLtokeninEther[_token] -= amountTokenUnstakedinEther;

        // Update the TVL
        TVL -= amountTokenUnstakedinEther;

        // Log unstake
        emit unStake(msg.sender, _token, _amount);

        return amountTokenUnstakedinEther;

    }

    function getPosition(address _token)  public view returns(address, uint, uint, uint, uint, uint) {
        uint indexToken = StakingLibrary.getIndexTokenStaked(PositionsList[msg.sender], _token);
         if(PositionsList[msg.sender].length == indexToken){
            return (address(0),0,0,0,0,0);
        
        } else  return (_token, PositionsList[msg.sender][indexToken].liquidity, 
        PositionsList[msg.sender][indexToken].paidRewardBLT, PositionsList[msg.sender][indexToken].currentRewardBLT, 
        PositionsList[msg.sender][indexToken].lastUpdateReward ,
        PositionsList[msg.sender][indexToken].lastClaimReward);
        
    }

    receive() external payable {
        
    }

}