// erc20.test.js 
const { BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ERC20 = artifacts.require('BlueToken');



contract('BlueToken', function (accounts) {

    const _name = 'BlueToken';
    const _symbol = 'BLT';
    const _initialsupply = new BN(1000);
    const _decimals = new BN(18);
    const owner = accounts[0];
    const recipient = accounts[1];
    const sender = accounts[2];
    
    beforeEach(async function () {
    this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
    });

    describe("verify BlueToken contract", () => { 
    
        it('a un nom', async function () {
            expect(await this.ERC20Instance.name()).to.equal(_name);
        });

        it('a un symbole', async function () {
            expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
        });

        it('a une valeur décimal', async function () {
            expect(await this.ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
        });

        it('vérifie la balance du propriétaire du contrat', async function (){
            let balanceOwner = await this.ERC20Instance.balanceOf(owner);
            let totalSupply = await this.ERC20Instance.totalSupply();
            expect(balanceOwner).to.be.bignumber.equal(totalSupply);
        });

        it('vérifie si un transfer est bien effectué', async function (){
            let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
            let amount = new BN(10);
            
            await this.ERC20Instance.transfer(recipient, amount, {from: owner});
            let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            
            expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
            expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
        });

        it('vérifie si l\'autorisation de retrait est bien effectué', async function() {
            let allowanceAmountSenderBeforeApprove = await this.ERC20Instance.allowance(owner, sender);
            let amount = new BN(10);
            
            await this.ERC20Instance.approve(sender, amount, {from : owner});
            let allowanceAmountSenderAfterApprove = await this.ERC20Instance.allowance(owner, sender);
            
            expect(allowanceAmountSenderAfterApprove).to.be.bignumber.equal(allowanceAmountSenderBeforeApprove.add(amount));
        })

        it('vérifie si un transfer d\'une addresse à une autre est bien effectué', async function() {
            let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
            let amount = new BN(10);
            
            await this.ERC20Instance.approve(sender, amount, {from : owner});
            await this.ERC20Instance.transferFrom(owner, recipient, amount, {from : sender});
            
            let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
            let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
            
            expect(balanceOwnerBeforeTransfer).to.be.bignumber.equal(balanceOwnerAfterTransfer.add(amount));
            expect(balanceRecipientBeforeTransfer).to.be.bignumber.equal(balanceRecipientAfterTransfer.sub(amount));

        })
    })
});
