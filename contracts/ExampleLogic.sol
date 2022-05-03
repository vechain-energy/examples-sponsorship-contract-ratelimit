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
            uint32 perSeconds,
            bytes32 identifier
        )
    {
        identifier = keccak256(abi.encodePacked(_origin));

        if (nft.balanceOf(_origin) == 0) {
            limit = 1;
            perSeconds = 3600;
        }
    }
}
