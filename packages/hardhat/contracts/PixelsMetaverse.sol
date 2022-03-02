// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IPMT721.sol";
import "hardhat/console.sol";

contract PixelsMetaverse {
    IPMT721 private PMT721;
    mapping(address => uint256) public avater;

    struct Material {
        uint256 id;
        uint256 compose;
        string time;
        string position;
        string zIndex;
        address owner;
        bytes32 data;
    }
    mapping(uint256 => Material) public material;

    struct BaseInfo {
        address owner;
        string name;
        string data;
        string decode;
    }
    mapping(bytes32 => BaseInfo) public baseInfo;

    struct MaterialInfo {
        Material material;
        BaseInfo baseInfo;
    }

    event MakeEvent(uint256 indexed id, string indexed data);

    event ComposeEvent(
        address owner,
        uint256 indexed beforeFatherID,
        uint256 indexed afterFatherID,
        uint256 indexed childrenID
    );

    modifier Exist(uint256 id) {
        require(IPMT721(PMT721).exits(id), "error");
        _;
    }

    modifier Owner(address sender, uint256 id) {
        Material memory m = material[id];
        require(sender == m.owner, "error");
        _;
    }

    constructor(address pmt721) {
        PMT721 = IPMT721(pmt721);
    }

    function setAvater(uint256 id) public Owner(msg.sender, id) {
        avater[msg.sender] = id;
    }

    function setTime(uint256 id, string memory time)
        public
        Owner(msg.sender, id)
    {
        material[id].time = time;
    }

    function setPosition(uint256 id, string memory position)
        public
        Owner(msg.sender, id)
    {
        material[id].position = position;
    }

    function setZIndex(uint256 id, string memory zIndex)
        public
        Owner(msg.sender, id)
    {
        material[id].zIndex = zIndex;
    }

    function getMaterial(uint256 id) public view returns (MaterialInfo memory) {
        Material storage m = material[id];
        BaseInfo memory b = baseInfo[m.data];
        return MaterialInfo(m, b);
    }

    function make(
        string memory name,
        string memory data,
        string memory decode,
        string memory time,
        string memory position,
        string memory zIndex,
        uint256 num
    ) public {
        require(num > 0, "error");
        bytes32 d = keccak256(abi.encodePacked(data));
        require(d != keccak256(abi.encodePacked("")), "error");
        require(baseInfo[d].owner == address(0), "error");

        for (uint256 i; i < num; i++) {
            _make(time, position, zIndex, msg.sender, d, data);
        }

        baseInfo[d] = BaseInfo(msg.sender, name, data, decode);
    }

    function reMake(uint256 id, uint256 num) public Owner(msg.sender, id) {
        Material storage m = material[id];
        BaseInfo storage b = baseInfo[m.data];
        require(b.owner == msg.sender, "error");
        for (uint256 i; i < num; i++) {
            _make(m.time, m.position, m.zIndex, msg.sender, m.data, b.data);
        }
    }

    function compose(
        uint256[] memory idList,
        string memory name,
        string memory decode,
        string memory time,
        string memory position,
        string memory zIndex
    ) public {
        uint256 len = idList.length;
        require(len > 1, "error");
        uint256 nextID = IPMT721(PMT721).currentID() + 1;
        bytes32 d = keccak256(abi.encodePacked(msg.sender, nextID));
        _make(time, position, zIndex, msg.sender, d, "");
        for (uint256 i; i < len; i++) {
            _compose(nextID, idList[i], msg.sender);
        }
        baseInfo[d] = BaseInfo(msg.sender, name, "", decode);
    }

    function _make(
        string memory time,
        string memory position,
        string memory zIndex,
        address sender,
        bytes32 d,
        string memory data
    ) private {
        IPMT721(PMT721).mint(sender);
        uint256 id = IPMT721(PMT721).currentID();
        material[id] = Material(id, 0, time, position, zIndex, sender, d);
        emit MakeEvent(id, data);
    }

    function addition(uint256 ids, uint256[] memory idList)
        public
        Owner(msg.sender, ids)
    {
        Material memory m = material[ids];
        require(m.owner == msg.sender, "Only your Material can addtion");
        for (uint256 i; i < idList.length; i++) {
            _compose(ids, idList[i], msg.sender);
        }
    }

    function _compose(
        uint256 ids,
        uint256 id,
        address _sender
    ) private Owner(_sender, id) {
        require(material[id].compose == 0, "this Material composed");
        material[id].compose = ids;
        emit ComposeEvent(_sender, 0, ids, id);
    }

    function subtract(uint256 ids, uint256[] memory idList) public {
        Material memory m = material[ids];
        require(m.compose == 0, "error");
        require(m.owner == msg.sender, "error");
        for (uint256 i; i < idList.length; i++) {
            uint256 id = idList[i];
            require(material[id].compose == ids, "error");
            material[id].compose = 0;
            emit ComposeEvent(msg.sender, ids, 0, id);
        }
    }

    function handleTransfer(
        address from,
        address to,
        uint256 id
    ) public {
        Material memory m = material[id];
        require(m.compose == 0, "error");

        require(msg.sender == address(PMT721), "error");
        if (to == address(0)) {
            delete material[id];
            emit MakeEvent(id, "");
        } else if (from != address(0)) {
            material[id].owner = to;
        }
    }
}
