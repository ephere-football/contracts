// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../contracts/EphereFootballerERC721.sol";
import "../third_party/opensea-creatures/contracts/IFactoryERC721.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

contract EphereINO is
  FactoryERC721,
  Ownable
{

  using Strings for string;

  event Transfer(
    address indexed from,
    address indexed to,
    uint indexed tokenId
  );
  
  struct Minted {
    uint8 tier1;
    uint8 tier2;
    uint8 tier3;
    uint8 tier4;
    uint8 tier5;
    uint8 teamTier1;
    uint8 teamTier2;
    uint8 teamTier3;
  }

  string private constant BASE_TOKEN_URI = "https://fenomeno.ephere.io/ino/";

  uint private constant NUM_OPTIONS = 7;

  uint private constant OPTION_TIER_2 = 3;
  uint private constant OPTION_TIER_3 = 2;
  uint private constant OPTION_TIER_4 = 1;
  uint private constant OPTION_TIER_5 = 0;
  uint private constant OPTION_TEAM_TIER_1 = 6;
  uint private constant OPTION_TEAM_TIER_2 = 5;
  uint private constant OPTION_TEAM_TIER_3 = 4;
  
  uint private constant INDEX_TIER_1 = 0;
  uint private constant INDEX_TIER_2 = 26;
  uint private constant INDEX_TIER_3 = 460;
  uint private constant INDEX_TIER_4 = 1690;
  uint private constant INDEX_TIER_5 = 3940;
  uint private constant INDEX_TEAM_TIER_1 = 8240;
  uint private constant INDEX_TEAM_TIER_2 = 8350;
  uint private constant INDEX_TEAM_TIER_3 = 8900;

  address public immutable _nftAddress;
  address public immutable _proxyRegistryAddress;

  
  /**
   * _cid[   0..  25] = tier-1      (   26 tier-1 ;             ;             ;             ;             )
   * _cid[  26.. 459] = tier-2      (             ;  434 tier-2 ;             ;             ;             )
   * _cid[ 460..1689] = tier-3      (             ;             ; 1230 tier-3 ;             ;             )
   * _cid[1690..3939] = tier-4      (             ;             ;             ; 2250 tier-4 ;             )
   * _cid[3940..8239] = tier-5      (             ;             ;             ;             ; 4300 tier-5 )
   * _cid[8240..8349] = team-tier-1 (             ;   40 tier-2 ;   70 tier-3 ;             ;             ) = (110)
   * _cid[8350..8899] = team-tier-2 (             ;             ;  200 tier-3 ;  350 tier-4 ;             ) = (550)
   * _cid[8900..9999] = team-tier-3 (             ;             ;             ;  400 tier-4 ;  700 tier-5 ) = (1100)
   *                                 -------------;-------------;-------------;-------------;-------------
   *                                    26 tier-1 ;  474 tier-2 ; 1500 tier-3 ; 3000 tier-4 ; 4950 tier-5
   */
  mapping(uint => string) private _cid;
  Minted private _minted;
  bool private _saleOpen = true;

  /**
   * NFT address:
   *  - Mainnet: 0xea7c74254dcdb338a36b8d88f02b8951901a0f30
   *  - Rinkeby: 0xa58e7dcf8b4b61fec504ee4bb0945d5c9a2b3f50
   *
   * OpenSea ProxyRegistry address:
   *  - Mainnet: 0xa5409ec958c83c3f309868babaca7c86dcb077c1
   *  - Rinkeby: 0xf57b2c51ded3a29e6891aba85459d600256cf317
   */
  constructor(address nftAddress, address proxyRegistryAddress) {
    _nftAddress = nftAddress;
    _proxyRegistryAddress = proxyRegistryAddress;

    emitTransferEvents();
  }

  function endSale() public onlyOwner {
    _saleOpen = false;
  }

  function emitTransferEvents() private {
    uint max = numOptions();

    for (uint i = 0; i < max; i++) {
      emit Transfer(address(0), owner(), i);
    }
  }

  function name() override external pure returns (string memory) {
    return "Ephere Initial NFT Offering";
  }

  function numOptions() override public pure returns (uint) {
    return NUM_OPTIONS + 26;
  }

  function supportsFactoryInterface() override public pure returns (bool) {
    return true;
  }

  function symbol() override external pure returns (string memory) {
    return "EphereINO";
  }

  function canMint(uint optionId) override public view returns (bool) {
    if (!_saleOpen) {
        return false;
    }
    
    if (optionId == OPTION_TIER_2) {
      return bytes(_cid[INDEX_TIER_2 + _minted.tier2]).length > 0;
    } else if (optionId == OPTION_TIER_3) {
      return bytes(_cid[INDEX_TIER_3 + _minted.tier3]).length > 0;
    } else if (optionId == OPTION_TIER_4) {
      return bytes(_cid[INDEX_TIER_4 + _minted.tier4]).length > 0;
    } else if (optionId == OPTION_TIER_5) {
      return bytes(_cid[INDEX_TIER_5 + _minted.tier5]).length > 0;
    } else if (optionId == OPTION_TEAM_TIER_1) {
      return bytes(_cid[INDEX_TEAM_TIER_1 + _minted.teamTier1]).length > 0;
    } else if (optionId == OPTION_TEAM_TIER_2) {
      return bytes(_cid[INDEX_TEAM_TIER_2 + _minted.teamTier2]).length > 0;
    } else if (optionId == OPTION_TEAM_TIER_3) {
      return bytes(_cid[INDEX_TEAM_TIER_3 + _minted.teamTier3]).length > 0;
    } else {
      return bytes(_cid[optionId - 7]).length > 0;
    }
  }

  function mint(uint optionId, address toAddress) override public {
    requireSenderIsOwnerOrProxyOwner();
    require(canMint(optionId));
    
    EphereFootballerERC721 erc721 = EphereFootballerERC721(_nftAddress);

    if (optionId == OPTION_TIER_2) {
      uint index = INDEX_TIER_2 + _minted.tier2;
      erc721.mint(_cid[index], toAddress);
      delete _cid[index];
      _minted.tier2++;
    } else if (optionId == OPTION_TIER_3) {
      uint index = INDEX_TIER_3 + _minted.tier3;
      erc721.mint(_cid[index], toAddress);
      delete _cid[index];
      _minted.tier3++;
    } else if (optionId == OPTION_TIER_4) {
      uint index = INDEX_TIER_4 + _minted.tier4;
      erc721.mint(_cid[index], toAddress);
      delete _cid[index];
      _minted.tier4++;
    } else if (optionId == OPTION_TIER_5) {
      uint index = INDEX_TIER_5 + _minted.tier5;
      erc721.mint(_cid[index], toAddress);
      delete _cid[index];
      _minted.tier5++;
    } else if (optionId == OPTION_TEAM_TIER_1) {
      uint index = INDEX_TEAM_TIER_1 + _minted.teamTier1;
      for (uint i = 0; i < 11; i++) {
        erc721.mint(_cid[index + i], toAddress);
        delete _cid[index + i];
      }
      _minted.teamTier1 += 11;
    } else if (optionId == OPTION_TEAM_TIER_2) {
      uint index = INDEX_TEAM_TIER_2 + _minted.teamTier2;
      for (uint i = 0; i < 11; i++) {
        erc721.mint(_cid[index + i], toAddress);
        delete _cid[index + i];
      }
      _minted.teamTier2 += 11;
    } else if (optionId == OPTION_TEAM_TIER_3) {
      uint index = INDEX_TEAM_TIER_3 + _minted.teamTier3;
      for (uint i = 0; i < 11; i++) {
        erc721.mint(_cid[index + i], toAddress);
        delete _cid[index + i];
      }
      _minted.teamTier3 += 11;
    } else {
      uint index = optionId - 7;
      erc721.mint(_cid[index], toAddress);
      delete _cid[index];
    }
  }
  
  function optionIdForTeam(uint optionId) private pure returns(bool) {
    return optionId <= OPTION_TEAM_TIER_1 && optionId >= OPTION_TEAM_TIER_3;
  }

  function queueCid(string[] memory cid, uint offset, uint size) public onlyOwner {
    for (uint i = 0; i < size; i++) {
      _cid[offset + i] = cid[i];
    }
  }

  function requireSenderIsOwnerOrProxyOwner() private view {
    ProxyRegistry proxyRegistry = ProxyRegistry(_proxyRegistryAddress);
    address proxyOwnerAddress = address(proxyRegistry.proxies(owner()));

    assert(_msgSender() == proxyOwnerAddress || _msgSender() == owner());
  }

  function tokenURI(uint optionId) override external pure returns (string memory) {
    return string(abi.encodePacked(BASE_TOKEN_URI, Strings.toString(optionId)));
  }

  /**
   * Hack to get things to work automatically on OpenSea.
   * Use transferFrom so the frontend doesn't have to worry about different method names.
   */
  function transferFrom(address from, address to, uint tokenId) public {
    mint(tokenId, to);
  }

  /**
   * Hack to get things to work automatically on OpenSea.
   * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
   */
  function isApprovedForAll(address ownr, address operator) public view returns (bool) {
    if (ownr == owner() && ownr == operator) {
      return true;
    }

    ProxyRegistry proxyRegistry = ProxyRegistry(_proxyRegistryAddress);
    return owner() == ownr && address(proxyRegistry.proxies(ownr)) == operator;
  }

  /**
   * Hack to get things to work automatically on OpenSea.
   * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
   */
  function ownerOf(uint tokenId) public view returns (address _owner) {
    return owner();
  }

}
