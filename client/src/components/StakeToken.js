import React, { useState } from "react";
import "../styles/StakeToken.css";
import Dropdown from "react-bootstrap/Dropdown";
import Figure from "react-bootstrap/Figure";
import Token from "./token.json";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

export default function StakeToken({web3, accounts, contract, getRequireError}) {
    
    const[CurrentToken, setCurrentToken] = useState(Token.token[0]);
    const[amount, setAmount] = useState(0);

    
    const staker = accounts[0];
    const Web3 = web3.utils;

    const Stake = async() => {
        const weiAmount = Web3.toWei(amount);
        console.log(staker);
        console.log(weiAmount);
        //Faire approuver staker avant d'appeler la fonction Stake !!!
        await contract.methods.Stake(CurrentToken.token_address, weiAmount.toString(), CurrentToken.priceFeed_address).send({from : staker}, (err) => getRequireError(err));
    }

    return(
        <div id="StakeToken-container">
            {console.log(amount)}
            <span>Stake your ERC20 Token</span>
            <div id="StakeToken-stakeMenu">

                <Dropdown drop="end">
                    <Dropdown.Toggle id="dropdown-toggle" variant="primary">ERC20 tokens</Dropdown.Toggle>
                    <Dropdown.Menu id="dropdown-menu">
                        {
                            Token.token.map((token) => 
                            <Dropdown.Item onClick={() => setCurrentToken(token)}> 
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
                    <span class="stats-amount">10</span>
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