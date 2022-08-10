// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;


import "./BlueToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
//import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

//Créer un smart contract à part pour le token ALYRA, faire comme le TP crowdsale
contract Staking {

    using SafeERC20 for IERC20;

    //This structure represents a staking position
    struct Deposit {
        address token;
        uint256 liquidity;
    }

    BlueToken public token;

    //Rate BLK/ETH : 100 BLK = 1 ETH or 1 BLK = 10^16 WEI
    uint public rate = 100;

    //List of stakers address
    address [] private stakers;

    //List of deposits attached to the staker address
    mapping (address => Deposit[]) private DepositList;

    uint constant MAX_TOKEN_PER_STAKER = 100;//Limit of token to be staked by staker

    //staking event
    event stake(address staker, address token, uint256 amount);
    event unStake(address staker, address token, uint256 amount);


    //Constructor mint reward's token and send them to staking contract
    constructor(uint256 initialSupply){
        token = new BlueToken(initialSupply);
    }


    //Return the token's index in the depositList, if not found MAX_TOKEN_PER_STAKER is returned
    function getIndexTokenStaked(address _staker, address _token) internal view returns (uint) {
        require(msg.sender != address(0), 'Zero address not allowed');

        for (uint index = 0; index < DepositList[_staker].length; index++) {
            if (DepositList[_staker][index].token == _token){
               return index;
            }
        }
        return MAX_TOKEN_PER_STAKER;
    }


    function Reward (address _staker, address _token, uint _amount) view internal {

        uint tokenAmountStakedinEther;
        uint TVLinEther;

    }

    //Investors can stake any amount of any ERC20 tokens
    function Stake(address _token, uint256 _amount) external {
        require(DepositList[msg.sender].length <= MAX_TOKEN_PER_STAKER, 'You cannot stake more than 100 ERC20 Tokens');
        require(_amount >= 0.1 ether, "you can't stake less than 0.1 ether");

        //Transfer token to staking contract
        //TransferHelper.safeTransferFrom(_token, msg.sender, address(this), _amount);
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        //Check if the staker already stakes this token
        uint indexTokenStaked = getIndexTokenStaked(msg.sender, _token);
        if (indexTokenStaked != MAX_TOKEN_PER_STAKER){
                //The deposit of the staker is updated with new amount of token staked
                DepositList[msg.sender][indexTokenStaked].liquidity += _amount;
            }
            else {
                //A new deposit is created for this staker
                DepositList[msg.sender].push(Deposit({token : _token, liquidity : _amount}));
            }

        //Event log position staked
        emit stake(msg.sender, _token, _amount);

        //Send BlueToken reward to the staker
        Reward((msg.sender), _token, _amount);
            
    }

    function UnstakePosition(address _token, uint256 _amount ) public {
        require(DepositList[msg.sender].length > 0, "You don't have any tokens staked");
        require(getIndexTokenStaked(msg.sender, _token) != MAX_TOKEN_PER_STAKER, "You don't have this token staked");

        //Unstake staking position 
        //TransferHelper.safeTransfer(_token, msg.sender, _amount);
        IERC20(_token).safeTransfer(msg.sender, _amount);

        uint indexTokenStaked = getIndexTokenStaked(msg.sender, _token);
        if (indexTokenStaked != MAX_TOKEN_PER_STAKER){
            //Erase staking position , faire un remove ici 
            DepositList[msg.sender][indexTokenStaked] =  Deposit({token : address(0), liquidity : 0});
        }
        //Check if unstake succeed
        emit unStake(msg.sender, _token, _amount);

    }

    function CollectRewards(address _token) external {

    }

    function CollectAllRewards() external {

    }


    function WithdrawFunds() external {
        require(DepositList[msg.sender].length > 0, "You don't have any tokens staked");

        //UnstakePosition for each token
        for (uint index = 0; index < DepositList[msg.sender].length; index++){
            UnstakePosition(DepositList[msg.sender][index].token, DepositList[msg.sender][index].liquidity);
        }
    }

    receive() external payable {

    }
    




}