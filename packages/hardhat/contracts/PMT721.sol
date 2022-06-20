// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./ERC721A.sol";

interface IPixelsMetaverse721 {
    function handleTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) external;
}

contract PMT721 is ERC721A {
    uint256 private _MAX_QUANTITY;
    bool private _paused;
    modifier Minter() {
        require(
            _msgSenderERC721A() == _minter,
            "You don't have permission to make it"
        );
        _;
    }

    constructor() ERC721A() {}

    function initialize(
        string memory name,
        string memory symbol,
        uint256 MAX_QUANTITY
    ) public Minter {
        _name = name;
        _symbol = symbol;
        _MAX_QUANTITY = MAX_QUANTITY;
    }

    function mint(address to, uint256 quantity) public Minter {
        require(!_paused, "Can't mint");
        require(
            _MAX_QUANTITY == 0 || _nextTokenId() <= _MAX_QUANTITY,
            "Exceed maximum quantity"
        );
        _safeMint(to, quantity);
    }

    function currentID() public view returns (uint256) {
        return _nextTokenId();
    }

    function setPause() public Minter {
        _paused = true;
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) internal virtual override {
        IPixelsMetaverse721(_minter).handleTransfer(
            from,
            to,
            tokenId,
            quantity
        );
    }
}
