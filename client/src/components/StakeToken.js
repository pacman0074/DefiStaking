import React from "react";
import "../styles/StakeToken.css";
import Dropdown from "react-bootstrap/Dropdown";
import Figure from "react-bootstrap/Figure";
import EtherLogo from "../images/token_ether_logo.png";
import DaiLogo from "../images/token_dai_logo.png";
import TetherLogo from "../images/token_ether_logo.png";
import MaticLogo from "../images/token_matic_logo.png";
import ManaLogo from "../images/token_mana_logo.png";
import LinkLogo from "../images/token_link_logo.png";
import WbtcLogo from "../images/token_wbtc_logo.png";
import WethLogo from "../images/token_weth_logo.png";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup"

export default function STakeToken({accounts, contract, getRequireError}) {

    return(
        <div id="StakeToken-container">
            <span>Stake your ERC20 Token</span>
            <div id="StakeToken-stakeMenu">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-erc20" variant="primary">ERC20 tokens</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <Figure>
                                <Figure.Image className="me-2" width={30} height={30} alt="Logo ether" src={EtherLogo}/>Ether
                            </Figure>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Figure>
                                <Figure.Image className="me-2" width={30} height={30} alt="Logo dai" src={DaiLogo}/>Dai
                            </Figure>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Figure>
                                <Figure.Image className="me-2" width={30} height={30} alt="Logo tether" src={TetherLogo}/>Tether
                            </Figure>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Figure>
                                <Figure.Image className="me-2" width={30} height={30} alt="Logo matic" src={MaticLogo}/>Matic
                            </Figure>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Figure>
                                <Figure.Image className="me-2" width={30} height={30} alt="Logo mana" src={ManaLogo}/>Mana
                            </Figure>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Figure>
                                <Figure.Image className="me-2" width={30} height={30} alt="Logo link" src={LinkLogo}/>Link
                            </Figure>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Figure>
                                <Figure.Image className="me-2" width={30} height={30} alt="Logo wbtc" src={WbtcLogo}/>Wbtc
                            </Figure>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Figure>
                                <Figure.Image className="me-2" width={30} height={30} alt="Logo weth" src={WethLogo}/>Weth
                            </Figure>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <InputGroup size="sm" className="mb-3">
        <InputGroup.Text >ETH</InputGroup.Text>
        <Form.Control
          placeholder="Amount"
          aria-label="Amount"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
            </div>
            <div id="StakeToken-statsMenu">
                <div>
                </div>
                <div></div>
            </div>
        </div>
    )
}