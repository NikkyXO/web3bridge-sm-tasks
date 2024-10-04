// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleDEX {
    mapping(address => mapping(address => uint256)) public tokenBalances;

    function deposit(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        tokenBalances[msg.sender][token] += amount;
    }

    function withdraw(address token, uint256 amount) external {
        require(tokenBalances[msg.sender][token] >= amount, "Insufficient balance");
        tokenBalances[msg.sender][token] -= amount;
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
    }

    function swap(address fromToken, address toToken, uint256 amount) external {
        require(tokenBalances[msg.sender][fromToken] >= amount, "Insufficient balance");
        
        // Simplified pricing mechanism (1:1 swap ratio)
        uint256 receivedAmount = amount;
        
        tokenBalances[msg.sender][fromToken] -= amount;
        tokenBalances[msg.sender][toToken] += receivedAmount;
    }
}