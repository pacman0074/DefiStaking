const Staking = artifacts.require("Staking");
const {BN, expectEvent, expectRevert} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
require("dotenv").config();

contract('Staking', function(accounts){

    const staker_1 = accounts[1];
    const staker_2 = accounts[2];
    const staker_3 = accounts[3];

    const _initialsupply = new BN(1000);
    const _rate = 200;

    beforeEach(async function() {
        this.StakingInstance = await Staking.new(_initialsupply, {from : accounts[0]});
    })

    describe("verify TVL intialization", () => {

        it("equals to _initialSupply/200", async function() {
            let TVL = new BN( (_initialsupply.toNumber())/_rate ); 
            expect(await this.StakingInstance.TVL()).to.be.bignumber.equal(TVL);
        })
    })

    beforeEach(async function() {
        this.StakingInstance = await Staking.new(_initialsupply, {from : accounts[0]});
    })

    //Créer un smart contract library et y mettre les fonctions getIndexTokenStaked et getDeposit
    describe("verify getIndexTokenStaked", () => { 
        it("returns 0 when the staker have no token staked", async function() {
            let indexTokenStaked = new BN(0);
            expect(await this.StakingInstance.getIndexTokenStaked(staker_1, process.env.WETH)).to.be.bignumber.equal(indexTokenStaked);
        })
    })
})

