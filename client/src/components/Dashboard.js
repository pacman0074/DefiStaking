import React from 'react';
import '../styles/Dashboard.css';
import Table from 'react-bootstrap/Table';
import Figure from "react-bootstrap/Figure";
import Token from './token.json';


export default function Dashboard({web3, accounts,contractStaking , getRequireError}){

    return(
       <div id="Dashboard-container">
            <div id="dashboard-container-header">
                <span>Dashboard</span>
                <Figure>
                    <Figure.Image className="me-2 mt-1" width={84} height={60} alt="icône_graphique"
                        src={require("../images/icone_dashboard.jpg")}/>
                </Figure>
            </div>

            <Table striped>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>TVL(Total value locked)</th>
                        <th>Total reward</th>
                        <th>Price in ether</th>
                    </tr>
                </thead>
                <tbody>
                    {   Token.token.map( (token) => 
                            <React.Fragment>
                                <tr>
                                    <td>
                                    <Figure>
                                        <Figure.Image width={30} height={30} alt={token.token_name} 
                                            src={require("../images/"+token.token_img)}/>
                                    </Figure>
                                    {' '+token.token_name}
                                    </td>
                                    <td>2156</td>
                                    <td>124 BLT</td>
                                    <td>0.000124</td>
                                </tr>
                            </React.Fragment>
                        )
                    }
                </tbody>
            </Table>
       </div>
    )
}