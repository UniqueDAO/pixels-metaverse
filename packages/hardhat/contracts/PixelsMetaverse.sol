// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IPMT721.sol";

contract PixelsMetaverse {
    IPMT721 private PMT721;
    address private immutable _owner;

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

    event ComposeEvent(address indexed owner, uint256 indexed id);

    modifier Exist(uint256 id) {
        require(IPMT721(PMT721).exits(id), "error");
        _;
    }

    modifier IsOwner(address sender, uint256 id) {
        Material memory m = material[id];
        require(sender == m.owner, "error");
        _;
    }

    modifier NoCompose(uint256 id) {
        Material memory m = material[id];
        require(m.compose == 0, "error");
        _;
    }

    constructor(address pmt721) {
        _owner = msg.sender;
        PMT721 = IPMT721(pmt721);
    }

    function setAvater(uint256 id) public IsOwner(msg.sender, id) {
        avater[msg.sender] = id;
    }

    function setTime(uint256 id, string memory time)
        public
        IsOwner(msg.sender, id)
    {
        material[id].time = time;
    }

    function setPosition(uint256 id, string memory position)
        public
        IsOwner(msg.sender, id)
    {
        material[id].position = position;
    }

    function setZIndex(uint256 id, string memory zIndex)
        public
        IsOwner(msg.sender, id)
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
        require(baseInfo[d].owner == address(0), "error");

        for (uint256 i; i < num; i++) {
            _make(time, position, zIndex, msg.sender, d);
        }

        baseInfo[d] = BaseInfo(msg.sender, name, data, decode);
    }

    function reMake(uint256 id, uint256 num) public IsOwner(msg.sender, id) {
        Material storage m = material[id];
        BaseInfo storage b = baseInfo[m.data];
        require(b.owner == msg.sender, "error");
        for (uint256 i; i < num; i++) {
            _make(m.time, m.position, m.zIndex, msg.sender, m.data);
        }
    }

    function _make(
        string memory time,
        string memory position,
        string memory zIndex,
        address sender,
        bytes32 data
    ) private {
        IPMT721(PMT721).mint(sender);
        uint256 id = IPMT721(PMT721).currentID();
        material[id] = Material(id, 0, time, position, zIndex, sender, data);
    }

    function compose(
        uint256[] memory ids,
        string memory name,
        string memory data,
        string memory decode,
        string memory time,
        string memory position,
        string memory zIndex
    ) public {
        uint256 len = ids.length;
        require(len > 1, "error");
        uint256 nextID = IPMT721(PMT721).currentID() + 1;
        bytes32 d = keccak256(abi.encodePacked(data));
        require(baseInfo[d].owner == address(0), "error");
        _make(time, position, zIndex, msg.sender, d);
        for (uint256 i; i < len; i++) {
            uint256 id = ids[i];
            _compose(nextID, id, msg.sender);
        }
        baseInfo[d] = BaseInfo(msg.sender, name, data, decode);
        emit ComposeEvent(msg.sender, nextID);
    }

    function addition(uint256 id, uint256[] memory ids)
        public
        IsOwner(msg.sender, id)
        NoCompose(id)
    {
        for (uint256 i; i < ids.length; i++) {
            require(material[i].compose == 0, "error");
            _compose(id, i, msg.sender);
        }
    }

    function _compose(
        uint256 ids,
        uint256 id,
        address _sender
    ) private IsOwner(_sender, ids) IsOwner(_sender, id) {
        Material memory m = material[id];
        require(_sender == m.owner, "error");
        require(m.compose == 0, "error");
        material[id].compose = ids;
    }

    function cancelCompose(uint256[] memory ids, uint256 id)
        public
        IsOwner(msg.sender, id)
        NoCompose(id)
    {
        for (uint256 i; i < ids.length; i++) {
            require(material[i].compose == id, "error");
            material[i].compose = 0;
        }
        IPMT721(PMT721).burn(id);
    }

    function subtract(uint256[] memory ids, uint256 id)
        public
        IsOwner(msg.sender, id)
        NoCompose(id)
    {
        for (uint256 i; i < ids.length; i++) {
            require(material[i].compose == id, "error");
            material[i].compose = 0;
        }
    }

    function setPMT721(address pmt721) public {
        require(msg.sender == _owner, "error");
        PMT721 = IPMT721(pmt721);
    }

    function handleTransfer(
        address from,
        address to,
        uint256 id
    ) public NoCompose(id) {
        require(msg.sender == address(PMT721), "error");
        if (to == address(0)) {
            delete material[id];
        } else if (from != address(0)) {
            material[id].owner = to;
        }
    }
}
