// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract DAOQuadraticVoting {
    using Math for uint256;

    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
    }

    IERC20 public governanceToken;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => uint256)) public votesUsed;
    uint256 public proposalCount;

    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);
    }

    function createProposal(string memory _description, uint256 _votingPeriod) external {
        proposalCount++;
        proposals[proposalCount] = Proposal(_description, 0, 0, block.timestamp + _votingPeriod, false);
    }

    function vote(uint256 _proposalId, bool _support, uint256 _votes) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.endTime, "Voting has ended");

        uint256 voterBalance = governanceToken.balanceOf(msg.sender);
        require(voterBalance >= _votes, "Not enough tokens");

        uint256 quadraticVotes = sqrt(_votes);
        uint256 totalVotesUsed = votesUsed[_proposalId][msg.sender] + quadraticVotes;

        require(totalVotesUsed <= sqrt(voterBalance), "Exceeds voting power");

        votesUsed[_proposalId][msg.sender] = totalVotesUsed;

        if (_support) {
            proposal.votesFor = proposal.votesFor + quadraticVotes;
        } else {
            proposal.votesAgainst = proposal.votesAgainst  + quadraticVotes;
        }
    }

    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.endTime, "Voting is still ongoing");
        require(!proposal.executed, "Proposal already executed");

        proposal.executed = true;

        if (proposal.votesFor > proposal.votesAgainst) {
            // Execute the proposal (implementation depends on the specific DAO logic)
        }
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