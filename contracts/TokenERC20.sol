// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20 is ERC20 {
    constructor (address reciever) ERC20("Token", "TKN") {
        _mint(reciever, 1000000 * 10**18);
    }
}