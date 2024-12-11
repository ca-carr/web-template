// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BuyOnlyToken is ERC20, Ownable {
    uint256 public constant TOKEN_PRICE = 0.0001 ether; // Price of 1 token in ETH
    uint256 public immutable unlockBlock; // Block number after which ETH can be withdrawn
    address public immutable withdrawalAddress; // Predefined address for withdrawals

    constructor(uint256 _unlockBlock, address _withdrawalAddress)
        ERC20("BuyOnlyToken", "BOT")
        Ownable(msg.sender) // Pass msg.sender as the initial owner
    {
        require(_unlockBlock > block.number, "Unlock block must be in the future");
        require(_withdrawalAddress != address(0), "Invalid withdrawal address");

        unlockBlock = _unlockBlock; // Set the unlock block
        withdrawalAddress = _withdrawalAddress; // Set the withdrawal address
        _mint(address(this), 1_000_000_000); // Mint 1 billion tokens to the contract
    }

    // Function to buy tokens by sending ETH
    function getToken(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than zero");
        require(msg.value == amount * TOKEN_PRICE, "Incorrect ETH amount sent");
        require(balanceOf(address(this)) >= amount, "Not enough tokens in the contract");

        // Transfer tokens to the buyer
        _transfer(address(this), msg.sender, amount);
    }

    // Function to withdraw all ETH to the predefined address, only after unlockBlock
    function withdraw() external onlyOwner {
        require(block.number >= unlockBlock, "Withdrawals are not allowed yet");

        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No ETH to withdraw");

        // Transfer ETH to the predefined address
        payable(withdrawalAddress).transfer(contractBalance);
    }
}
