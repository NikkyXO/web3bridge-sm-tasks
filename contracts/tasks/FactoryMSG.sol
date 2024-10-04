// contracts/MultiSigWalletFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyMSGWallet.sol";

contract MultiSigWalletFactory {

    MyMSGWallet[] public multisigClones;
    // bytes32[] public deployedAdresses;

    event WalletCreated(address indexed wallet, address[] indexed validSigners, uint8 quorum);

    function createMultiSigWallet(address[] memory _validSigners, uint8 quorum)
        external
        returns (address wallet)
    {
        MyMSGWallet newMsgWallet = new MyMSGWallet(quorum, _validSigners);
        emit WalletCreated(address(newMsgWallet), _validSigners, quorum);
        multisigClones.push(newMsgWallet);
        // deployedAdresses.push(address(newMsgWallet));
        return address(newMsgWallet);
    }

    function getDeployedWallet(uint index) public view returns (address) {
        return address(multisigClones[index]);
    }
}
