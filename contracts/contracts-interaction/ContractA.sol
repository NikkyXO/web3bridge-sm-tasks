// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract ContractA {
    uint256 public data;

    function setData(uint256 _data) external {
        data =_data;
    }
}