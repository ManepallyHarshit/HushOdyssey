// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GenesisProtocol
 * @notice Hush Odyssey POAP contract. Mints a soulbound proof-of-completion
 *         token (ERC-1155, ID=1) when a player beats the game.
 */
contract GenesisProtocol is ERC1155, Ownable {
    uint256 public constant GENESIS_POAP_ID = 1;

    /// @dev Prevents double-minting per wallet
    mapping(address => bool) public hasMinted;

    event POAPMinted(address indexed player);

    constructor()
        ERC1155("https://ipfs.io/ipfs/bafybeig.../metadata/{id}.json")
        Ownable(msg.sender)
    {}

    /**
     * @notice Called by React frontend when Unity signals level completion.
     * @param player The wallet address of the player to receive the POAP.
     */
    function mintGenesis(address player) external {
        require(!hasMinted[player], "GenesisProtocol: POAP already minted for this address.");

        hasMinted[player] = true;
        _mint(player, GENESIS_POAP_ID, 1, "");

        emit POAPMinted(player);
    }

    /**
     * @notice Owner can update metadata URI (e.g., after IPFS pin is finalised).
     */
    function setURI(string memory newUri) external onlyOwner {
        _setURI(newUri);
    }
}
