const Staking = artifacts.require("Staking");
const StakingLibrary = artifacts.require("StakingLibrary")
const BlueToken = artifacts.require("BlueToken");
const {BN, expectEvent, expectRevert} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
const ethers = require("ethers");
require("dotenv").config();


contract('Staking', function(accounts){

    const staker_1 = accounts[1];
    const staker_2 = accounts[2];
    const staker_3 = accounts[3];

    const _initialsupply = new BN(1000);
    const _rate = 200;

    //const Provider = new ethers.providers.JsonRpcProvider();
    const Provider = ethers.getDefaultProvider('http://localhost:8545');
    const BNBAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
    const BNBAbiContract = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"unfreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"freezeOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"freeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Unfreeze","type":"event"}];

    beforeEach(async function() {
        this.StakingInstance = await Staking.new(_initialsupply, {from : accounts[0]});
    });

    describe("verify TVL intialization", () => {

        it("equals to _initialSupply/200", async function() {
            let TVL = new BN( (_initialsupply.toNumber())/_rate ); 
            expect(await this.StakingInstance.TVL()).to.be.bignumber.equal(TVL);
        });
    });

    describe("verify Stake", () => {
        beforeEach(async function() {
            //this.Provider = ethers.getDefaultProvider('http://localhost:8545');
            this.BNBContract = await new ethers.Contract(BNBAddress, BNBAbiContract, Provider);
            console.log(this.BNBContract);

        });
        it("checks if the contract has well received the token staked", async function() {
           /* this.BlueTokenInstance = await BlueToken.deployed();
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
            //expect(balanceContractAfterReward).to.be.bignumber.equal(balanceContractBeforeReward.sub(TVLToken));*/

        })
    })

})




