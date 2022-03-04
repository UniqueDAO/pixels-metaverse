// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IPMT721.sol";

contract PixelsMetaverse {
    IPMT721 private PMT721;
    bytes32 emptyBytes;
    mapping(address => uint256) public avater;
    event AvaterEvent(address indexed onwer, uint256 indexed avater);

    struct Material {
        uint256 composed; //被合并到哪个id去了
        bytes32 dataBytes; //原属数据data转换成bytes32
        bool remake; //是否基于当前id再次制作了与该id同样的其他虚拟物品
    }
    mapping(uint256 => Material) public material;

    struct BaseInfo {
        address owner; //原始数据的所有者
        string rawData; //原始数据
    }
    mapping(bytes32 => BaseInfo) public baseInfo;

    /**
        rawData 当前ID的原始数据
        dataID 当前ID的图案数据来自于哪个id  
        configID 当前ID的配置信息来自于哪个id
     */
    event MaterialEvent(
        address indexed onwer,
        uint256 indexed id,
        bytes32 indexed dataBytes,
        string rawData,
        uint256 dataID,
        uint256 configID,
        bool remake
    );

    /**
        sort 当前配置信息拼接的顺序
     */
    event ConfigEvent(
        uint256 indexed id,
        string name,
        string time,
        string position,
        string zIndex,
        string decode,
        uint256 sort
    );

    /**
        beforeFatherID 被合并或解除合并之前的上级id
        afterFatherID 被合并或解除合并之后的上级id
     */
    event ComposeEvent(
        address owner,
        uint256 indexed beforeFatherID,
        uint256 indexed afterFatherID,
        uint256 indexed id
    );

    modifier Owner(address sender, uint256 id) {
        require(IPMT721(PMT721).exits(id), "Items must exist");
        require(sender == IPMT721(PMT721).ownerOf(id), "Only the owner");
        _;
    }

    constructor(address pmt721) {
        PMT721 = IPMT721(pmt721);
        emptyBytes = keccak256(abi.encodePacked(""));
    }

    function setAvater(uint256 id) public Owner(msg.sender, id) {
        avater[msg.sender] = id;
        emit AvaterEvent(msg.sender, id);
    }

    function setConfig(
        uint256 id,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 sort
    ) public Owner(msg.sender, id) {
        emit ConfigEvent(id, name, time, position, zIndex, decode, sort);
        emit MaterialEvent(msg.sender, id, emptyBytes, "", 0, id, false);
    }

    function make(
        string memory name,
        string memory rawData,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 num
    ) public {
        require(num > 0, "The quantity must be greater than 0");

        bytes32 d = keccak256(abi.encodePacked(rawData));
        require(
            baseInfo[d].owner == address(0),
            "This data already has an owner"
        );

        uint256 ID = IPMT721(PMT721).currentID() + num;

        for (uint256 i; i < num; i++) {
            _make(msg.sender, rawData, d, 0, ID);
        }

        baseInfo[d] = BaseInfo(msg.sender, rawData);

        emit ConfigEvent(ID, name, time, position, zIndex, decode, 0);
    }

    function reMake(uint256 id, uint256 num) public Owner(msg.sender, id) {
        Material storage m = material[id];
        BaseInfo storage d = baseInfo[m.dataBytes];
        require(d.owner == msg.sender, "Only the owner");

        for (uint256 i; i < num; i++) {
            _make(msg.sender, d.rawData, m.dataBytes, id, 0);
        }
        material[id].remake = true;
        emit MaterialEvent(msg.sender, id, emptyBytes, "", 0, 0, true);
    }

    function compose(
        uint256[] memory idList,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode
    ) public {
        uint256 len = idList.length;
        require(len > 1, "The quantity must be greater than 1");

        uint256 nextID = IPMT721(PMT721).currentID() + 1;
        bytes32 dataBytes = keccak256(abi.encodePacked(msg.sender, nextID));
        _make(msg.sender, "", dataBytes, 0, nextID);

        for (uint256 i; i < len; i++) {
            _compose(nextID, idList[i], msg.sender);
        }

        baseInfo[dataBytes] = BaseInfo(msg.sender, "");
        emit ConfigEvent(nextID, name, time, position, zIndex, decode, 0);
    }

    function _make(
        address sender,
        string memory rawData,
        bytes32 dataBytes,
        uint256 dataID,
        uint256 configID
    ) private {
        IPMT721(PMT721).mint(sender);
        uint256 id = IPMT721(PMT721).currentID();
        material[id] = Material(0, dataBytes, false);
        emit MaterialEvent(
            msg.sender,
            id,
            dataBytes,
            rawData,
            dataID,
            configID,
            false
        );
    }

    function addition(uint256 ids, uint256[] memory idList)
        public
        Owner(msg.sender, ids)
    {
        for (uint256 i; i < idList.length; i++) {
            _compose(ids, idList[i], msg.sender);
        }
    }

    function _compose(
        uint256 ids,
        uint256 id,
        address _sender
    ) private Owner(_sender, id) {
        require(material[id].composed == 0, "this Material composed");
        material[id].composed = ids;
        emit ComposeEvent(_sender, 0, ids, id);
    }

    function subtract(uint256 ids, uint256[] memory idList)
        public
        Owner(msg.sender, ids)
    {
        Material memory m = material[ids];
        require(m.composed == 0, "The item must not have been synthesized");
        for (uint256 i; i < idList.length; i++) {
            uint256 id = idList[i];
            require(
                material[id].composed == ids,
                "The item was not synthesized into the ids"
            );
            material[id].composed = 0;
            emit ComposeEvent(msg.sender, ids, 0, id);
        }
    }

    function handleTransfer(
        address from,
        address to,
        uint256 id
    ) public {
        Material memory m = material[id];
        require(m.composed == 0, "The item must not have been synthesized");
        require(!m.remake, "This id been remake");
        require(msg.sender == address(PMT721), "Only the owner");
        require(avater[from] != id, "This id been avater");

        if (to == address(0)) {
            delete material[id];
            emit MaterialEvent(address(0), id, emptyBytes, "", 0, 0, false);
        } else if (from != address(0)) {
            emit MaterialEvent(from, id, emptyBytes, "", 0, 0, false);
        }
    }
}
