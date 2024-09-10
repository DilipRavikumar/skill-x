// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {
    address public buyer;
    address public freelancer;
    address public arbiter;
    IERC20 public stablecoin;  // USDC contract address on Sepolia

    enum EscrowStatus { NOT_INITIATED, AWAITING_DELIVERY, COMPLETE, REFUNDED }
    EscrowStatus public status;

    constructor(address _freelancer, address _arbiter) {
        buyer = msg.sender;
        freelancer = _freelancer;
        arbiter = _arbiter;
        // Sepolia USDC contract address
        stablecoin = IERC20(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238);
        status = EscrowStatus.NOT_INITIATED;
    }

    function deposit(uint _amount) external {
        require(status == EscrowStatus.NOT_INITIATED, "Already initiated");
        require(msg.sender == buyer, "Only buyer can deposit");
        require(stablecoin.transferFrom(buyer, address(this), _amount), "Transfer failed");
        status = EscrowStatus.AWAITING_DELIVERY;
    }

    function releaseFunds() external {
        require(status == EscrowStatus.AWAITING_DELIVERY, "Not awaiting delivery");
        require(msg.sender == buyer || msg.sender == arbiter, "Not authorized");
        uint256 balance = stablecoin.balanceOf(address(this));
        require(stablecoin.transfer(freelancer, balance), "Transfer failed");
        status = EscrowStatus.COMPLETE;
    }

    function refund() external {
        require(status == EscrowStatus.AWAITING_DELIVERY, "Not awaiting delivery");
        require(msg.sender == buyer || msg.sender == arbiter, "Not authorized");
        uint256 balance = stablecoin.balanceOf(address(this));
        require(stablecoin.transfer(buyer, balance), "Refund failed");
        status = EscrowStatus.REFUNDED;
    }
}
