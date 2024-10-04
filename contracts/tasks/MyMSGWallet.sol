// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract MyMSGWallet{
    uint8 public quorum;
    uint8 public noOfValidSigners;
    uint256 public txCount;
    address public owner;


    struct Transaction {
        uint256 id;
        uint256 amount;
        address sender;
        address recipient;
        bool isCompleted;
        uint256 timestamp;
        uint256 noOfApproval;
        address tokenAddress;
        address[] transactionSigners;
        uint8 updateQuorumAmount;
        TransactionType Ttype;
    }

    //enums
    enum TransactionType {
        Transfer,
        Quorum
    }

    // mappings
    mapping(address => bool) public validSigners;
    mapping(uint => Transaction) public  transactions;
    mapping(address => mapping(uint256 => bool)) public hasSigned;

    // events
    event TransferSuccessful(uint256 indexed txId, uint256 amount);
    event TransactionCreated(uint256 indexed txId, address indexed initiator);
    event SignerApprovedTransactionSuccessfully(address indexed signer, uint256 indexed txId);


    // error
    error AddressZeroNotAllowed();
    error InsufficientFunds(uint256 amount);
    error QuorumMustBeGreaterThanInput();
    error InvalidQuorumAmount();
    error TransactionAlreadyCompleted();
    error ApprovalLimitAlreadyReached(uint8 quorum);
    error NotAValidSigner();
    error SignerAlreadySigned();
    error TransferFailed(uint256 amount);
    error TransactionDoesNotExist();



    constructor(uint8 _quorum, address[] memory _validSigners) {
        if (_quorum < 1) revert QuorumMustBeGreaterThanInput();
        if (_validSigners.length < _quorum) revert InvalidQuorumAmount();
        quorum = _quorum;

        for(uint256 i = 0; i < _validSigners.length; i++) {
            if (_validSigners[i] == address(0)) revert AddressZeroNotAllowed();
            
            validSigners[_validSigners[i]] = true;
            noOfValidSigners = noOfValidSigners + 1;
        }

        validSigners[msg.sender] = true;
        owner = msg.sender;
    }

    function initiateTransactionForTransfer(uint256 _amount, address _recipient, address _tokenAddress) external {
        if (msg.sender == address(0)) revert AddressZeroNotAllowed();
        if (IERC20(_tokenAddress).balanceOf(address(this)) < _amount) revert InsufficientFunds({ amount: _amount });

        txCount = txCount + 1;
        Transaction storage trx = transactions[txCount];

        trx.id = txCount;
        trx.amount = _amount;
        trx.recipient = _recipient;
        trx.sender = msg.sender;
        trx.tokenAddress = _tokenAddress;
        trx.Ttype = TransactionType.Transfer;

        emit TransactionCreated(txCount, msg.sender);

    }


    function initiateTransactionForQuorum(uint8 _newQuorum) external {
        if(_newQuorum > noOfValidSigners) {
            revert InvalidQuorumAmount();
        }
        txCount = txCount + 1;
        Transaction storage trx = transactions[txCount];
        trx.id = txCount;
        trx.sender = msg.sender;
        trx.Ttype = TransactionType.Quorum;
        trx.updateQuorumAmount = _newQuorum;
        emit TransactionCreated({ txId: txCount, initiator: msg.sender });

        
    }

    function approveTx(uint8 _txId) external {
        Transaction storage trx = transactions[_txId];
        if (trx.id == 0) revert TransactionDoesNotExist();
        if (trx.isCompleted) revert TransactionAlreadyCompleted();
        if (trx.noOfApproval >= quorum) revert ApprovalLimitAlreadyReached(quorum);
        if (!validSigners[msg.sender]) revert NotAValidSigner();
        if (hasSigned[msg.sender][_txId] ) revert SignerAlreadySigned();

        trx.noOfApproval += 1;
        trx.transactionSigners.push(msg.sender);

        // keep track of signers for trnsaction
        hasSigned[msg.sender][_txId] = true;

        if (trx.Ttype == TransactionType.Transfer ) {
            if (IERC20(trx.tokenAddress).balanceOf(address(this)) < trx.amount) {
                revert InsufficientFunds(trx.amount);
            }

            if (trx.Ttype == TransactionType.Transfer && trx.noOfApproval == quorum) {
              transfer(_txId);
            }
        }

        if (trx.Ttype == TransactionType.Quorum && trx.noOfApproval == quorum) {
            quorum = trx.updateQuorumAmount;
        }

        emit SignerApprovedTransactionSuccessfully(msg.sender, _txId);

        
    }

    function transfer(uint8 _txId) private {
        Transaction storage trx = transactions[_txId];

        IERC20 token = IERC20(trx.tokenAddress);

        if (!token.transfer(trx.recipient, trx.amount)) revert TransferFailed({ amount: trx.amount });
        
        trx.timestamp = block.timestamp;
        trx.isCompleted = true;
        emit TransferSuccessful({ txId: _txId, amount: trx.amount });
  
    }

}

