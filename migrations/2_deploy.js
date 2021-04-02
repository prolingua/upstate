const Token = artifacts.require("Token");
const Contribution = artifacts.require("Contribution");
const ether = n => {
    return new web3.utils.BN(
      web3.utils.toWei(n.toString(), 'ether')
    )
  }
const tokens = (n) => ether(n);

module.exports = async function(deployer) {
    const timeStart = 1617235200;  // Thursday,  1 April 2021 00:00:00 GMT
    const timeEnd = 1648771199000; // Thursday, 31 March 2022 23:59:59 GMT
    const totalSupply = tokens(100000);
    const accounts = await web3.eth.getAccounts();
    const tokenOwner = accounts[0];

	// deploy Token
	await deployer.deploy(Token, timeStart, timeEnd, totalSupply);

	// assign Token into variable to get its address
	const token = await Token.deployed();

	// deploy Contribution
	await deployer.deploy(Contribution, token.address, tokenOwner);

	// assign Contribution into variable to get its address
	const contribution = await Contribution.deployed();

	// approve Contribution to transfer the tokens to others
	await token.approve(contribution.address, totalSupply, { from: tokenOwner });
};