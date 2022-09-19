import React, { useEffect, useState } from "react";
import IERC20Metadata from "../contracts/IERC20Metadata.json";
import "../styles/StakeToken.css";
import Dropdown from "react-bootstrap/Dropdown";
import Figure from "react-bootstrap/Figure";
import Token from "./token.json";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

export default function StakeToken({web3, accounts,contractStaking , getRequireError, contractBLT}) {
    

    const[CurrentToken, setCurrentToken] = useState(Token.token[0]);
    const[amount, setAmount] = useState(0);
    const[Position, setPosition] = useState({amountTokenStaked : 0, rewardBLT : 0});
    
    const staker = accounts[0];
    
    const setStatsAmounts = async(decimals) => {
        var amountStakedinWei;
        await contractStaking.methods.getPosition(staker, CurrentToken.token_address).call({from : staker}, (err, res) => {
            if(!err){
                
                if(decimals != 18){  
                    console.log('res');
                    console.log(res);
                    //Convert the amount in wei and afterwards get the value in the biggest unit of the token
                    amountStakedinWei = web3.utils.toBN(res[1]).mul(web3.utils.toBN(Math.pow(10,18))).div(web3.utils.toBN(Math.pow(10,decimals)));

                } 
                else {
                    amountStakedinWei = res[1];
                }

                let amountStaked = web3.utils.fromWei(amountStakedinWei);
                
                let amountReward = web3.utils.fromWei(res[2]);
                console.log(amountReward);
                setPosition({amountTokenStaked : amountStaked, rewardBLT : amountReward});

            } else getRequireError(err);
        });

        //console.log(await contractStaking.methods.getPosition(staker, CurrentToken.token_address).call({from : staker}));
    }

    const Stake = async() => {
        // Create an instance current token address and retrieves the decimal of the token
        const instanceIERC20 = await new web3.eth.Contract(IERC20Metadata.abi, CurrentToken.token_address);
        const decimals = await instanceIERC20.methods.decimals().call({from : staker});

        const weiAmountBN = web3.utils.toBN(web3.utils.toWei(amount));
        const amountBN = weiAmountBN.mul(web3.utils.toBN(Math.pow(10,decimals))).div(web3.utils.toBN(Math.pow(10,18)))
        // Approve the Staking contract to spend the staker's ERC20 tokens
        await instanceIERC20.methods.approve(contractStaking.options.address,amountBN.toString() ).send({from : staker}, (err) => getRequireError(err));

        //Stake ERC20 token
        await contractStaking.methods.Stake(CurrentToken.token_address, amountBN.toString(),CurrentToken.priceFeed_address).send({from : staker}, (err) => getRequireError(err));

        setStatsAmounts(decimals); 
    }
    

    useEffect( async() => {
        const instanceIERC20 = await new web3.eth.Contract(IERC20Metadata.abi, CurrentToken.token_address);
        const decimals = await instanceIERC20.methods.decimals().call({from : staker});
        setStatsAmounts(decimals)}, [CurrentToken])

    return(
        
        <div id="StakeToken-container">
            {console.log("render")}
            <span>Stake your ERC20 Token</span>
            <div id="StakeToken-stakeMenu">

                <Dropdown drop="end">
                    <Dropdown.Toggle id="dropdown-toggle" variant="primary">ERC20 tokens</Dropdown.Toggle>
                    <Dropdown.Menu id="dropdown-menu">
                        {
                            Token.token.map((token) => 
                            <Dropdown.Item onClick={() => { setCurrentToken(token)}}> 
                                    <Figure>
                                        <Figure.Image className="me-2" width={30} height={30} alt={token.token_name} src={require("../images/"+token.token_img)}/>
                                        {token.token_name}
                                    </Figure>
                            </Dropdown.Item>
                            )
                        }
                    </Dropdown.Menu>
                </Dropdown>

                <InputGroup  >
                    <InputGroup.Text style={{color :CurrentToken.token_color}} id="input-title" >{CurrentToken.token_shortname}</InputGroup.Text>
                    <Form.Control onChange={ (input) => setAmount(input.target.value)}/>
                </InputGroup>

                <Button id="stake-button" variant="outline-primary" onClick={Stake}>Stake</Button>
            </div>

            <div style={{color :CurrentToken.token_color}} id="StakeToken-statsMenu">
                <div className="stats" >
                    <span class="stats-title">Staked</span>
                    <span class="stats-amount">{Math.round(Position.amountTokenStaked * 100)/100}</span>
                    <span class="stats-annexe">{CurrentToken.token_shortname}</span>
                </div>
                <div className="stats">
                    <span class="stats-title">Reward</span>
                    <span class="stats-amount">{Math.round(Position.rewardBLT * 100)/100}</span>
                    <span class="stats-annexe">BLT</span>
                </div>
            </div>
        </div>
    )
}