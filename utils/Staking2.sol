// SPDX-License-Identifier: GPL-2.0-or-later
/*pragma solidity 0.8.16;


import "./BlueToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PriceConsumer.sol";

//import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

//Créer un smart contract à part pour le token ALYRA, faire comme le TP crowdsale
contract Staking2 {

    using SafeERC20 for IERC20;

    //This structure represents a staking position
    struct Deposit {
        address token;
        uint256 liquidity;
    }

    BlueToken public token;

    //Rate BLK/ETH : 100 BLK = 1 ETH or 1 BLK = 10^16 WEI
    uint public rate = 200;

    //Total value locked in the contract in Wei
    uint public TVL = 0;

    //List of stakers address
    address [] public Stakers;

    //List of deposits attached to the staker address
    mapping (address => Deposit[]) public DepositList;

    //staking event
    event stake(address staker, address token, uint amount);
    event unStake(address staker, address token, uint amount);
    event reward(address staker, uint amount);


    //Constructor mint reward's token and send them to staking contract
    constructor(uint256 initialSupply){
        token = new BlueToken(initialSupply);
        TVL = initialSupply/200;
    }


    //Return the token's index in the depositList, if not found MAX_TOKEN_PER_STAKER is returned
    function getIndexTokenStaked(address _staker, address _token) public view returns (uint) {

        for (uint index = 0; index < DepositList[_staker].length; index++) {
            if (DepositList[_staker][index].token == _token){
               return index;
            }
        }
        return DepositList[_staker].length;
    }

    //Reward the staker with Blue Token 
    function Reward (address _staker, uint TVLToken ) internal {

        //The reward has to be proportional to the TVL in the contract
        uint rewardBLT = (TVLToken*200)/TVL;
        IERC20(address(token)).safeTransfer(_staker, rewardBLT);

        emit reward(_staker, rewardBLT);
        
    }

    //Investors can stake any amount of an ERC20 token
    function Stake(address _token, uint256 _amount, address _priceFeedContract) external {
        require(_amount >= 0.1 ether, "you can't stake less than 0.1 ether");

        //Init instance of the contract which will retrieve price of the token in Wei
        PriceConsumer priceFeed = PriceConsumer(_priceFeedContract);

        //Send the token of the staker to the contract Staking
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        //Check if the staker already stakes this token
        uint indexTokenStaked = getIndexTokenStaked(msg.sender, _token);

        //Add the new deposit to the depositList or 
        //only updates the amount if a deposit has been already done for this token
        if (indexTokenStaked != DepositList[msg.sender].length) {
                //The deposit of the staker is updated with new amount of token staked
                DepositList[msg.sender][indexTokenStaked].liquidity += _amount;
            }
            else {
                //A new deposit is created for this staker
                DepositList[msg.sender].push(Deposit({token : _token, liquidity : _amount}));
            }

        //Update the TVL with the token just staked
        uint TVLToken = uint(priceFeed.getLatestPrice()) * _amount;
        TVL += TVLToken;

        //Event log position staked
        emit stake(msg.sender, _token, _amount);

        Reward(msg.sender, TVLToken);
    }

    function UnstakePosition(address _token, uint256 _amount, address _priceFeedContract ) external {
        require(DepositList[msg.sender].length > 0, "You don't have any tokens staked");
        
        uint indexTokenStaked = getIndexTokenStaked(msg.sender, _token);
        require(DepositList[msg.sender].length != indexTokenStaked, "You don't stake this token");
        require(DepositList[msg.sender][indexTokenStaked].liquidity < _amount, "You don't) have that many tokens staked");

        PriceConsumer priceFeed = PriceConsumer(_priceFeedContract);

        //Unstake staking position 
        IERC20(_token).safeTransfer(msg.sender, _amount);

        //Updates the DepositList
        if (DepositList[msg.sender][indexTokenStaked].liquidity == _amount) {
            //Erase staking position 
            DepositList[msg.sender][indexTokenStaked] =  Deposit({token : address(0), liquidity : 0});

        } else DepositList[msg.sender][indexTokenStaked].liquidity -= _amount;

        //Update the TVL with the token just unstaked
        uint TVLToken = uint(priceFeed.getLatestPrice()) * _amount;
        TVL -= TVLToken;

        emit unStake(msg.sender, _token, _amount);

    }

    function getDeposit(address _staker) public view returns (Deposit [] memory) {
        return DepositList[_staker];
    }

    receive() external payable {

    }
    




}*/