//const BlueToken = artifacts.require("BlueToken");
const { BN } = require('@openzeppelin/test-helpers');
const BlueToken = artifacts.require("BlueToken");
const StakingLibrary =  artifacts.require("StakingLibrary");
const Staking = artifacts.require("Staking");
const _initialsupply = new BN('1000000000000000000000000');

module.exports = async function(deployer) {
  /*deployer.deploy(BlueToken, _initialsupply);
  deployer.deploy(StakingLibrary);
  deployer.link(StakingLibrary, Staking);//Permet de lier la librairie à un ou plusieurs contrats
  deployer.deploy(Staking, _initialsupply);
  var instance = await BlueToken.deployed();
  await instance.transfer(Staking.address,_initialsupply );*/

  deployer.deploy(StakingLibrary);
  deployer.link(StakingLibrary, Staking);//Permet de lier la librairie à un ou plusieurs contrats
  deployer.deploy(Staking, _initialsupply, BlueToken.address ).then(async function() {
    var instance = await BlueToken.deployed();
    await instance.transfer(Staking.address,_initialsupply );
    
  })


};
