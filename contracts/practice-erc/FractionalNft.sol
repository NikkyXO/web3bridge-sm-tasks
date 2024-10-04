// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FractionalNFT is ERC20, Ownable {
    IERC721 public nft;
    uint256 public tokenId;
    uint256 public constant TOTAL_SHARES = 1000000;
    bool public initialized = false;
    uint256 public buyoutPrice;
    bool public forSale = false;

    constructor() ERC20("Fractional NFT", "FNFT") Ownable(msg.sender) {}

    function initialize(address _nft, uint256 _tokenId, uint256 _buyoutPrice) external onlyOwner {
        require(!initialized, "Already initialized");
        nft = IERC721(_nft);
        tokenId = _tokenId;
        buyoutPrice = _buyoutPrice;
        initialized = true;

        nft.transferFrom(msg.sender, address(this), tokenId);
        _mint(msg.sender, TOTAL_SHARES);
    }

    function putUpForSale(uint256 _newBuyoutPrice) external onlyOwner {
        buyoutPrice = _newBuyoutPrice;
        forSale = true;
    }

    function cancelSale() external onlyOwner {
        forSale = false;
    }

    function buyout() external payable {
        require(forSale, "NFT not for sale");
        require(msg.value >= buyoutPrice, "Insufficient payment");

        uint256 excess = msg.value - buyoutPrice;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }

        // Distribute buyout amount to shareholders
        uint256 totalSupply = totalSupply();
        for (uint256 i = 0; i < TOTAL_SHARES; i++) {
            address shareholder = _getShareholderAtIndex(i);
            if (shareholder != address(0)) {
                uint256 shareAmount = buyoutPrice * balanceOf(shareholder) / totalSupply;
                payable(shareholder).transfer(shareAmount);
            }
        }

        // Transfer NFT to buyer
        nft.transferFrom(address(this), msg.sender, tokenId);

        // Burn all shares
        _burn(address(this), totalSupply);

        // Reset contract state
        initialized = false;
        forSale = false;
    }

    // Helper function to get shareholder address at a given index
    function _getShareholderAtIndex(uint256 index) internal view returns (address) {
        bytes32 accountHash = keccak256(abi.encodePacked(index, address(this)));
        return address(uint160(uint256(accountHash)));
    }
}
