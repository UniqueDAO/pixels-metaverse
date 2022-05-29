// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IPMT721 is IERC721 {
    function getMinter() external returns (address);

    function mint(address to, uint256 quantity) external;

    function burn(uint256 id) external;

    function currentID() external view returns (uint256);
}
