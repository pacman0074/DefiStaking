// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.16;


import "./BlueToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {StakingLibrary} from "./StakingLibrary.sol";



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

    //List of Positions attached to the staker address
    mapping (address => StakingLibrary.Position[]) private PositionsList;

    //staking event
    event stake(address staker, address token, uint amount);
    event unStake(address staker, address token, uint amount);
    event reward(address staker, uint amount);


    //Constructor mint reward's token and send them to staking contract
    constructor(uint256 initialSupply){
        token = new BlueToken(initialSupply);
        TVL = initialSupply/200; 
        
    }

    //Reward the staker with Blue Token 
    
    function Reward(address _staker, uint _amountTokenStakedinEther ) internal returns (uint) {

        //The reward has to be proportional to the TVL in the contract
        uint rewardBLT = (_amountTokenStakedinEther*200)/TVL;
        IERC20(address(token)).safeTransfer(_staker, rewardBLT);
        
        emit reward(_staker, rewardBLT);

        return rewardBLT;
        
    }

    //Investors can stake any amount of an ERC20 token
    function Stake(address _token, uint256 _amount, address _priceFeedContract) external payable {
        //Send the token of the staker to the contract Staking
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        
        //Add the new Position to the PositionsList or only updates the amount
        //if a Position has been already done for this token
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(PositionsList[msg.sender], _token);
        if (indexTokenStaked != PositionsList[msg.sender].length) {
            //The Position of the staker is updated with new amount of token staked
            PositionsList[msg.sender][indexTokenStaked].liquidity += _amount;
        }
        else {
            //A new Position is created for this staker
            PositionsList[msg.sender].push(StakingLibrary.Position(_token, _amount));
        }

        //Update the TVL with the token just staked
        uint amountTokenStakedinEther = uint(StakingLibrary.getLatestPrice(_priceFeedContract)) * _amount;
        TVL += amountTokenStakedinEther;

        //Event log position staked
        emit stake(msg.sender, _token, amountTokenStakedinEther);

        Reward(msg.sender, amountTokenStakedinEther);
    }

    function UnstakePosition(address _token, uint256 _amount, address _priceFeedContract ) external {
        require(PositionsList[msg.sender].length > 0, "You don't have any tokens staked");
        
        uint indexTokenStaked = StakingLibrary.getIndexTokenStaked(PositionsList[msg.sender], _token);
        require(PositionsList[msg.sender].length != indexTokenStaked, "You don't stake this token");
        require(PositionsList[msg.sender][indexTokenStaked].liquidity < _amount, "You don't) have that many tokens staked");

        //Unstake staking position 
        IERC20(_token).safeTransfer(msg.sender, _amount);

        //Updates the PositionsList
        if (PositionsList[msg.sender][indexTokenStaked].liquidity == _amount) {
            //Erase staking position 
            PositionsList[msg.sender][indexTokenStaked] =  StakingLibrary.Position(address(0),  0);

        } else PositionsList[msg.sender][indexTokenStaked].liquidity -= _amount;

        //Update the TVL with the token just unstaked
        uint amountTokenUnstakedinEther = uint(StakingLibrary.getLatestPrice(_priceFeedContract)) * _amount;
        TVL -= amountTokenUnstakedinEther;

        emit unStake(msg.sender, _token, amountTokenUnstakedinEther);

    }

    function getAllPositions() public view returns (StakingLibrary.Position [] memory) {
        return PositionsList[msg.sender];
    }

    function getLiquidityPosition(address _caller, address _token)  public view returns(uint) {
        require(_caller == msg.sender, "It's not your account !!");
        uint indexToken = StakingLibrary.getIndexTokenStaked(this.getAllPositions(), _token);

        return PositionsList[_caller][indexToken].liquidity;
    }

    receive() external payable {
        
    }

}