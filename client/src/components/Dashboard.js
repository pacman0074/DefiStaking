import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import Table from 'react-bootstrap/Table';
import Figure from "react-bootstrap/Figure";
import Token from './token.json';
import IERC20Metadata from "../contracts/IERC20Metadata.json";


export default function Dashboard({web3, accounts,contractStaking , contractStakingLibrary,  getRequireError}){

    const staker = accounts[0];

    const [DashboardFigures, setDashboardFigures] = useState({TVLtokeninEther : [], TVLtoken : [], TotalRewardToken : [], PriceFeedToken : []})

    // return the TVL by token in ether
    const getTVLtokeninEther = async() => {
        var TVLtokeninEther = [];
        for ( var i = 0; i < Token.token.length ; i++){
            await contractStaking.methods.TVLtokeninEther(Token.token[i].token_address).call({from : staker}, (err, res) => {
                if(!err){
                    TVLtokeninEther.push(Math.round(web3.utils.fromWei(res) * 1000)/1000);

                } else getRequireError(err);
            })
        }

        return TVLtokeninEther;
    }

    // return the TVL by token in ether
    const getTVLtoken = async() => {
        var TVLtoken = [];
        for ( var i = 0; i < Token.token.length ; i++){
            let instanceIERC20 = await new web3.eth.Contract(IERC20Metadata.abi, Token.token[i].token_address);
            let decimals = await instanceIERC20.methods.decimals().call();
            await contractStaking.methods.TVLtoken(Token.token[i].token_address).call({from : staker}, (err, res) => {
                if(!err){
                    let TVLtokeninWei = web3.utils.toBN(res).mul(web3.utils.toBN(Math.pow(10, 18 - decimals)));
                    TVLtoken.push(Math.round(web3.utils.fromWei(TVLtokeninWei) * 1000)/1000);

                } else getRequireError(err);
            })
        }

        return TVLtoken;
    }

    const getTotalRewardToken = async() => {
        var TotalRewardToken = [];
        for ( var i = 0; i < Token.token.length ; i++){
            await contractStaking.methods.TotalRewardtoken(Token.token[i].token_address).call({from : staker}, (err, res) => {
                if(!err){
                    TotalRewardToken.push(Math.round(web3.utils.fromWei(res) * 1000)/1000);

                } else getRequireError(err);
            })
        }

        return TotalRewardToken;
    }

    const getPriceFeedToken = async() => {
        var PriceFeedToken = [];
        PriceFeedToken[0] = 1;
        for(var i = 1; i < Token.token.length; i++) {
            await contractStakingLibrary.methods.getLatestPrice(Token.token[i].priceFeed_address).call({from : staker}, (err, res) => {
                if(!err){
                    PriceFeedToken.push(Math.round(web3.utils.fromWei(res) * 100000)/100000);

                } else getRequireError(err);

            })
        }

        return PriceFeedToken;
        
    }

    useEffect( async () => {
        const TVLtokeninEther = await getTVLtokeninEther();
        const TVLtoken = await getTVLtoken();
        const TotalRewardToken = await getTotalRewardToken();
        const PriceFeedToken = await getPriceFeedToken();

        setDashboardFigures({TVLtokeninEther : TVLtokeninEther, TVLtoken : TVLtoken, TotalRewardToken : TotalRewardToken, PriceFeedToken : PriceFeedToken});
    }, [] );



    return(
       <div id="Dashboard-container">
            <div id="dashboard-container-header">
                <span>Dashboard</span>
                <Figure>
                    <Figure.Image className="me-2 mt-1" width={84} height={60} alt="icône_graphique"
                        src={require("../images/icone_dashboard.jpg")}/>
                </Figure>
            </div>

            <Table striped variant='dark'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>TVL (ETH)</th>
                        <th>TVL (Token)</th>
                        <th>TOTAL REWARD</th>
                        <th>PRICE IN ETHER</th>
                    </tr>
                </thead>
                <tbody>
                    {   Token.token.map( (token, index) => 
                            <React.Fragment key={index}>
                                <tr>
                                    <td>
                                    <Figure>
                                        <Figure.Image width={30} height={30} alt={token.token_name} 
                                            src={require("../images/"+token.token_img)}/>
                                    </Figure>
                                    {' '+token.token_name}
                                    </td>
                                    <td>{DashboardFigures.TVLtokeninEther[index]} <span>ETH</span></td>
                                    <td>{DashboardFigures.TVLtoken[index]} <span>{token.token_shortname}</span></td>
                                    <td>{DashboardFigures.TotalRewardToken[index]} <span>BLT</span></td>
                                    <td>{DashboardFigures.PriceFeedToken[index]} <span>ETH</span></td>
                                </tr>
                            </React.Fragment>
                        )
                    }
                </tbody>
            </Table>
       </div>
    )
}