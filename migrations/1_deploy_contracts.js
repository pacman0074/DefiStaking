//const BlueToken = artifacts.require("BlueToken");
const { BN } = require('@openzeppelin/test-helpers');
const BlueToken = artifacts.require("BlueToken")
const Staking = artifacts.require("Staking");
const _initialsupply = new BN(1000);

module.exports = function(deployer) {
  deployer.deploy(BlueToken, _initialsupply);
  deployer.deploy(Staking, _initialsupply);
  
  
};
