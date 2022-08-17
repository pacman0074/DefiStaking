//const BlueToken = artifacts.require("BlueToken");
const { BN } = require('@openzeppelin/test-helpers');
const BlueToken = artifacts.require("BlueToken");
const StakingLibrary =  artifacts.require("StakingLibrary");
const Staking = artifacts.require("Staking");
const _initialsupply = new BN(1000);

module.exports = function(deployer) {
  deployer.deploy(BlueToken, _initialsupply);
  deployer.deploy(StakingLibrary);
  deployer.link(StakingLibrary, Staking);//Permet de lier la librairie à un ou plusieurs contrats
  deployer.deploy(Staking, _initialsupply);

  
  
};
