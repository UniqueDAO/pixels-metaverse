// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPixelsMetaverse {
    function handleTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) external;
}
