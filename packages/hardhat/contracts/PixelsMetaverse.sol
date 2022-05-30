// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./IPMT721.sol";
import "./PMT721.sol";
import "./IAvater.sol";

contract PixelsMetaverse {
    address public avater;
    address public newPMT721;
    uint256 public materialId;

    mapping(address => address) public PMT721Minter;
    event PMT721Event(
        address indexed pmt721,
        address indexed minter,
        string name
    );

    mapping(bytes32 => address) public dataOwner;
    event DataOwnerEvent(address indexed owner, bytes32 dataBytes);

    struct DataBytesStruct {
        bytes32 dataBytes;
        uint256 id;
    }

    struct PMTStruct {
        address pmt721;
        uint256 id;
    }

    mapping(uint256 => PMTStruct) public materialIdToPmt721;
    mapping(address => mapping(uint256 => bytes32)) public material;
    mapping(address => mapping(uint256 => uint256)) public composes;

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

    function getMaterial(address pmt721, uint256 id)
        public
        view
        returns (DataBytesStruct memory dataBytes)
    {
        uint256 curr = id;
        uint256 _currentIndex = IPMT721(pmt721).currentID();
        if (curr < _currentIndex) {
            bytes32 m = material[pmt721][curr];
            while (m == 0) {
                m = material[pmt721][--curr];
            }
            return DataBytesStruct(m, curr);
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
        uint256 _materialId = composes[pmt721][id];
        require(_materialId == 0, "The item must not have been synthesized");
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
        DataBytesStruct memory d = getMaterial(pmt721, id);
        require(dataOwner[d.dataBytes] == msg.sender, "Only the owner");
        _make(pmt721, "", d.dataBytes, quantity);
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
    ) public Minter(pmt721) {
        uint256 len = list.length;
        require(len > 1, "The quantity must be greater than 1");
        require(
            dataOwner[data] == address(0),
            "This data already has an owner"
        );
        uint256 pmt721_id = IPMT721(pmt721).currentID();
        emit ConfigEvent(
            pmt721,
            pmt721_id,
            name,
            time,
            position,
            zIndex,
            decode,
            0
        );
        _make(pmt721, "", data, 1);

        PMTStruct memory p = PMTStruct(pmt721, pmt721_id);

        for (uint256 i; i < len; i++) {
            _compose(materialId, list[i], msg.sender);
        }
        emit ComposeEvent(p, list, true);
        dataOwner[data] = msg.sender;
        materialIdToPmt721[materialId] = p;
    }

    function _make(
        address pmt721,
        string memory rawData,
        bytes32 dataBytes,
        uint256 quantity
    ) private {
        uint256 pmt721_id = IPMT721(pmt721).currentID();
        IPMT721(pmt721).mint(msg.sender, quantity);
        material[pmt721][pmt721_id] = dataBytes;
        materialId += quantity;
        emit MaterialEvent(
            msg.sender,
            pmt721,
            pmt721_id,
            pmt721_id,
            pmt721_id,
            rawData,
            false,
            quantity
        );
    }

    function addition(uint256 _materialId, PMTStruct[] memory list) public {
        PMTStruct memory c = materialIdToPmt721[_materialId];
        require(
            msg.sender == PMT721Minter[c.pmt721] ||
                PMT721Minter[c.pmt721] == address(this),
            "You don't have permission to edit it"
        );

        require(
            msg.sender == IPMT721(c.pmt721).ownerOf(c.id),
            "Only the owner"
        );
        uint256 material_id = composes[c.pmt721][c.id];
        require(material_id == 0, "The item must not have been synthesized");
        for (uint256 i; i < list.length; i++) {
            _compose(_materialId, list[i], msg.sender);
        }
        emit ComposeEvent(c, list, false);
    }

    function _compose(
        uint256 _materialId,
        PMTStruct memory item,
        address _sender
    ) private Owner(item.pmt721, item.id, _sender) {
        uint256 material_id = composes[item.pmt721][item.id];
        require(material_id == 0, "this Material composed");
        composes[item.pmt721][item.id] = _materialId;
    }

    function subtract(PMTStruct memory item, PMTStruct[] memory list)
        public
        Owner(item.pmt721, item.id, msg.sender)
        Minter(item.pmt721)
    {
        uint256 material_id = composes[item.pmt721][item.id];
        require(material_id == 0, "this Material composed");

        uint256 _materialId = composes[list[0].pmt721][list[0].id];
        PMTStruct memory p = materialIdToPmt721[_materialId];
        require(
            p.id == item.id && p.pmt721 == item.pmt721,
            "this Material composed"
        );

        if (list.length == 1) {
            delete composes[list[0].pmt721][list[0].id];
            delete materialIdToPmt721[list[0].id];
        } else {
            for (uint256 i = 1; i < list.length; i++) {
                PMTStruct memory temp = list[i];
                uint256 _material_id = composes[temp.pmt721][temp.id];
                require(
                    _material_id == _materialId,
                    "The item was not synthesized into the ids"
                );
                delete composes[temp.pmt721][temp.id];
                delete materialIdToPmt721[temp.id];
            }
        }
        emit ComposeEvent(PMTStruct(address(0), 0), list, false);
    }

    function handleTransfer(
        address from,
        address to,
        uint256 id,
        uint256 quantity
    ) public {
        if (PMT721Minter[msg.sender] != address(0)) {
            uint256 _materialId = composes[msg.sender][id];
            require(
                _materialId == 0,
                "The item must not have been synthesized"
            );
            bool isAvater = IAvater(avater).isAvater(msg.sender, from, id);

            require(!isAvater, "This id been avater");

            if (to == address(0)) {
                DataBytesStruct memory d = getMaterial(msg.sender, id);
                if (d.id != id) {
                    material[msg.sender][id + 1] = d.dataBytes;
                } else {
                    material[msg.sender][id] = 0;
                }
            }
            if (from != address(0)) {
                emit MaterialEvent(
                    to,
                    msg.sender,
                    id,
                    0,
                    0,
                    "",
                    false,
                    quantity
                );
            }
        }
    }
}
