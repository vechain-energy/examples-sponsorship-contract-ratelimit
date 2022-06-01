// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Sponsorship {
    constructor() {}

    function canSponsorTransactionFor(
        address _origin,
        address _to,
        bytes calldata _data
    ) public view returns (bool) {
        return true;
    }

    function rateLimitSponsorFor(
        address _origin,
        address _to,
        bytes memory _data
    )
        public
        view
        returns (
            uint32 limit,
            uint32 duration,
            bytes32 consumer,
            bytes32 group
        )
    {
        consumer = keccak256(abi.encodePacked(_origin));
        limit = 10;
        duration = 10;
    }
}
