// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./IPixelsMetaverse.sol";
import "erc721a/contracts/ERC721A.sol";

contract PMT721 is ERC721A {
    address public minter;

    constructor() ERC721A("PixelsMetavers", "PMT") {}

    function initialize(address _minter) public {
        require(
            minter == address(0) && _nextTokenId() == 0,
            "Only Initialize Can Do It!"
        );
        minter = _minter;
    }

    function mint(address to, uint256 quantity) public {
        require(_msgSenderERC721A() == minter, "Only Minter Can Do It!");
        _safeMint(to, quantity);
    }

    function currentID() public view returns (uint256) {
        return _nextTokenId();
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) internal virtual override {
        IPixelsMetaverse(minter).handleTransfer(
            address(this),
            from,
            to,
            tokenId,
            quantity
        );
    }
}
