// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./IPMT721.sol";

contract Avater {
    struct UserAvater {
        address pmt721;
        uint256 id;
    }

    mapping(address => UserAvater) public avater;

    event AvaterEvent(
        address indexed owner,
        address indexed pmt721,
        uint256 indexed id
    );

    modifier Owner(
        address sender,
        address _pmt721,
        uint256 id
    ) {
        require(sender == IPMT721(_pmt721).ownerOf(id), "Only the owner");
        _;
    }

    constructor() {}

    function setAvater(address _pmt721, uint256 id)
        public
        Owner(msg.sender, _pmt721, id)
    {
        avater[msg.sender] = UserAvater(_pmt721, id);
        emit AvaterEvent(msg.sender, _pmt721, id);
    }

    function isAvater(
        address pmt721,
        address from,
        uint256 id
    ) public view returns (bool) {
        return avater[from].id == id && avater[from].pmt721 == pmt721;
    }
}
