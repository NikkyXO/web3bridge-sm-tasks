// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TimeLockWallet {
    address public owner;
    uint public unlockDate;
    
    constructor(address _owner, uint _unlockDate) {
        owner = _owner;
        unlockDate = _unlockDate;
    }
    
    receive() external payable {}
    
    function withdraw() public {
        require(msg.sender == owner, "You are not the owner");
        require(block.timestamp >= unlockDate, "Funds are still locked");
        payable(owner).transfer(address(this).balance);
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}