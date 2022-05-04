// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./NFT.sol";

contract ExampleLogic {
    NFT internal nft;

    constructor(address nftContract) {
        nft = NFT(nftContract);
    }

    function canSponsorTransactionFor(
        address _origin,
        address _to,
        bytes calldata _data
    ) public view returns (bool) {
        if (nft.balanceOf(_origin) > 0) {
            return true;
        }

        return false;
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
        limit = 1;
        duration = 600;

        if (nft.balanceOf(_origin) > 0) {
            group = keccak256("nftOwners");
            limit = 10;
            duration = 10;
        }

        if (_to == address(this)) {
            consumer = keccak256("everyone");
            limit = 10;
            duration = 60;
        }
    }
}
