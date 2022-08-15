const Staking = artifacts.require("Staking");
const StakingLibrary = artifacts.require("StakingLibrary")
const BlueToken = artifacts.require("BlueToken");
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

    describe("verify Reward", () => {
        it("rewards the staker proportionally to the total value locked in the staking contract", async function() {
            this.BlueTokenInstance = await BlueToken.deployed();
            let TVLToken = new BN(2);

            let balanceStakerBeforeReward = await this.BlueTokenInstance.balanceOf(staker_1);
            let balanceContractBeforeReward = await this.BlueTokenInstance.balanceOf(this.StakingInstance.address);
            

            let rewardBLT = await this.StakingInstance.Reward.call(staker_1, 1);
            let balanceStakerAfterReward = await this.BlueTokenInstance.balanceOf(staker_1);
            let balanceContractAfterReward = await this.BlueTokenInstance.balanceOf(this.StakingInstance.address);

            console.log(rewardBLT.toNumber());
            console.log(balanceStakerAfterReward.toNumber());
            console.log(balanceContractAfterReward.toNumber());

            expect(balanceStakerAfterReward).to.be.bignumber.equal(balanceStakerBeforeReward.add(TVLToken));
            //expect(balanceContractAfterReward).to.be.bignumber.equal(balanceContractBeforeReward.sub(TVLToken));

        })
    })

})




