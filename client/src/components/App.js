import React, { Component } from "react";
import Staking from '../contracts/Staking.json';
import BlueToken from "../contracts/BlueToken.json"
import getWeb3 from "../getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import "../styles/App.css";
import logo from "../images/logo_transparent.png";
import getRequireError from "../utils/getRequireError" ;
import StakeToken from "./StakeToken" ;
import Dashboard from "./Dashboard";


class App extends Component {
  state = { web3: null, accounts: null, contract: null, currentComponent : "" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      
      const networkId = await web3.eth.net.getId();
      const deployedNetworkStaking = Staking.networks[networkId];
      const deployedNetworkBlueToken = BlueToken.networks[networkId];

      const instanceStaking = new web3.eth.Contract(
        Staking.abi,
        deployedNetworkStaking && deployedNetworkStaking.address,
        
      );

      const instanceBlueToken = new web3.eth.Contract(
        BlueToken.abi,
        deployedNetworkBlueToken && deployedNetworkBlueToken.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contractStaking: instanceStaking, contractBLT : instanceBlueToken, currentComponent : "Stake"});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contracts. Check console for details.`,
      );
      console.error(error);
    }
  };

  contentNavigation = () => {
    const {web3, accounts, contractStaking, currentComponent} = this.state;

    switch(currentComponent) {
      case "Dashboard" :
        return <Dashboard web3={web3} getRequireError={getRequireError} accounts={accounts} contractStaking={contractStaking} />
      case "Stake" :
        return <StakeToken web3={web3} getRequireError={getRequireError} accounts={accounts} contractStaking={contractStaking} />
      default:
        return null
    }
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contracts...</div>;
    }
    return (
     
      <div className="App">
        <header className="container-fluid  d-flex justify-content-between align-items-center mb-5 ">
          <span className="col-3">BLUE STAKING</span>
          <Nav className="col-6">
            <Nav.Item>
              <Nav.Link onClick={ () => this.setState({currentComponent : "Dashboard"})} eventKey="">Dashboard</Nav.Link> 
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={ () => this.setState({currentComponent : "Stake"})}  eventKey="">Stake</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={ () => this.setState({currentComponent : "Unstake"})} eventKey="">Unstake</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={ () => this.setState({currentComponent : "Reward"})} eventKey="">Reward</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={ () => this.setState({currentComponent : "Docs"})} eventKey="">Docs</Nav.Link>
            </Nav.Item>
          </Nav>
          <figure className="col-1">
            <img className="h-50 w-50 mt-3" src={logo} alt="Logo"/>
          </figure>
        </header>
        
        <div className="content">
          {this.contentNavigation()}
        </div> 
        
      </div>
    );
  }
}

export default App;
