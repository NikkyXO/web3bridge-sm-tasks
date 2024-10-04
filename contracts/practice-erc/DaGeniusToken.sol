// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DaGeniusToken is ERC1155, Ownable, ERC1155Pausable, ERC1155Supply {
    uint256 public publishedPrice = 0.0001 ether;
    uint256 public maxSupply = 5;

    event MintSuccessful();
    
    constructor()
        ERC1155("ipfs://QmUhJD7WmQDtcJR3tiXyhURRYKcALHM62sBDuPbYweu2Qe/")
        Ownable(msg.sender)
    {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(uint256 id, uint256 amount)
        public payable {
        require(totalSupply(id) + amount <= maxSupply, "minted out");
        require(msg.value >= publishedPrice * amount, "not enough money to mint ether");
        _mint(msg.sender, id, amount, "");
        emit MintSuccessful();

    }

    function uri(uint256 _id) public view virtual override returns(string memory) {
        require(exists(_id), "URI: non existent");
        return string(abi.encodePacked(super.uri(_id), Strings.toString(_id), ".json"));
    }

    

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Pausable, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}