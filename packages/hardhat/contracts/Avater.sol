// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

interface IPMT721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract Avater {
    struct UserAvater {
        address pmt721;
        uint256 id;
        uint256 chainID;
    }

    mapping(address => UserAvater) public avater;

    event AvaterEvent(
        address indexed owner,
        address indexed pmt721,
        uint256 indexed id,
        uint256 chainID
    );

    modifier Owner(
        address sender,
        address pmt721,
        uint256 id
    ) {
        require(sender == IPMT721(pmt721).ownerOf(id), "Only the owner");
        _;
    }

    constructor() {}

    function setAvater(
        address pmt721,
        uint256 id,
        uint256 chainID
    ) public Owner(msg.sender, pmt721, id) {
        avater[msg.sender] = UserAvater(pmt721, id, chainID);
        emit AvaterEvent(msg.sender, pmt721, id, chainID);
    }

    function isAvater(
        address pmt721,
        address from,
        uint256 id
    ) public view returns (bool) {
        return avater[from].id == id && avater[from].pmt721 == pmt721;
    }
}
