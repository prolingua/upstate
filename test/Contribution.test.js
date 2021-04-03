import { tokens, ether, EVM_REVERT, EVM_REVERT_ERC20 } from './helpers'
import Web3 from 'web3';

const Token = artifacts.require('./Token');
const Contribution = artifacts.require('./Contribution');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Contribution', ([deployer, account1, account2]) => {
    let token;
    let contribution;
    let timeStart;
    let timeEnd;
    let result;
    let result2;
    const totalSupply = tokens(10000);

    beforeEach(async () => {
        timeStart = 1617235200;  // Thursday,  1 April 2021 00:00:00 GMT
        timeEnd = 1648771199000; // Thursday, 31 March 2022 23:59:59 GMT
        token = await  Token.new(timeStart, timeEnd, totalSupply);
        contribution = await Contribution.new(token.address, deployer);
    })

    describe('approve contribution as the spender and transfer token to another account', () => {
               
        describe('success', () => {

            beforeEach(async () => {            
                result = await token.approve(contribution.address, totalSupply, {from: deployer })
            })    
            
            it('gives the Contribution allowance to transfer token to other accounts and emits an Approval event', async () => {

                // the allowance given to the contribution contract should be equal to totalSupply
                (await token.allowance(deployer, contribution.address)).toString().should.equal(totalSupply.toString())

                // chcek the Approval event emitted by ERC20 as our Token inherits ERC20
                const log = result.logs[0];
                log.event.should.equal('Approval');
                const event = log.args;
                event.owner.toString().should.equal(deployer, 'owner is correct');
                event.spender.toString().should.equal(contribution.address, 'to is correct');
                event.value.toString().should.equal(totalSupply.toString(), 'value is correct');
            })

            it('gives a donor tokens as many as 10 times the ether he/she donates and emits Donate event', async () => {
                result2 = await contribution.donate({from: account1, value: ether(2)});
                
                // the ether donation should be recorded correctly by contribution contract
                (await contribution.donationAmountFrom(account1)).toString().should.equal(ether(2).toString());

                // the contribution contract now should have the ether donated
                (await web3.eth.getBalance(contribution.address)).toString().should.equal(ether(2).toString());

                // the donor should get the correct amount of tokens
                (await token.balanceOf(account1)).toString().should.equal(tokens(20).toString());

                // check the Donate event emitted by Contribution
                const log = result2.logs[0];
                log.event.should.equal('Donate');
                const event = log.args;
                event.contributor.toString().should.equal(account1, 'contributor is correct');
                event.etherAmount.toString().should.equal(ether(2).toString(), 'etherAmount is correct');
                event.tokenAmount.toString().should.equal(tokens(20).toString(), 'tokenAmount is correct');
                expect(Number(event.timestamp)).to.be.above(timeStart);  // the timestamp of the event should be after the start time
                expect(Number(event.timestamp)).to.be.below(timeEnd);    // the timestamp of the event should be after the end time
                
            })

            it('allows the token owner to withdraw the ethers donated and emits Witdraw event', async () => {
                await contribution.donate({from: account1, value: ether(2)});
                
                // the token owner should be able to withdraw the donated ethers
                result2 = await contribution.withdraw(ether(2), { from: deployer });

                // check the Withdraw event emitted by Contributioin
                const log = result2.logs[0];
                log.event.should.equal('Withdraw');
                const event = log.args;
                event.amount.toString().should.equal(ether(2).toString(), 'amount is correct');
                expect(Number(event.timestamp)).to.be.above(timeStart);  // the timestamp of the event should be after the start time
                expect(Number(event.timestamp)).to.be.below(timeEnd);    // the timestamp of the event should be after the end time
            })
        })

        describe('failure', () => {
            
            it('rejects the donation whose tokens reward is greater than the allowance', async () => {
                // shouldn't accept any contribution or donation if the reward tokens are greater than the allowance Contribution has
                await token.approve(contribution.address, tokens(10), {from: deployer })
                await contribution.donate({from: account1, value: ether(2)}).should.be.rejectedWith(EVM_REVERT_ERC20);
            })

            it('rejects the withdrawal by the token owner if the amount is greater than the total donated ethers', async () => {
                // shouldn't allow withdrawal if the amount is greater than the total donated ethers
                await token.approve(contribution.address, totalSupply, {from: deployer })
                await contribution.donate({from: account1, value: ether(2)});
                await contribution.withdraw(ether(3), {from: deployer}).should.be.rejectedWith(EVM_REVERT);
            })

            it('rejects the withdrawal by others than the token owner', async () => {
                // shouldn't allow withdrawal of the donated ethers by others than the token owner
                await token.approve(contribution.address, totalSupply, {from: deployer })
                await contribution.donate({from: account1, value: ether(2)});
                await contribution.withdraw(ether(1), {from: account1}).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })
})