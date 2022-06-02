// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PMT20 is ERC20 {
    address private _minter;
    address private _owner;

    constructor() ERC20("PixelsMetavers", "PMT") {
        _owner = msg.sender;
        _mint(msg.sender, 102400);
    }

    function mint(address to, uint256 amount) public {
        require(_msgSender() == _minter, "Only Minter Can Do It!");
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) public {
        require(_msgSender() == _minter, "Only Minter Can Do It11!");
        _burn(account, amount);
    }

    function setMinter(address account) public {
        require(_msgSender() == _owner, "Only Onwer Can Do It!");
        _minter = account;
    }
}
