// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract Avater {
    struct UserAvater {
        address erc721;
        uint256 id;
    }

    mapping(address => UserAvater) private _avater;
    mapping(address => mapping(uint256 => address)) private _ownerOf;

    event AvaterEvent(
        address indexed owner,
        address indexed erc721,
        uint256 indexed id
    );

    constructor() {}

    function setAvater(address erc721, uint256 id) public {
        _avater[msg.sender] = UserAvater(erc721, id);
        emit AvaterEvent(msg.sender, erc721, id);
    }

    function getAvater(address owner) public view returns (UserAvater memory) {
        return _avater[owner];
    }

    function ownerOf(address erc721, uint256 id) public view returns (address) {
        return _ownerOf[erc721][id];
    }
}
