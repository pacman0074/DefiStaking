//const Swap = require("../utils/Swap");
const { ChainId, Token, WETH, Fetcher, Trade, Route, TokenAmount, TradeType , Percent } = require('@uniswap/sdk');

const Staking = artifacts.require("Staking");
const StakingLibrary = artifacts.require("StakingLibrary")
const BlueToken = artifacts.require("BlueToken");
const {BN, expectEvent, expectRevert} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
const ethers = require("ethers");
require("dotenv").config();


//Swap("0xB8c77482e45F1F44dE1745F52C74426C631bDD52", 10);


const Swap = async ( tokenAddress, amount) =>  {
    const token = new Token(ChainId.MAINNET, tokenAddress, 18);

    const pair = await Fetcher.fetchPairData(token, WETH[token.chainId]);
    const route = new Route([pair], WETH[token.chainId]);
    const amountIn = '1000000000000000000' // 1 WETH
    const trade = new Trade(route, new TokenAmount(WETH[token.chainId], amountIn), TradeType.EXACT_INPUT);
    const slippageTolerance = new Percent('10', '100') // 10 bips, or 0.10%
    
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw ;// needs to be converted to e.g. hex
    const path = [WETH[token.chainId].address, token.address];
    const to = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // should be a checksummed recipient address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex
    
    const provider = ethers.getDefaultProvider('http://localhost:8545'); // utilisation du provider infura https://kovan.infura.io/v3/8235e88771864d7a8b201b72fba8a130 effectuer une transaction  
    const signer = new ethers.Wallet(process.env.PRIVATEKEY); // récupérer son wallet grâce au private key
    const account = signer.connect(provider); // récupérer l’account qui va effectuer la transaction 
    
    
    
    const abi = [{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"}];
    const contractUniswap = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', abi, account);
    
    const montant = ethers.BigNumber.from('1000000000000000000');
    const Tx = await contractUniswap.swapExactETHForTokens(String(amountOutMin), path, to , deadline , { value : montant, gasPrice: 20e10, gasLimit: 250000 });
    
    /*console.log(`Transaction hash: ${Tx.hash}`); // afficher le hash de la transaction 
     
    const receipt = await Tx.wait(); // récupérer la transaction receipt 
    console.log(`Transaction was mined in block ${receipt.blockNumber}`);*/
}

contract('Staking', function(accounts){

    const staker_1 = accounts[1];
    const staker_2 = accounts[2];
    const staker_3 = accounts[3];

    const _initialsupply = new BN(1000);
    const _rate = 200;

    //const Provider = new ethers.providers.JsonRpcProvider();
    const Provider = ethers.getDefaultProvider('http://localhost:8545');
    const LINKAddress = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
    const LINKAbiContract = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"unfreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"freezeOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"freeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Unfreeze","type":"event"}];

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
            this.LinkContract = await new ethers.Contract(LINKAddress, LINKAbiContract, Provider);
            
            
            

        });
        it("checks if the Staking contract has well received the token staked", async function() {
            let amount = new BN(2);
            await Swap(LINKAddress, 10);
            //await this.StakingInstance.Stake(process.env.BNB, amount, process.env.BNB_ETH);

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




