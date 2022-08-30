import React, { useEffect, useState } from "react";
import IERC20 from "../contracts/IERC20.json";
import "../styles/StakeToken.css";
import Dropdown from "react-bootstrap/Dropdown";
import Figure from "react-bootstrap/Figure";
import Token from "./token.json";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

export default function StakeToken({web3, accounts, contractStaking, getRequireError, contractBLT}) {
    

    const[CurrentToken, setCurrentToken] = useState(Token.token[0]);
    const[amount, setAmount] = useState(0);
    const[amountTokenStaked, setAmountTokenStaked] = useState(0);
    
    const staker = accounts[0];

    const setAmountStaked = async() => {
        console.log(CurrentToken.token_name);
        console.log(CurrentToken.token_address);
        await contractStaking.methods.getLiquidityPosition(staker, CurrentToken.token_address).call({from : staker}, (err, res) => {
            if(!err){
                setAmountTokenStaked(web3.utils.fromWei(res));
                console.log(res);
            } else getRequireError(err)
        });
        
        
    }



    const Stake = async() => {
        const weiAmount = web3.utils.toWei(amount);
        console.log("weiAmount")
        console.log(weiAmount);

        // Create an instance current token address and approve the Staking contract
        // to spend the staker's ERC20 tokens
        const instanceIERC20 = await new web3.eth.Contract(IERC20.abi, CurrentToken.token_address);
        const test = await instanceIERC20.methods.balanceOf(staker).call({from : staker});
        console.log("test")
        console.log(test.toString())
        await instanceIERC20.methods.approve(contractStaking.options.address,weiAmount ).send({from : staker}, (err) => getRequireError(err));

        //Stake the amount entered by the staker
        await contractStaking.methods.Stake(CurrentToken.token_address, weiAmount.toString(),CurrentToken.priceFeed_address).send({from : staker}, (err) => getRequireError(err));
        setAmountStaked();
    }

    useEffect( () => setAmountStaked(), [CurrentToken])

    return(
        
        <div id="StakeToken-container">
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
                    <span class="stats-amount">{amountTokenStaked}</span>
                    <span class="stats-annexe">TVL = 100</span>
                </div>
                <div className="stats">
                    <span class="stats-title">Reward</span>
                    <span class="stats-amount">10</span>
                    <span class="stats-annexe">TVL = 100</span>
                </div>
            </div>
        </div>
    )
}