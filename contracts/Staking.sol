// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.17;


import "./BlueToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {StakingLibrary} from "./StakingLibrary.sol";


contract Staking {

    using SafeERC20 for IERC20Metadata;

    BlueToken public token;

    // Rate BLK/ETH : 100 BLK = 1 ETH or 1 BLK = 10^16 WEI
    uint public rate = 200;

    // Total value locked in the contract in Wei
    uint public TVL = 0;

    // List of stakers address
    address [] private Stakers;

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
    
    function Reward(address _staker, uint _amountTokenStakedinEther ) internal returns(uint){

        // The reward has to be proportional to the TVL in the contract
        uint rewardBLT = (_amountTokenStakedinEther*_amountTokenStakedinEther*rate)/TVL;
        token.transfer(_staker, rewardBLT);
        
        emit reward(_staker, rewardBLT);

        return rewardBLT;
    }

    //Investors can stake any amount of an ERC20 token
    function Stake(address _token, uint256 _amount, address _priceFeedContract) external returns(uint) {
        require(IERC20(_token).balanceOf(msg.sender) > _amount, "You don't have enough tokens");
        // Send the token of the staker to the contract Staking
        IERC20Metadata(_token).safeTransferFrom(msg.sender, address(this), _amount);
        
        // Add the new Position to the PositionsList or only updates the amount
        // if a Position has been already created for this token
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(PositionsList[msg.sender], _token);
        if (indexTokenStaked != PositionsList[msg.sender].length) {
            //The Position of the staker is updated with new amount of token staked
            PositionsList[msg.sender][indexTokenStaked].liquidity += _amount;
        }
        else {
            //A new Position is created for this staker
            PositionsList[msg.sender].push(StakingLibrary.Position(_token, _amount, 0));
        }

        // Update the TVL with the token just staked
        uint amountTokenStakedinEther;
        amountTokenStakedinEther = uint(StakingLibrary.getLatestPrice(_priceFeedContract)) * _amount/ 10**IERC20Metadata(_token).decimals();

        // Update the TVL by token
        TVLtoken[_token] += _amount;
        TVLtokeninEther[_token] += amountTokenStakedinEther;

        //Reward the staker and update the TVL of the staking contract
        uint rewardBLT = Reward(msg.sender, amountTokenStakedinEther);

        // Update the total reward earned by token
        TotalRewardtoken[_token] += rewardBLT;

        //Update reward amount for this position
        PositionsList[msg.sender][indexTokenStaked].rewardBLT += rewardBLT;
        // Update the TVL
        TVL += amountTokenStakedinEther;

        //Event log position staked
        emit stake(msg.sender, _token, _amount);

        return rewardBLT;
        
    }

    function UnstakePosition(address _token, uint256 _amount, address _priceFeedContract ) external returns(uint){
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(PositionsList[msg.sender], _token);

        require(PositionsList[msg.sender].length > 0, "You don't have any tokens staked");     
        require(PositionsList[msg.sender].length != indexTokenStaked, "You don't have this token staked");
        require(PositionsList[msg.sender][indexTokenStaked].liquidity >= _amount, "Your unstake amount is greater than the token staked amount !");

        // Unstake staking position 
        IERC20Metadata(_token).safeTransfer(msg.sender, _amount);

        // Updates the PositionsList
        if (PositionsList[msg.sender][indexTokenStaked].liquidity == _amount) {
            // Erase staking position 
            PositionsList[msg.sender][indexTokenStaked] =  StakingLibrary.Position(address(0),  0, 0);

        } else PositionsList[msg.sender][indexTokenStaked].liquidity -= _amount;

        // Update the TVL with the token just unstaked
        uint amountTokenUnstakedinEther = uint(StakingLibrary.getLatestPrice(_priceFeedContract)) * _amount/ 10**IERC20Metadata(_token).decimals();
        // Update the TVL by token
        TVLtoken[_token] -= _amount;
        TVLtokeninEther[_token] -= amountTokenUnstakedinEther;

        // Update the TVL
        TVL -= amountTokenUnstakedinEther;

        emit unStake(msg.sender, _token, _amount);

        return amountTokenUnstakedinEther;

    }

    function getAllPositions() public view returns (StakingLibrary.Position [] memory) {
        return PositionsList[msg.sender];
    }

    function getPosition(address _caller, address _token)  public view returns(address, uint, uint) {
        require(_caller == msg.sender, "It's not your account !!");

        uint indexToken = StakingLibrary.getIndexTokenStaked(PositionsList[_caller], _token);
         if(PositionsList[_caller].length == indexToken){
            return (address(0),0,0);
        
        } else  return (_token, PositionsList[_caller][indexToken].liquidity, PositionsList[_caller][indexToken].rewardBLT);
        
    }

    receive() external payable {
        
    }

}