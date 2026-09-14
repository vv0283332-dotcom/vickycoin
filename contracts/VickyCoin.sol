// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title VickyCoin
 * @notice Fixed-supply ERC-20 token for the VIC project.
 *
 * IMPORTANT:
 * This first version is intentionally simple:
 * - 1,000,000,000 VIC maximum and total supply at deployment
 * - no owner
 * - no admin mint function
 * - standard ERC-20 transfers/approvals
 *
 * The entire initial supply goes to the deployer.
 * Before any mainnet launch, the allocation should be reviewed,
 * tested, and independently audited.
 */
contract VickyCoin is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 ether;

    constructor() ERC20("VickyCoin", "VIC") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
