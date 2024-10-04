// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IContractA {
    function setData(uint256 _data) external;
    function data() external view returns (uint256);
}



contract ContractB {
    IContractA public contractA;

    constructor(address _contractAddress) {
        contractA = IContractA(_contractAddress);
    }

    function setDataInContractA(uint256 _data) external {
        contractA.setData(_data);
    }
}