// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';


contract Staking is ERC20 {

    struct Deposit {
        address token;
        uint256 liquidity;
    }

    //List of deposits attached to the staker address
    mapping (address => Deposit[]) DepositList;

    //event
    event stake(address staker, address token, uint256 amount);
    event unstake(address staker, address token, uint256 amount);


    
    constructor(uint256 initialSupply) ERC20('BlueToken', 'BLT'){
        //Mint of token rewards
        _mint(address(this), initialSupply);
    }


    //Investors can stake any amount of any ERC20 tokens
    function Stake(address _token, uint256 _amount) external {
        require(msg.sender != address(0), 'Zero address not allowed');
        require(_amount >= 0.1 ether, "you can't stake less than 0.1 ether");

        //Transfer token to staking contract
        TransferHelper.safeTransferFrom(_token, msg.sender, address(this), _amount);

        //Check if the staker already stakes this token
        for (uint256 i = 0; i < DepositList[msg.sender].length; i++) {
            if (DepositList[msg.sender][i].token == _token){
                //The deposit of the staker is updated with new amount of token staked
                DepositList[msg.sender][i].liquidity += _amount;
            }
            else {
                //A new deposit is created for this staker
                DepositList[msg.sender].push(Deposit({token : _token, liquidity : _amount}));
            }
        }

        emit stake(msg.sender, _token, _amount);
            
    }

    function Unstake(address _token, uint256 _amount ) external {

    }

    function CollectRewards(address _token) external {

    }

    function CollectAllRewards() external {

    }


    function WithdrawFunds() external {

    }

    receive() external payable {

    }
    




}