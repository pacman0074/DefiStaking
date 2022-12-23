import React, { useEffect, useState }  from "react";
import IERC20Metadata from "../contracts/IERC20Metadata.json";
import "../styles/Reward.css";
import Dropdown from "react-bootstrap/Dropdown";
import Figure from "react-bootstrap/Figure";
import Token from "../token.json";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

export default function Reward({web3, accounts,contractStaking , getRequireError}) {

    const[CurrentToken, setCurrentToken] = useState(Token.token[0]);
    const[Position, setPosition] = useState({paidRewards : 0, currentRewards : 0});

    

    const staker = accounts[0];

    const refresh = async() => {
        await contractStaking.methods.getPosition(CurrentToken.token_address).call({from : staker}, async(err, res) => {
            if(!err){
                const paidRewardsinBLT = web3.utils.fromWei(res[2]);
                const lastUpdateReward = res[4];
                await contractStaking.methods.getReward(CurrentToken.token_address, CurrentToken.priceFeed_address, res[1], lastUpdateReward).call({from: staker}, (err, res) => {
                    if(!err) {
                        var currentRewardsinBLT = web3.utils.fromWei(res);
                        setPosition({paidRewards : paidRewardsinBLT, currentRewards : currentRewardsinBLT});
    
                    } else getRequireError(err)
                }) 
            }else getRequireError(err);
            
        });
    }

    const collectRewards = async() => {
        await contractStaking.methods.claimReward(CurrentToken.token_address, CurrentToken.priceFeed_address).send({from : staker}, async (err, res) => {
            if(err) {
                getRequireError(err);
            } 
        });
        await refresh();
    }

    useEffect( async() => {
        const instanceIERC20 = await new web3.eth.Contract(IERC20Metadata.abi, CurrentToken.token_address);
       // setStatsAmounts();
        await refresh();

    }, [CurrentToken])


    return (

        <div id="Reward-container">

            <div id="Reward-container-header">
                <span>Collect your rewards</span>
                <Button  id="Reward-container-header-button" onClick={refresh} variant="outline-primary" >Refresh</Button>
            </div>
            
            <div id="Reward-menu">

                <div id="Reward-menu-collect">
                    <Dropdown align={{ lg: 'end' }}>
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
                    
                    <InputGroup.Text style={{color :CurrentToken.token_color}} id="input-title">{CurrentToken.token_shortname}</InputGroup.Text>
                    <Button  id="Reward-button" onClick={collectRewards} variant="outline-success" >Collect rewards</Button>



               
                    
                </div>

                <div id="Reward-menu-paidRewards" style={{color :CurrentToken.token_color}}>
                    <div className="stats" >
                        <span class="stats-title">Paid rewards</span>
                        <span class="stats-amount">{Math.round(Position.paidRewards * 100)/100}</span>
                        <span class="stats-annexe">BLT</span>
                    </div>
                    
                </div>

                <div id="Reward-menu-pendingRewards" style={{color :CurrentToken.token_color}}>
                    <div className="stats" >
                        <span class="stats-title">Pending rewards</span>
                        <span class="stats-amount">{Math.round(Position.currentRewards * 10000)/10000}</span>
                        <span class="stats-annexe">BLT</span>
                    </div>

                    
                </div>



            </div>


        </div>

    )
}

