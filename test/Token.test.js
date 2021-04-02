import { tokens, EVM_REVERT } from './helpers'

const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Token', ([deployer, account1]) => {
    let token;
    let timeStart;
    let timeEnd;
    const totalSupply = tokens(10000);
    
    describe('deployment and transfer within the allowed period', () => {

        beforeEach(async () => {
            timeStart = 1617235200;  // Thursday,  1 April 2021 00:00:00 GMT
            timeEnd = 1648771199000; // Thursday, 31 March 2022 23:59:59 GMT
            token = await  Token.new(timeStart, timeEnd, totalSupply);
        })

        describe('success', () => {
            
            // check if timeStart of Token is set correctly
            it('sets the timeStart', async () => {
                (await token.timeStart()).toString().should.equal(timeStart.toString());
            })

            // check if timeEnd of Token is set correctly
            it('sets the timeEnd', async () => {
                (await token.timeEnd()).toString().should.equal(timeEnd.toString());
            })

            // check if the total token minted is correct
            it('sets the totalSupply', async () => {
                (await token.totalSupply()).toString().should.equal(tokens(10000).toString());
            })

            // check if the deployer gets all the tokens
            it('gives the deployer all the tokens', async () => {
                (await token.balanceOf(deployer)).toString().should.equal(totalSupply.toString());
            })
                        
            it('transfers within the allowed time and emits a Transfer event', async () => {    
                const result = await token.transfer(account1, tokens(100), {from: deployer})            ;
                
                // the token balance of the deployer should have decreased by 100
                (await token.balanceOf(deployer)).toString().should.equal(tokens(10000 - 100).toString());

                // the token balance of account1 should be 100
                (await token.balanceOf(account1)).toString().should.equal(tokens(100).toString());
                
                // check the Transfer event emitted by ERC20 as our Token inherits ERC20
                const log = result.logs[0];
                log.event.should.equal('Transfer');
                const event = log.args;
                event.from.toString().should.equal(deployer, 'from is correct');
                event.to.toString().should.equal(account1, 'to is correct');
                event.value.toString().should.equal(tokens(100).toString(), 'value is correct');

            })            
        })
    })

    describe('transfer after the time ends', () => {
        
        beforeEach(async () => {
            timeStart = 1577836800; // Wednesday, 1 January 2020 00:00:00 GMT
            timeEnd = 1609459200;   // Friday, 1 January 2021 00:00:00 GMT
            token = await  Token.new(timeStart, timeEnd, totalSupply);
        })

        describe('failure', () => {            
            // transfer after the endTime should be rejected
            it('rejects the transfer after the time ends', async() => {
                await token.transfer(account1, tokens(100)).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })

    describe('transfer before the time starts', () => {
        
        beforeEach(async () => {
            timeStart = 1640995200; // Saturday, 1 January 2022 00:00:00 GMT
            timeEnd = 1669852800;   // Thursday, 1 December 2022 00:00:00
            token = await  Token.new(timeStart, timeEnd, totalSupply);
        })

        describe('failure', () => {
            // reject transfer bef0re endStart
            it('rejects the transfer before the time starts', async() => {
                await token.transfer(account1, tokens(100)).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })

})