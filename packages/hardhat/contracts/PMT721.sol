// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./IPixelsMetaverse.sol";
import "./ERC721A.sol";

contract PMT721 is ERC721A {
    constructor() ERC721A("PixelsMetavers", "PMT") {}

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
