// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./PMT721.sol";

interface IAvater {
    function isAvater(
        address pmt721,
        address from,
        uint256 id
    ) external view returns (bool);
}

interface IPMT721 {
    function mint(address to, uint256 quantity) external;

    function currentID() external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

interface IPMT20 {
    function mint(address to, uint256 quantity) external;

    function burn(address account, uint256 amount) external;

    function balanceOf(address account) external view returns (uint256 amount);
}

contract PixelsMetaverse {
    address public avater;
    address public newPMT721;
    address public PMT20;
    uint256 public materialId;
    uint256 public MAX_NUM = 21_000_000 * 10 ** 18;

    mapping(address => address) public PMT721Minter;
    event PMT721Event(
        address indexed pmt721,
        address indexed minter,
        string name
    );

    mapping(bytes32 => address) public dataOwner;
    event DataOwnerEvent(address indexed owner, bytes32 dataBytes);

    struct PMTStruct {
        address pmt721;
        uint256 pmt721_id;
    }

    mapping(uint256 => PMTStruct) public materialIdToPmt721;
    mapping(address => mapping(uint256 => bytes32)) public material;
    mapping(address => mapping(uint256 => uint256)) public composes;
    mapping(address => mapping(uint256 => uint256)) public pmt721ToMaterialId;

    event MaterialEvent(
        address indexed owner,
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
            d = material[pmt721][curr];
            while (d == 0) {
                d = material[pmt721][--curr];
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
            msg.sender == PMT721Minter[pmt721] ||
                PMT721Minter[pmt721] == address(this),
            "You don't have permission to make it"
        );
        _;
    }

    constructor(address _avater, address _PMT20) {
        avater = _avater;
        PMT20 = _PMT20;
    }

    function createPMT721(string memory name, address _minter)
        external
        returns (address pmt721)
    {
        uint256 balance = IPMT20(PMT20).balanceOf(msg.sender);
        require(balance >= 1024 * 10**18, "Lack of balance");
        bytes memory bytecode = type(PMT721).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(name, msg.sender));
        assembly {
            pmt721 := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        PMT721Minter[pmt721] = _minter;
        newPMT721 = pmt721;
        IPMT20(PMT20).burn(msg.sender, 1024 * 10**18);
        emit PMT721Event(address(pmt721), _minter, name);
    }

    function setMinter(address _pmt721, address _minter) public {
        require(
            msg.sender == PMT721Minter[_pmt721],
            "You don't have permission to set it"
        );
        PMT721Minter[_pmt721] = _minter;
        if (_minter == address(0)) {
            IPMT20(PMT20).mint(msg.sender, 1024 * 10**18);
        }
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
        uint256 pmt721_id,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 sort
    ) public Owner(pmt721, pmt721_id, msg.sender) {
        uint256 _materialId = composes[pmt721][pmt721_id];
        require(_materialId == 0, "The item must not have been synthesized");
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
            msg.sender == PMT721Minter[pmt721] ||
                PMT721Minter[pmt721] == address(this),
            "You don't have permission to make it"
        );
        require(
            quantity > 0 && quantity <= 1024 * 10**18,
            "The quantity must be greater than 0"
        );

        require(
            materialId <= MAX_NUM,
            "The metaverse has reached its maximum carrying capacity"
        );

        bytes32 d = keccak256(abi.encodePacked(rawData));
        require(dataOwner[d] == address(0), "This data already has an owner");
        uint256 pmt721_id = IPMT721(pmt721).currentID();
        _make(pmt721, pmt721_id, rawData, d, quantity, msg.sender);
        IPMT20(PMT20).mint(msg.sender, quantity * 10**18);

        dataOwner[d] = msg.sender;
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
        require(
            quantity > 0 && quantity <= 1024 * 10**18,
            "The quantity must be greater than 0"
        );
        require(
            materialId <= MAX_NUM,
            "The metaverse has reached its maximum carrying capacity"
        );
        bytes32 d = getMaterial(pmt721, pmt721_id);
        require(dataOwner[d] == msg.sender, "Only the owner");
        uint256 _pmt721_id = IPMT721(toPmt721).currentID();
        _make(toPmt721, _pmt721_id, "", d, quantity, msg.sender);
        IPMT20(PMT20).mint(msg.sender, quantity * 10**18);
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
        IPMT20(PMT20).mint(msg.sender, len * 2 * 10**18);

        for (uint256 i; i < len; i++) {
            PMTStruct memory temp = list[i];
            bytes32 d = getMaterial(temp.pmt721, temp.pmt721_id);
            dataBytes = dataBytes ^ d;
            IPMT20(PMT20).mint(dataOwner[d], 3 * 10**18);
            _compose(materialId + 1, temp, msg.sender);
        }
        emit ComposeEvent(p, list, true);
        require(
            dataOwner[dataBytes] == address(0) ||
                dataOwner[dataBytes] == msg.sender,
            "This data already has an owner"
        );
        dataOwner[dataBytes] = msg.sender;
        _make(pmt721, pmt721_id, "", dataBytes, 1, msg.sender);
        materialIdToPmt721[materialId] = p;
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
        material[pmt721][pmt721_id] = dataBytes;
        materialId += quantity;
        emit MaterialEvent(
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

    function addition(uint256 _materialId, PMTStruct[] memory list) public {
        PMTStruct memory c = materialIdToPmt721[_materialId];
        require(
            msg.sender == PMT721Minter[c.pmt721] ||
                PMT721Minter[c.pmt721] == address(this),
            "You don't have permission to edit it"
        );

        require(
            msg.sender == IPMT721(c.pmt721).ownerOf(c.pmt721_id),
            "Only the owner"
        );

        bytes32 dataBytes = getMaterial(c.pmt721, c.pmt721_id);
        uint256 material_id = composes[c.pmt721][c.pmt721_id];
        require(material_id == 0, "The item must not have been synthesized");
        for (uint256 i; i < list.length; i++) {
            PMTStruct memory temp = list[i];
            bytes32 d1 = getMaterial(temp.pmt721, temp.pmt721_id);
            dataBytes = dataBytes ^ d1;
            IPMT20(PMT20).mint(dataOwner[d1], 3 * 10**18);
            _compose(_materialId, list[i], msg.sender);
        }
        emit ComposeEvent(c, list, false);
        dataOwner[dataBytes] = msg.sender;
        material[c.pmt721][c.pmt721_id] = dataBytes;
    }

    function _compose(
        uint256 _materialId,
        PMTStruct memory item,
        address _sender
    ) private Owner(item.pmt721, item.pmt721_id, _sender) {
        uint256 material_id = composes[item.pmt721][item.pmt721_id];
        require(material_id == 0, "this Material composed");
        composes[item.pmt721][item.pmt721_id] = _materialId;
    }

    function subtract(PMTStruct memory item, PMTStruct[] memory list)
        public
        Owner(item.pmt721, item.pmt721_id, msg.sender)
        Minter(item.pmt721)
    {
        uint256 material_id = composes[item.pmt721][item.pmt721_id];
        require(material_id == 0, "this Material composed");

        PMTStruct memory t = list[0];
        uint256 _materialId = composes[t.pmt721][t.pmt721_id];
        PMTStruct memory p = materialIdToPmt721[_materialId];
        require(
            p.pmt721_id == item.pmt721_id && p.pmt721 == item.pmt721,
            "error"
        );

        bytes32 dataBytes = getMaterial(item.pmt721, item.pmt721_id);
        uint256 len = list.length;

        IPMT20(PMT20).burn(msg.sender, 4 * len * 10**18);

        if (len == 1) {
            bytes32 d1 = getMaterial(t.pmt721, t.pmt721_id);
            dataBytes = dataBytes ^ d1;
            delete composes[t.pmt721][t.pmt721_id];
            delete materialIdToPmt721[t.pmt721_id];
        } else {
            for (uint256 i = 1; i < len; i++) {
                PMTStruct memory temp = list[i];
                uint256 _material_id = composes[temp.pmt721][temp.pmt721_id];
                require(
                    _material_id == _materialId,
                    "The item was not synthesized into the ids"
                );

                bytes32 d2 = getMaterial(temp.pmt721, temp.pmt721_id);
                dataBytes = dataBytes ^ d2;
                delete composes[temp.pmt721][temp.pmt721_id];
                delete materialIdToPmt721[_materialId];
            }
        }
        emit ComposeEvent(PMTStruct(address(0), 0), list, false);
    }

    function handleTransfer(
        address from,
        address to,
        uint256 pmt721_id,
        uint256 quantity
    ) public {
        require(msg.sender != to, "Cannot transfer this contract");
        if (PMT721Minter[msg.sender] != address(0)) {
            uint256 _material_id = composes[msg.sender][pmt721_id];
            require(
                _material_id == 0,
                "The item must not have been synthesized"
            );
            bool isAvater = IAvater(avater).isAvater(
                msg.sender,
                from,
                pmt721_id
            );

            require(!isAvater, "This pmt721_id been avater");

            if (PMT721Minter[to] != address(0)) {
                uint256 _materialId = pmt721ToMaterialId[msg.sender][pmt721_id];
                if (_materialId == 0) {
                    uint256 _pmt721_id = IPMT721(to).currentID();
                    bytes32 d = getMaterial(msg.sender, pmt721_id);
                    require(dataOwner[d] == from, "Only the owner");
                    _make(to, _pmt721_id, "", d, quantity, from);
                    pmt721ToMaterialId[to][_pmt721_id] = materialId;
                } else {
                    PMTStruct memory p = materialIdToPmt721[_materialId];
                    IPMT721(p.pmt721).transferFrom(
                        msg.sender,
                        from,
                        p.pmt721_id
                    );

                    pmt721ToMaterialId[p.pmt721][p.pmt721_id] = materialId;
                }

                materialIdToPmt721[materialId] = PMTStruct(
                    msg.sender,
                    pmt721_id
                );
            }

            emit MaterialEvent(
                from,
                msg.sender,
                pmt721_id,
                0,
                0,
                "",
                false,
                quantity
            );

            emit MaterialEvent(
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
