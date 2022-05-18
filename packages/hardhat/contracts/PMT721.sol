// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IPixelsMetaverse.sol";

contract PMT721 is ERC721 {
    address public _minter;
    uint256 private _tokenId;
    address public _owner;

    modifier MustMinter(address from) {
        require(from == _minter, "Only Minter Can Do It!");
        _;
    }

    modifier MustOwner(address from) {
        require(from == _owner, "Only Owner Can Do It!");
        _;
    }

    constructor() ERC721("PixelsMetavers", "PMT") {}

    function initialize(address owner, address minter) public {
        require(_owner == address(0), "Only Initialize Can Do It!");
        _owner = owner;
        _minter = minter;
    }

    function mint(address to) public MustMinter(_msgSender()) {
        _mint(to, ++_tokenId);
        _approve(_minter, _tokenId);
    }

    function burn(uint256 id) public {
        require(ownerOf(id) == _msgSender(), "Only Owner Can Do It!");
        _burn(id);
    }

    function setMinter(address minter) public MustOwner(_msgSender()) {
        _minter = minter;
    }

    function setOwner(address owner) public MustOwner(_msgSender()) {
        _owner = owner;
    }

    function currentID() public view returns (uint256) {
        return _tokenId;
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        IPixelsMetavers(_minter).handleTransfer(
            address(this),
            from,
            to,
            tokenId
        );
    }
}