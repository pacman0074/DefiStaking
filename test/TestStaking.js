const Staking = artifacts.require("Staking");
const {expect} = require("chai");
const  {expectRevert, expectEvent, BN} = require("@openzeppelin/test-helpers");

contract('Staking', function(accounts){

    //The staker's address
    const staker = accounts[1];

    beforeEach(async function() {
        //Create a new instance of Staking contract
        this.StakingInstance = await Staking.new
    })

})