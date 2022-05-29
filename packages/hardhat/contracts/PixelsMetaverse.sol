// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./IPMT721.sol";
import "./PMT721.sol";
import "./IAvater.sol";

contract PixelsMetaverse {
    address public avater;
    address public newPMT721;

    struct PMTStruct {
        address pmt721;
        uint256 id;
    }

    mapping(address => address) public PMT721Minter;
    event PMT721Event(
        address indexed pmt721,
        address indexed minter,
        string name
    );

    mapping(bytes32 => address) public dataOwner;
    event DataOwnerEvent(address indexed owner, bytes32 dataBytes);

    mapping(address => mapping(uint256 => bytes32)) public material;
    mapping(address => mapping(uint256 => PMTStruct)) public composes;

    event MaterialEvent(
        address indexed owner,
        address indexed pmt721,
        uint256 id,
        uint256 dataID,
        uint256 configID,
        string rawData,
        bool remake,
        uint256 quantity
    );

    event ConfigEvent(
        address indexed pmt721,
        uint256 indexed id,
        string name,
        string time,
        string position,
        string zIndex,
        string decode,
        uint256 sort
    );

    event ComposeEvent(PMTStruct toItem, PMTStruct[] list, bool isAdd);

    function _getMaterial(address pmt721, uint256 id)
        public
        view
        returns (bytes32 m)
    {
        uint256 curr = id;
        uint256 _currentIndex = IPMT721(pmt721).currentID();
        if (curr < _currentIndex) {
            m = material[pmt721][curr];
            while (m == 0) {
                m = material[pmt721][--curr];
            }
            return m;
        }
    }

    modifier Owner(
        address pmt721,
        uint256 id,
        address sender
    ) {
        require(sender == IPMT721(pmt721).ownerOf(id), "Only the owner");
        _;
    }

    modifier Minter(address pmt721) {
        require(
            msg.sender == PMT721Minter[pmt721] ||
                PMT721Minter[pmt721] == address(this),
            "You don't have permission to make it"
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
        assembly {
            pmt721 := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        PMT721Minter[pmt721] = _minter;
        newPMT721 = pmt721;
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
        address pmt721,
        uint256 id,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 sort
    ) public Owner(pmt721, id, msg.sender) {
        PMTStruct memory c = composes[pmt721][id];
        require(c.id == 0, "The item must not have been synthesized");
        emit ConfigEvent(
            pmt721,
            id,
            name,
            time,
            position,
            zIndex,
            decode,
            sort
        );
    }

    function make(
        address pmt721,
        string memory name,
        string memory rawData,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 quantity
    ) public Minter(pmt721) {
        require(
            msg.sender == PMT721Minter[pmt721] ||
                PMT721Minter[pmt721] == address(this),
            "You don't have permission to make it"
        );
        require(quantity > 0, "The quantity must be greater than 0");

        bytes32 d = keccak256(abi.encodePacked(rawData));
        require(dataOwner[d] == address(0), "This data already has an owner");
        uint256 id = IPMT721(pmt721).currentID();
        _make(pmt721, rawData, d, quantity);

        dataOwner[d] = msg.sender;
        emit ConfigEvent(pmt721, id, name, time, position, zIndex, decode, 0);
    }

    function reMake(
        address pmt721,
        uint256 id,
        uint256 quantity
    ) public Minter(pmt721) Owner(pmt721, id, msg.sender) {
        bytes32 d = _getMaterial(pmt721, id);
        require(dataOwner[d] == msg.sender, "Only the owner");
        _make(pmt721, "", d, quantity);
    }

    function compose(
        address pmt721,
        PMTStruct[] memory list,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        bytes32 data
    ) public {
        uint256 len = list.length;
        require(len > 1, "The quantity must be greater than 1");
        require(
            dataOwner[data] == address(0),
            "This data already has an owner"
        );
        uint256 id = IPMT721(pmt721).currentID();
        emit ConfigEvent(pmt721, id, name, time, position, zIndex, decode, 0);
        _make(pmt721, "", data, 1);

        PMTStruct memory p = PMTStruct(pmt721, id);

        for (uint256 i; i < len; i++) {
            _compose(list[i], p, msg.sender);
        }
        emit ComposeEvent(p, list, true);
        dataOwner[data] = msg.sender;
    }

    function _make(
        address pmt721,
        string memory rawData,
        bytes32 dataBytes,
        uint256 quantity
    ) private {
        uint256 ID = IPMT721(pmt721).currentID();
        IPMT721(pmt721).mint(msg.sender, quantity);
        material[pmt721][ID] = dataBytes;
        emit MaterialEvent(
            msg.sender,
            pmt721,
            ID,
            ID,
            ID,
            rawData,
            false,
            quantity
        );
    }

    function addition(PMTStruct memory item, PMTStruct[] memory list)
        public
        Owner(item.pmt721, item.id, msg.sender)
    {
        for (uint256 i; i < list.length; i++) {
            _compose(item, list[i], msg.sender);
        }
    }

    function getCompose(PMTStruct memory item)
        public
        view
        returns (PMTStruct memory)
    {
        return composes[item.pmt721][item.id];
    }

    function _compose(
        PMTStruct memory item,
        PMTStruct memory toItem,
        address _sender
    ) private Owner(item.pmt721, item.id, _sender) {
        require(
            composes[item.pmt721][item.id].id == 0,
            "this Material composed"
        );
        composes[item.pmt721][item.id] = toItem;
    }

    function subtract(uint256 _nums, uint256[] memory idList)
        public
        Owner(msg.sender, _nums, msg.sender)
    {
        /* Material memory m = _getMaterial(pmt721, id);[_nums];
        require(m.composed == 0, "The item must not have been synthesized");
        for (uint256 i; i < idList.length; i++) {
            uint256 id = idList[i];
            require(
                material[id].composed == _nums,
                "The item was not synthesized into the ids"
            );
            material[id].composed = 0;
        } */
        //emit ComposeEvent(_nums, 0, idList, false);
    }

    function handleTransfer(
        address pmt721,
        address from,
        address to,
        uint256 id,
        uint256 quantity
    ) public {
        /* uint256 id = material[pmt721][id];
        Material memory m = material[id];
        require(m.composed == 0, "The item must not have been synthesized");
        require(msg.sender == pmt721, "Only the owner");
        bool isAvater = IAvater(avater).isAvater(pmt721, from, id);

        require(!isAvater, "This id been avater");

        if (to == address(0)) {
            require(!m.remake, "This id been remake");
            delete material[id];
        }
        if (from != address(0)) {
            //emit MaterialEvent(to, pmt721, id, id, 0, 0, "", false);
        } */
    }
}
