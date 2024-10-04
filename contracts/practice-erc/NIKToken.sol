// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NIkToken is ERC721, ERC721Enumerable, ERC721Pausable, Ownable {
    uint256 private _nextTokenId;
    uint256 public maxSupply = 3;
    uint256 public maxAllowListSupply = 2;

    mapping(address => bool) private allowedListAddresses;

    struct NFT {
        uint256 tokenId;
        address payable creator;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => NFT) public nfts;
    mapping(uint256 => address) public nftOwners;

    event NFTMinted(uint256 tokenId, address creator);
    event NFTListedForSale(uint256 tokenId, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);


    // mint windows
    bool public publicMintOpen = false;
    bool public allowListMintOpen = false;

    constructor()
        ERC721("NIkToken", "NK")
        Ownable(msg.sender)
    {}

    function listNFTForSale(uint256 tokenId, uint256 price) public {
        require(nftOwners[tokenId] == msg.sender, "Only owner can list NFT for sale");
        require(price > 0, "Price must be greater than zero");

        nfts[tokenId].price = price;
        nfts[tokenId].forSale = true;

        emit NFTListedForSale(tokenId, price);
    }

     function totalMintedNFTs() public view returns (uint256) {
        return _nextTokenId;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmY5rPqGTN1rZxMQg2ApiSZc7JiBNs1ryDzXPZpQhC1ibm";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function publicMint() public payable { //address to   onlyOwner
        require(publicMintOpen, "public mint closed");
        require(msg.value == 0.01 ether, "Not enough funds");
        require(totalSupply() < maxSupply, "No more Supply");
        internalMint(msg.value);
    }

    function buyNFT(uint256 tokenId) public payable {
        require(nfts[tokenId].forSale, "This NFT is not for sale");
        require(msg.value == nfts[tokenId].price, "Incorrect price");
        address seller = nftOwners[tokenId];
        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(msg.value);

        nfts[tokenId].forSale = false;
        nftOwners[tokenId] = msg.sender;

        emit NFTSold(tokenId, msg.sender, msg.value);
    }


    // require only allowed address to mint from allowListMint()

    modifier allowedAddressOnly() {
        require(allowedListAddresses[msg.sender], "not allowed to mint in list");
        _;
    }


    function setAllowedList(address[] calldata addresses) external onlyOwner() {
        for (uint256 i = 0; i < addresses.length; i++) {
            allowedListAddresses[addresses[i]] = true;
        }

    }

    function internalMint(uint256 _price) internal {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        nfts[tokenId] = NFT(tokenId, payable(msg.sender), _price, false);
        nftOwners[tokenId] = msg.sender;
        emit NFTMinted(tokenId, msg.sender);
    }


    function allowListMint() external payable {
        require(allowListMintOpen, 'allow mint closed');
        require(msg.value == 0.01 ether, "Not enough funds");
        require(totalSupply() < maxAllowListSupply, "No more Supply");
        internalMint(msg.value);
    }

    // edit mint windows
    function editMintWindows(bool _publicMintOpen, bool _allowLMintOpen) external onlyOwner() {
        publicMintOpen = _publicMintOpen;
        allowListMintOpen = _allowLMintOpen;
    }

    function withdraw() external onlyOwner() {
        payable(owner()).transfer(address(this).balance);

    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
