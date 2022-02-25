// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EpherePassportERC721 is
  Context,
  AccessControlEnumerable,
  ERC721,
  ERC721Enumerable,
  ERC721Pausable
{
  string  private constant PASSPORT_METADATA_JSON_URI = "https://ipfs.ephere.io/ipfs/QmQHrZhURcyejYRBUXgGEsnyKM6SqnDmEjHjpgu3d4KJoN";

  bytes32 public  constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public  constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  uint    private          _maxSupply;

  constructor(uint maxSupply) ERC721("Ephere Passport", "EPS") {
    _maxSupply = maxSupply;
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function mint(address to) public virtual {
    require(hasRole(MINTER_ROLE, _msgSender()), "EpherePassportERC721: must have minter role to mint");
    require(totalSupply() < _maxSupply, "EpherePassportERC721: cannot exceed max total supply");

    _mint(to, totalSupply());
  }

  function setMaxSupply(uint maxSupply) public {
    require(hasRole(MINTER_ROLE, _msgSender()), "EpherePassportERC721: must have minter role to mint");
    require(maxSupply > _maxSupply, "EpherePassportERC721: new max supply must be bigger than current max supply");

    _maxSupply = maxSupply;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "EpherePassportERC721: URI query for nonexistent token");

    return PASSPORT_METADATA_JSON_URI;
  }

  function pause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "EpherePassportERC721: must have pauser role to pause");
    _pause();
  }

  function unpause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "EpherePassportERC721: must have pauser role to unpause");
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
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
