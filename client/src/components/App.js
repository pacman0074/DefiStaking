import React, { Component } from "react";
import Staking from '../contracts/Staking.json';
import StakingLibrary from '../contracts/StakingLibrary.json';
import BlueToken from "../contracts/BlueToken.json";
import getWeb3 from "../getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import "../styles/App.css";
import logo from "../images/logo_transparent.png";
import getRequireError from "../utils/getRequireError" ;
import StakeToken from "./StakeToken" ;
import Dashboard from "./Dashboard";
import Reward from "./Reward";


class App extends Component {
  state = { web3: null, accounts: null, contractStaking : null, contractBLT :null, 
    contractStakingLibrary : null, currentComponent : "" };

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
      const deployedNetworkStakingLibrary = StakingLibrary.networks[networkId];

      const instanceStaking = new web3.eth.Contract(
        Staking.abi,
        deployedNetworkStaking && deployedNetworkStaking.address,
        
      );

      const instanceBlueToken = new web3.eth.Contract(
        BlueToken.abi,
        deployedNetworkBlueToken && deployedNetworkBlueToken.address,
      );

      const instanceStakingLibrary = new web3.eth.Contract(
        StakingLibrary.abi,
        deployedNetworkStakingLibrary && deployedNetworkStakingLibrary.address,
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contractStaking: instanceStaking, contractBLT : instanceBlueToken, contractStakingLibrary : instanceStakingLibrary, currentComponent : "Stake"});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contracts. Check console for details.`,
      );
      console.error(error);
    }
  };

  contentNavigation = () => {
    const {web3, accounts, contractStaking, contractStakingLibrary, currentComponent} = this.state;

    switch(currentComponent) {
      case "Dashboard" :
        return <Dashboard web3={web3} getRequireError={getRequireError} accounts={accounts}
         contractStaking={contractStaking} contractStakingLibrary={contractStakingLibrary} />

      case "Stake" :
        return <StakeToken web3={web3} getRequireError={getRequireError} accounts={accounts} contractStaking={contractStaking}  />

      case "Reward" :
        return <Reward web3={web3} getRequireError={getRequireError} accounts={accounts} contractStaking={contractStaking}  />

      default:
        return null
    }
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contracts...</div>;
    }

    // Reload the page when we change user on metamask browser
    window.ethereum.on('accountsChanged', () => window.location.reload());

    return (
     
      <div className="App">
        <header className="container-fluid  d-flex justify-content-between align-items-center mb-5 ">
          <span className="col-3">BLUE STAKING</span>
          <Nav className="col-6">
            <Nav.Item>
              <Nav.Link onClick={ () => this.setState({currentComponent : "Dashboard"})} eventKey="">Dashboard</Nav.Link> 
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={ () => this.setState({currentComponent : "Stake"})}  eventKey="">Staking</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={ () => this.setState({currentComponent : "Reward"})}  eventKey="">Reward</Nav.Link>
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
