// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./PMT721.sol";

interface IPMT721 {
    function mint(address to, uint256 quantity) external;

    function currentID() external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function initialize(
        string memory name,
        string memory symbol,
        uint256 _MAX_QUANTITY
    ) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

contract PixelsMetaverse {
    address public newPMT721;
    uint256 private _materialId;

    mapping(address => address) private _PMT721Minter;
    event PMT721Event(
        address indexed pmt721,
        address indexed minter,
        string name,
        string desc
    );

    mapping(bytes32 => address) private _dataOwner;
    event DataOwnerEvent(address indexed owner, bytes32 dataBytes);

    struct PMTStruct {
        address pmt721;
        uint256 pmt721_id;
    }
    mapping(uint256 => PMTStruct) private _materialIdToPmt721;

    mapping(address => mapping(uint256 => uint256)) private _composes;
    mapping(address => mapping(uint256 => bytes32)) private _material;

    mapping(address => mapping(uint256 => PMTStruct)) private _acrosss;

    event MaterialEvent(
        address indexed from,
        address indexed to,
        address indexed pmt721,
        uint256 pmt721_id,
        uint256 dataID,
        uint256 configID,
        string rawData,
        bool remake,
        uint256 quantity
    );

    event ConfigEvent(
        address indexed pmt721,
        uint256 indexed pmt721_id,
        string name,
        string time,
        string position,
        string zIndex,
        string decode,
        uint256 sort
    );

    event ComposeEvent(PMTStruct toItem, PMTStruct[] list, bool isAdd);

    function getMaterial(address pmt721, uint256 pmt721_id)
        public
        view
        returns (bytes32 d)
    {
        uint256 curr = pmt721_id;
        uint256 _currentIndex = IPMT721(pmt721).currentID();
        if (curr < _currentIndex) {
            d = _material[pmt721][curr];
            while (d == 0) {
                d = _material[pmt721][--curr];
            }
        }
    }

    modifier Owner(
        address pmt721,
        uint256 pmt721_id,
        address sender
    ) {
        require(sender == IPMT721(pmt721).ownerOf(pmt721_id), "Only the owner");
        _;
    }

    modifier Minter(address pmt721) {
        require(
            msg.sender == _PMT721Minter[pmt721] ||
                _PMT721Minter[pmt721] == address(this),
            "You don't have permission to make it"
        );
        _;
    }

    constructor() {}

    function createPMT721(
        address _minter,
        string memory name,
        string memory desc,
        string memory pmt721Name,
        string memory symbol,
        uint256 _MAX_QUANTITY
    ) external returns (address pmt721) {
        bytes memory bytecode = type(PMT721).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(name, msg.sender));
        assembly {
            pmt721 := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        _PMT721Minter[pmt721] = _minter;
        newPMT721 = pmt721;
        IPMT721(pmt721).initialize(pmt721Name, symbol, _MAX_QUANTITY);
        emit PMT721Event(address(pmt721), _minter, name, desc);
    }

    function setMinter(address _pmt721, address _minter) public {
        require(
            msg.sender == _PMT721Minter[_pmt721],
            "You don't have permission to set it"
        );
        _PMT721Minter[_pmt721] = _minter;
    }

    function getMinter(address _pmt721) public view returns (address) {
        return _PMT721Minter[_pmt721];
    }

    function setDataOwner(bytes32 dataBytes, address to) public {
        require(
            _dataOwner[dataBytes] == msg.sender,
            "You don't have permission to set it"
        );
        _dataOwner[dataBytes] = to;
        emit DataOwnerEvent(msg.sender, dataBytes);
    }

    function setConfig(
        address pmt721,
        uint256 pmt721_id,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 sort
    ) public Owner(pmt721, pmt721_id, msg.sender) {
        uint256 materialId = _composes[pmt721][pmt721_id];
        require(materialId == 0, "The item must not have been synthesized");
        emit ConfigEvent(
            pmt721,
            pmt721_id,
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
            msg.sender == _PMT721Minter[pmt721] ||
                _PMT721Minter[pmt721] == address(this),
            "You don't have permission to make it"
        );
        require(
            quantity > 0 && quantity <= 1024 * 10**18,
            "The quantity must be greater than 0"
        );

        bytes32 d = keccak256(abi.encodePacked(rawData));
        require(_dataOwner[d] == address(0), "This data already has an owner");
        uint256 pmt721_id = IPMT721(pmt721).currentID();
        _make(pmt721, pmt721_id, rawData, d, quantity, msg.sender);

        _dataOwner[d] = msg.sender;
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
    }

    function _reMake(
        address toPmt721,
        address pmt721,
        uint256 pmt721_id,
        uint256 quantity
    ) private {
        require(
            quantity > 0 && quantity <= 1024 * 10**18,
            "The quantity must be greater than 0"
        );
        bytes32 d = getMaterial(pmt721, pmt721_id);
        require(_dataOwner[d] == msg.sender, "Only the owner");
        uint256 _pmt721_id = IPMT721(toPmt721).currentID();
        _make(toPmt721, _pmt721_id, "", d, quantity, msg.sender);
    }

    function reMake(
        address toPmt721,
        address pmt721,
        uint256 pmt721_id,
        uint256 quantity
    )
        public
        Minter(pmt721)
        Minter(toPmt721)
        Owner(pmt721, pmt721_id, msg.sender)
    {
        _reMake(toPmt721, pmt721, pmt721_id, quantity);
    }

    function compose(
        address pmt721,
        PMTStruct[] memory list,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode
    ) public Minter(pmt721) {
        uint256 len = list.length;
        require(len > 1, "The quantity must be greater than 1");
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

        PMTStruct memory p = PMTStruct(pmt721, pmt721_id);

        bytes32 dataBytes;

        for (uint256 i; i < len; i++) {
            PMTStruct memory temp = list[i];
            bytes32 d = getMaterial(temp.pmt721, temp.pmt721_id);
            dataBytes = dataBytes ^ d;
            _compose(_materialId + 1, temp, msg.sender);
        }
        emit ComposeEvent(p, list, true);
        require(
            _dataOwner[dataBytes] == address(0) ||
                _dataOwner[dataBytes] == msg.sender,
            "This data already has an owner"
        );
        _dataOwner[dataBytes] = msg.sender;
        _make(pmt721, pmt721_id, "", dataBytes, 1, msg.sender);
        _materialIdToPmt721[_materialId] = p;
    }

    function _make(
        address pmt721,
        uint256 pmt721_id,
        string memory rawData,
        bytes32 dataBytes,
        uint256 quantity,
        address to
    ) private {
        IPMT721(pmt721).mint(to, quantity);
        _material[pmt721][pmt721_id] = dataBytes;
        _materialId += quantity;
        emit MaterialEvent(
            address(0),
            to,
            pmt721,
            pmt721_id,
            pmt721_id,
            pmt721_id,
            rawData,
            false,
            quantity
        );
    }

    function addition(uint256 materialId, PMTStruct[] memory list) public {
        PMTStruct memory c = _materialIdToPmt721[materialId];
        require(
            msg.sender == _PMT721Minter[c.pmt721] ||
                _PMT721Minter[c.pmt721] == address(this),
            "You don't have permission to edit it"
        );

        require(
            msg.sender == IPMT721(c.pmt721).ownerOf(c.pmt721_id),
            "Only the owner"
        );

        bytes32 dataBytes = getMaterial(c.pmt721, c.pmt721_id);
        uint256 material_id = _composes[c.pmt721][c.pmt721_id];
        require(material_id == 0, "The item must not have been synthesized");
        for (uint256 i; i < list.length; i++) {
            PMTStruct memory temp = list[i];
            bytes32 d1 = getMaterial(temp.pmt721, temp.pmt721_id);
            dataBytes = dataBytes ^ d1;
            _compose(materialId, list[i], msg.sender);
        }
        emit ComposeEvent(c, list, false);
        _dataOwner[dataBytes] = msg.sender;
        _material[c.pmt721][c.pmt721_id] = dataBytes;
    }

    function _compose(
        uint256 materialId,
        PMTStruct memory item,
        address _sender
    ) private Owner(item.pmt721, item.pmt721_id, _sender) {
        uint256 material_id = _composes[item.pmt721][item.pmt721_id];
        require(material_id == 0, "this Material composed");
        _composes[item.pmt721][item.pmt721_id] = materialId;
    }

    function subtract(PMTStruct memory item, PMTStruct[] memory list)
        public
        Owner(item.pmt721, item.pmt721_id, msg.sender)
        Minter(item.pmt721)
    {
        uint256 material_id = _composes[item.pmt721][item.pmt721_id];
        require(material_id == 0, "this Material composed");

        PMTStruct memory t = list[0];
        uint256 materialId = _composes[t.pmt721][t.pmt721_id];
        PMTStruct memory p = _materialIdToPmt721[materialId];
        require(
            p.pmt721_id == item.pmt721_id && p.pmt721 == item.pmt721,
            "error"
        );

        bytes32 dataBytes = getMaterial(item.pmt721, item.pmt721_id);
        uint256 len = list.length;

        if (len == 1) {
            bytes32 d1 = getMaterial(t.pmt721, t.pmt721_id);
            dataBytes = dataBytes ^ d1;
            delete _composes[t.pmt721][t.pmt721_id];
            delete _materialIdToPmt721[t.pmt721_id];
        } else {
            for (uint256 i = 1; i < len; i++) {
                PMTStruct memory temp = list[i];
                uint256 _material_id = _composes[temp.pmt721][temp.pmt721_id];
                require(
                    _material_id == materialId,
                    "The item was not synthesized into the ids"
                );

                bytes32 d2 = getMaterial(temp.pmt721, temp.pmt721_id);
                dataBytes = dataBytes ^ d2;
                delete _composes[temp.pmt721][temp.pmt721_id];
                delete _materialIdToPmt721[materialId];
            }
        }
        emit ComposeEvent(PMTStruct(address(0), 0), list, false);
    }

    function _applyMint(PMTStruct[] memory list)
        private
        view
        returns (bytes32)
    {
        bytes32 dataBytes;
        for (uint256 i = 0; i < list.length; i++) {
            PMTStruct memory temp = list[i];
            dataBytes = _getBytes(dataBytes, temp);
        }
        return dataBytes;
    }

    function _getBytes(bytes32 dataBytes, PMTStruct memory temp)
        private
        view
        returns (bytes32)
    {
        bytes32 d1 = keccak256(abi.encodePacked(temp.pmt721, temp.pmt721_id));
        bytes32 d2 = getMaterial(temp.pmt721, temp.pmt721_id);
        return dataBytes ^ d1 ^ d2;
    }

    function applyMint(address pmt721, PMTStruct[] memory list) public {
        bytes32 dataBytes = _applyMint(list);
        _dataOwner[dataBytes] = msg.sender;
        emit DataOwnerEvent(pmt721, dataBytes);
    }

    function approveMint(address pmt721, PMTStruct[] memory list) public {
        bytes32 dataBytes = _applyMint(list);
        require(
            msg.sender == _PMT721Minter[pmt721],
            "You don't have permission to make it"
        );
        _dataOwner[dataBytes] = pmt721;
    }

    function delivery(address pmt721, PMTStruct[] memory list) public {
        bytes32 dataBytes;
        address owner = _PMT721Minter[pmt721];
        require(
            pmt721 != address(0) && pmt721 != address(this),
            "You don't have permission to make it"
        );

        for (uint256 i = 0; i < list.length; i++) {
            PMTStruct memory temp = list[i];
            dataBytes = _getBytes(dataBytes, temp);
            _acrossContract(owner, pmt721, temp);
        }
        require(
            pmt721 == _dataOwner[dataBytes],
            "You don't have permission to make it"
        );
        delete _dataOwner[dataBytes];
    }

    function _acrossContract(
        address to,
        address toPmt721,
        PMTStruct memory item
    ) private Owner(item.pmt721, item.pmt721_id, msg.sender) {
        PMTStruct memory t = _acrosss[item.pmt721][item.pmt721_id];
        if (t.pmt721 == address(0)) {
            _acrosss[toPmt721][IPMT721(toPmt721).currentID()] = item;
            _reMake(toPmt721, item.pmt721, item.pmt721_id, 1);
        } else {
            PMTStruct memory t1 = t;
            while (toPmt721 != t.pmt721 && t.pmt721 != address(0)) {
                t1 = t;
                t = _acrosss[t.pmt721][t.pmt721_id];
            }
            if (t.pmt721 == address(0)) {
                _acrosss[toPmt721][IPMT721(toPmt721).currentID()] = item;
                _reMake(toPmt721, item.pmt721, item.pmt721_id, 1);
            } else {
                IPMT721(t.pmt721).transferFrom(address(this), to, t.pmt721_id);
                _acrosss[t1.pmt721][t1.pmt721_id] = _acrosss[t.pmt721][
                    t.pmt721_id
                ];
                _acrosss[t.pmt721][t.pmt721_id] = item;
            }
        }

        IPMT721(item.pmt721).transferFrom(
            msg.sender,
            address(this),
            item.pmt721_id
        );
    }

    function acrossContract(
        address to,
        address toPmt721,
        PMTStruct[] memory list
    ) public Minter(toPmt721) {
        for (uint256 i = 0; i < list.length; i++) {
            _acrossContract(to, toPmt721, list[i]);
        }
    }

    function handleTransfer(
        address from,
        address to,
        uint256 pmt721_id,
        uint256 quantity
    ) public {
        require(
            _PMT721Minter[msg.sender] != address(0),
            "Only PMT721 contract calls"
        );
        uint256 _material_id = _composes[msg.sender][pmt721_id];
        require(_material_id == 0, "The item must not have been synthesized");

        if (from != address(0)) {
            emit MaterialEvent(
                from,
                to,
                msg.sender,
                pmt721_id,
                0,
                0,
                "",
                false,
                quantity
            );
        }
    }
}
