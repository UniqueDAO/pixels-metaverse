// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface IAvater {
    function isAvater(
        address pmt721,
        address from,
        uint256 id
    ) external view returns (bool);
}
