// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract DynamicFeeAMM {
    using Math for uint256;

    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalShares;
    mapping(address => uint256) public shares;
    uint256 public baseFeeBps = 30; // 0.3%
    uint256 public maxFeeBps = 100; // 1%
    uint256 public lastTradeBlock;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 _amountA, uint256 _amountB) external {
        require(tokenA.transferFrom(msg.sender, address(this), _amountA), "Transfer of token A failed");
        require(tokenB.transferFrom(msg.sender, address(this), _amountB), "Transfer of token B failed");

        uint256 sharesIssued;
        if (totalShares == 0) {
            sharesIssued = sqrt(_amountA * _amountB);
        } else {
            uint256 shareA = (_amountA * totalShares) / reserveA;
            uint256 shareB = (_amountB * totalShares) / reserveB;
            sharesIssued = shareA < shareB ? shareA : shareB;
        }

        shares[msg.sender] += sharesIssued;
        totalShares += sharesIssued;
        reserveA += _amountA;
        reserveB += _amountB;
    }

    function calculateDynamicFee() public view returns (uint256) {
        uint256 blocksSinceLastTrade = block.number - lastTradeBlock;
        if (blocksSinceLastTrade >= 100) return baseFeeBps;
        return baseFeeBps + ((100 - blocksSinceLastTrade) * (maxFeeBps - baseFeeBps)) / 100;
    }

    function swap(address _tokenIn, uint256 _amountIn) external {
        require(_tokenIn == address(tokenA) || _tokenIn == address(tokenB), "Invalid token");
        require(_amountIn > 0, "Amount must be greater than 0");

        bool isTokenA = _tokenIn == address(tokenA);
        (IERC20 tokenIn, IERC20 tokenOut, uint256 reserveIn, uint256 reserveOut) = isTokenA
            ? (tokenA, tokenB, reserveA, reserveB)
            : (tokenB, tokenA, reserveB, reserveA);

        require(tokenIn.transferFrom(msg.sender, address(this), _amountIn), "Transfer of tokens failed");

        uint256 amountInWithFee = (_amountIn * (10000 - calculateDynamicFee())) / 10000;
        uint256 amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);

        require(tokenOut.transfer(msg.sender, amountOut), "Transfer of tokens failed");

        if (isTokenA) {
            reserveA += _amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += _amountIn;
            reserveA -= amountOut;
        }

        lastTradeBlock = block.number;
    }

    function removeLiquidity(uint256 _shares) external {
        require(_shares > 0 && _shares <= shares[msg.sender], "Invalid share amount");

        uint256 amountA = (_shares * reserveA) / totalShares;
        uint256 amountB = (_shares * reserveB) / totalShares;

        shares[msg.sender] -= _shares;
        totalShares -= _shares;
        reserveA -= amountA;
        reserveB -= amountB;

        require(tokenA.transfer(msg.sender, amountA), "Transfer of token A failed");
        require(tokenB.transfer(msg.sender, amountB), "Transfer of token B failed");
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}