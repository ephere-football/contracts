// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EphereFootballerERC721 is
  Context,
  AccessControlEnumerable,
  ERC721Enumerable,
  ERC721Burnable,
  ERC721Pausable
{
  using Counters for Counters.Counter;
  
  string private constant BASE_TOKEN_URI = "https://ipfs.ephere.io/ipfs/";

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  uint public immutable _maxSupply;

  mapping(uint256 => string) _cid;
  Counters.Counter private _tokenIdTracker;

  constructor(uint maxSupply) ERC721("Ephere Football Player", "EFP") {
    _maxSupply = maxSupply;
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function mint(string memory cid, address to) public virtual {
    require(hasRole(MINTER_ROLE, _msgSender()), "EphereFootballerERC721: must have minter role to mint");
    require(totalSupply() < _maxSupply, "EphereFootballerERC721: cannot exceed max total supply");

    // We cannot just use balanceOf to create the new tokenId because tokens
    // can be burned (destroyed), so we need a separate counter.
    _tokenIdTracker.increment();
    uint256 tokenId = _tokenIdTracker.current();
    _mint(to, tokenId);
    _cid[tokenId] = cid;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "EphereFootballerERC721: URI query for nonexistent token");

    return string(abi.encodePacked(BASE_TOKEN_URI, _cid[tokenId]));
  }

  function pause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "EphereFootballerERC721: must have pauser role to pause");
    _pause();
  }

  function unpause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "EphereFootballerERC721: must have pauser role to unpause");
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);

    if (to == address(0)) {
      delete _cid[tokenId];
    }
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControlEnumerable, ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
