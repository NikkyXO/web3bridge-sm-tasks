// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PredictionMarket {
    struct Market {
        string question;
        uint256 endTime;
        uint256 yesShares;
        uint256 noShares;
        bool resolved;
        bool outcome;
    }

    IERC20 public token;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesSharesBalance;
    mapping(uint256 => mapping(address => uint256)) public noSharesBalance;
    uint256 public marketCount;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function createMarket(string memory _question, uint256 _endTime) external {
        require(_endTime > block.timestamp, "End time must be in the future");
        marketCount++;
        markets[marketCount] = Market(_question, _endTime, 0, 0, false, false);
    }

    function buyShares(uint256 _marketId, bool _prediction, uint256 _amount) external {
        Market storage market = markets[_marketId];
        require(block.timestamp < market.endTime, "Market has ended");
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        if (_prediction) {
            market.yesShares += _amount;
            yesSharesBalance[_marketId][msg.sender] += _amount;
        } else {
            market.noShares += _amount;
            noSharesBalance[_marketId][msg.sender] += _amount;
        }
    }

    function resolveMarket(uint256 _marketId, bool _outcome) external {
        Market storage market = markets[_marketId];
        require(block.timestamp >= market.endTime, "Market has not ended yet");
        require(!market.resolved, "Market already resolved");

        market.resolved = true;
        market.outcome = _outcome;
    }

    function claimRewards(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved yet");

        uint256 reward;
        if (market.outcome && yesSharesBalance[_marketId][msg.sender] > 0) {
            reward = yesSharesBalance[_marketId][msg.sender] * (market.yesShares + market.noShares) / market.yesShares;
            yesSharesBalance[_marketId][msg.sender] = 0;
        } else if (!market.outcome && noSharesBalance[_marketId][msg.sender] > 0) {
            reward = noSharesBalance[_marketId][msg.sender] * (market.yesShares + market.noShares) / market.noShares;
            noSharesBalance[_marketId][msg.sender] = 0;
        }

        require(reward > 0, "No rewards to claim");
        require(token.transfer(msg.sender, reward), "Transfer failed");
    }
}