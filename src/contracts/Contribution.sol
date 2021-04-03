// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title A contribution place to accept ethers
/// @author Iwan Effendi
/// @notice You use this with Token contract
/// @dev All functions have been unit tested
contract Contribution {
    using SafeMath for uint256;

    Token private token;
    address private tokenOwner;
    uint256 private constant multiplier = 10;
    mapping(address => uint256) public donationAmountFrom;

    event Donate(address indexed contributor, uint256 etherAmount, uint256 tokenAmount, uint256 timestamp);
    event Withdraw(uint256 amount, uint timestamp);

    /// @notice initialize the token address and the token owner address
    /// @param _tokenAddress the token address
    /// @param _tokenOwner the token owner address
    constructor(address _tokenAddress, address _tokenOwner) public {
        token = Token(_tokenAddress);
        tokenOwner = _tokenOwner;
    }
  
    /// @notice when calling the function, you need to specify the sender and value in the metadata parameter
    /// @dev emit Donate event; remember to use the SafeMath functions (add, sub, mul, div, mod) rather than the original operators (+, -,  *,  /, %)
    function donate() payable external {    
        require(token.transferFrom(tokenOwner, msg.sender, (msg.value).mul(multiplier)));
        donationAmountFrom[msg.sender] = (donationAmountFrom[msg.sender]).add(msg.value);
        emit Donate(msg.sender, msg.value, (msg.value).mul(multiplier), block.timestamp);
    }

    /// @dev emit Withdraw event
    /// @param amount the amount of the ethers that the token owner withdraws
    function withdraw(uint256 amount) external {
        require(msg.sender == tokenOwner);
        msg.sender.transfer(amount);
        emit Withdraw(amount, block.timestamp);
    }
}