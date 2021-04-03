// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title An ERC20 token in exchange for ether donation
/// @author Iwan Effendi
/// @notice You can use this contract in conjuction with another contract
/// @dev Inherit ERC20. All overriding functions have been unit tested
contract Token is ERC20 {
    using SafeMath for uint256;
    uint256 public timeStart;
    uint256 public timeEnd;
    uint256 public timeNow;

    /// @notice initialize the starting time, the ending time and the total number of the tokens
    /// @dev give the deployer a fixed amount of token
    /// @param _timeStart the starting time in seconds as epochtime
    /// @param _timeEnd the ending time in seconds as epochtime
    /// @param _totalSupply the total of the tokens minted in wei
    constructor(uint256 _timeStart, uint256 _timeEnd, uint256 _totalSupply) public payable ERC20("Upstate Token", "UPS") {
        timeStart = _timeStart;
        timeEnd = _timeEnd;
        _mint(msg.sender,_totalSupply);
    }

    /// @notice transfer a certain amount of token within a certain period, between timeStart and timeEnd inclusive
    /// @dev 'block.timestamp' should be used instead of 'now'as 'now' is depricated
    /// @param _to the address to which the tokens are transferred
    /// @param _amount the amount of the tokens in wei to be transferred
    /// @return success , indicating if the transfer is successfull
    function transfer(address _to, uint256 _amount) public override returns (bool success) {
        require(timeStart <= (block.timestamp) && block.timestamp <= timeEnd);
        return super.transfer(_to, _amount);
    }

    /// @notice transfer a certain amount of token within a certain period, between timeStart and timeEnd inclusive, on behalf of token owner
    /// @dev 'block.timestamp' should be used instead of 'now'as 'now' is depricated
    /// @param _sender the address who owns the tokens
    /// @param _to the address to which the tokens are transferred
    /// @param _amount the amount of the tokens in wei to be transferred
    /// @return success , indicating if the transfer is successfull
    function transferFrom(address _sender, address _to, uint256 _amount) public override returns (bool success) {
        require(timeStart <= (block.timestamp) && block.timestamp <= timeEnd);
        return super.transferFrom(_sender, _to, _amount);
    }
    
}