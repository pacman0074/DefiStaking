//SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BlueToken is ERC20 {

    constructor(uint initialSupply) ERC20('BlueToken', 'BLT') {
        _mint(msg.sender, initialSupply);
    }
}