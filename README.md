Token inherits ERC20.
Contribution uses Token.
To test and run these smart contracts you need:
1. NodeJs
2. Ganache
3. Truffle

In the main directory, install  all the necessary packages by 'npm install'.
To compile, run 'truffle compile'.
To run the test script, run 'truffle test'.
To deploy locally, first run the ganache, then run 'truffle migrate'. You then can interact with the contracts via the truffle console.

At the moment, only the token owner can withdraw the donated ethers. You can modify the Contribution contract so that, for example, the
contract has the list of those who can withdraw the donated ethers, and the token owner can add an account to this list.


IMPORTANT NOTE!
In Contribution.test.js, please make sure that the timeStart and the timeEnd are correct in relation to the time you run the test.
The timeStart must be before the time you run the test and the timeEnd must be the future date.