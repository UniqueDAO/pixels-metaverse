// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./IPMT721.sol";
import "./PMT721.sol";
import "./IAvater.sol";

contract PixelsMetaverse {
    uint256 public num;
    address public newPMT721;
    address public avater;

    mapping(address => address) public PMT721Minter;
    event PMT721Event(
        address indexed pmt721,
        address indexed minter,
        string name
    );

    mapping(bytes32 => address) public dataOwner;
    event DataOwnerEvent(address indexed owner, bytes32 dataBytes);

    struct Material {
        address pmt721;
        uint256 pmt721_id;
        uint256 composed;
        bytes32 dataBytes;
        bool remake;
    }
    mapping(uint256 => Material) public material;

    mapping(address => mapping(uint256 => uint256)) public id_to_num;

    event MaterialEvent(
        address indexed owner,
        address indexed pmt721,
        uint256 pmt721_id,
        uint256 num,
        uint256 dataID,
        uint256 configID,
        string rawData,
        bool remake
    );

    event ConfigEvent(
        uint256 indexed num,
        string name,
        string time,
        string position,
        string zIndex,
        string decode,
        uint256 sort
    );

    event ComposeEvent(uint256 fromID, uint256 toID, uint256[] num, bool isAdd);

    /* function getMaterial(uint256 _num) public view returns (address) {
        Material memory m = material[_num];
        return address(uint160(m.other));
    } */

    modifier Owner(address sender, uint256 _num) {
        Material memory m = material[_num];
        require(
            sender == IPMT721(m.pmt721).ownerOf(m.pmt721_id),
            "Only the owner"
        );
        _;
    }

    constructor(address _avater) {
        avater = _avater;
    }

    function createPMT721(string memory name, address _minter)
        external
        returns (address pmt721)
    {
        bytes memory bytecode = type(PMT721).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(name, msg.sender));
        uint88 a = uint88(uint256(salt));
        assembly {
            pmt721 := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IPMT721(pmt721).initialize(address(this));
        newPMT721 = pmt721;
        PMT721Minter[pmt721] = _minter;
        emit PMT721Event(address(pmt721), _minter, name);
    }

    function setMinter(address _pmt721, address _minter) public {
        require(
            msg.sender == PMT721Minter[_pmt721],
            "You don't have permission to set it"
        );
        PMT721Minter[_pmt721] = _minter;
    }

    function setDataOwner(bytes32 dataBytes, address to) public {
        require(
            dataOwner[dataBytes] == msg.sender,
            "You don't have permission to set it"
        );
        dataOwner[dataBytes] = to;
        emit DataOwnerEvent(msg.sender, dataBytes);
    }

    function setConfig(
        uint256 _num,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 sort
    ) public Owner(msg.sender, _num) {
        require(
            material[_num].composed == 0,
            "The item must not have been synthesized"
        );
        emit ConfigEvent(_num, name, time, position, zIndex, decode, sort);
    }

    function make(
        address _pmt721,
        string memory name,
        string memory rawData,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 count
    ) public {
        require(
            msg.sender == PMT721Minter[_pmt721] ||
                PMT721Minter[_pmt721] == address(this),
            "You don't have permission to make it"
        );
        require(count > 0, "The quantity must be greater than 0");

        bytes32 d = keccak256(abi.encodePacked(rawData));
        require(dataOwner[d] == address(0), "This data already has an owner");

        uint256 ID = IPMT721(_pmt721).currentID();
        IPMT721(_pmt721).mint(msg.sender, count);
        _make(_pmt721, msg.sender, rawData, d, ID, ID);
        emit ConfigEvent(ID, name, time, position, zIndex, decode, 0);

        reMake(ID, count - 1);
        dataOwner[d] = msg.sender;
    }

    function reMake(uint256 _num, uint256 count) public {
        Material memory m = material[_num];
        require(
            msg.sender == IPMT721(m.pmt721).ownerOf(m.pmt721_id),
            "Only the owner"
        );
        require(dataOwner[m.dataBytes] == msg.sender, "Only the owner");

        emit MaterialEvent(
            msg.sender,
            m.pmt721,
            m.pmt721_id,
            _num,
            0,
            0,
            "",
            true
        );
        for (uint256 i; i < count; i++) {
            _make(m.pmt721, msg.sender, "", m.dataBytes, _num, _num);
        }
        material[_num].remake = true;
    }

    function compose(
        address _pmt721,
        uint256[] memory idList,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode
    ) public {
        uint256 len = idList.length;
        require(len > 1, "The quantity must be greater than 1");

        uint256 nextID = IPMT721(_pmt721).currentID() + 1;
        bytes32 dataBytes = keccak256(abi.encodePacked(_pmt721, nextID));
        emit ConfigEvent(++num, name, time, position, zIndex, decode, 0);
        _make(_pmt721, msg.sender, "", dataBytes, num, num);

        for (uint256 i; i < len; i++) {
            _compose(num, idList[i], msg.sender);
        }
        emit ComposeEvent(0, num, idList, true);
        dataOwner[dataBytes] = msg.sender;
    }

    function _make(
        address _pmt721,
        address sender,
        string memory rawData,
        bytes32 dataBytes,
        uint256 dataID,
        uint256 configID
    ) private {
        uint256 id = IPMT721(_pmt721).currentID();
        material[++num] = Material(_pmt721, id, 0, dataBytes, false);
        emit MaterialEvent(
            msg.sender,
            _pmt721,
            id,
            num,
            dataID,
            configID,
            rawData,
            false
        );
    }

    function addition(uint256 _nums, uint256[] memory idList)
        public
        Owner(msg.sender, _nums)
    {
        for (uint256 i; i < idList.length; i++) {
            _compose(_nums, idList[i], msg.sender);
        }
        emit ComposeEvent(0, _nums, idList, false);
    }

    function _compose(
        uint256 _nums,
        uint256 _num,
        address _sender
    ) private Owner(_sender, _num) {
        require(material[_num].composed == 0, "this Material composed");
        material[_num].composed = _nums;
    }

    function subtract(uint256 _nums, uint256[] memory idList)
        public
        Owner(msg.sender, _nums)
    {
        Material memory m = material[_nums];
        require(m.composed == 0, "The item must not have been synthesized");
        for (uint256 i; i < idList.length; i++) {
            uint256 id = idList[i];
            require(
                material[id].composed == _nums,
                "The item was not synthesized into the ids"
            );
            material[id].composed = 0;
        }
        emit ComposeEvent(_nums, 0, idList, false);
    }

    function handleTransfer(
        address pmt721,
        address from,
        address to,
        uint256 id
    ) public {
        uint256 _num = id_to_num[pmt721][id];
        Material memory m = material[_num];
        require(m.composed == 0, "The item must not have been synthesized");
        require(msg.sender == pmt721, "Only the owner");
        bool isAvater = IAvater(avater).isAvater(pmt721, from, id);

        require(!isAvater, "This id been avater");

        if (to == address(0)) {
            require(!m.remake, "This id been remake");
            delete material[id];
        }
        if (from != address(0)) {
            emit MaterialEvent(to, pmt721, id, _num, 0, 0, "", false);
        }
    }
}
