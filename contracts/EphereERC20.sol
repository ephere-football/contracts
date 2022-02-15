// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../third_party/pink-antibot/IPinkAntiBot.sol";

contract EphereERC20 is ERC20Capped, Ownable {

  struct Minted {
    bool advisors;
    bool coreTeam;
    uint marketing;
    uint playToEarn;
    bool privateSale;
  }

  uint    private constant _maxSupply         = 300000000 * 10**18;

  uint    private constant _advisorsSupply    = _maxSupply *  3 / 100;
  uint    private constant _coreTeamSupply    = _maxSupply *  2 / 100;
  uint    private constant _marketingSupply   = _maxSupply *  6 / 100;
  uint    private constant _playToEarnSupply  = _maxSupply * 62 / 100;
  uint    private constant _privateSaleSupply = _maxSupply *  2 / 100;

  uint    private constant _playToEarnISupply = 5725080 * 10**18;
  uint    private constant _playToEarnIDisc   = 215760 * 10**18;
  uint    private constant _playToEarnPiDisc  = 70680 * 10**18;

  address private constant _advisorsWallet    = 0xB86bfB0d2b11E2B86b63F7fbD995765474c71f3f;
  address private constant _coreTeamWallet    = 0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93;
  address private constant _marketingWallet   = 0x84435fb5B645dd6290B9714f5a47482F2826b39D;
  address private constant _playToEarnWallet  = 0xD90918CB8adF7daEbaD19AB53bCe2917f8e36077;
  address private constant _privateSaleWallet = 0xf28FdC5aD77f1426A0cD7F2Dac3f96d93C11d385;

  uint    private constant _listingDate       = 1647291600;         // Monday, March 14, 2022 9:00:00 PM
  uint    private constant _oneMonth          = 30 * 24 * 60 * 60;  // 30 days
  uint    private constant _oneQuarter        = 90 * 24 * 60 * 60;  // 90 days
  uint    private constant _oneYear           = 365 * 24 * 60 * 60; // 365 days

  Minted  private          _minted;

  IPinkAntiBot  public     pinkAntiBot;
  bool          public     pinkAntiBotEnabled;

  constructor(address pinkAntiBotAddress) ERC20("Ephere", "EPH") ERC20Capped(_maxSupply) {
    // Minting 15% (Public Sale) + 10% (Liquidity Pool)
    // Using ERC20._mint because of https://github.com/OpenZeppelin/openzeppelin-contracts/issues/2580
    ERC20._mint(msg.sender, _maxSupply * 25 / 100);

    // Setting pink-antibot
    if (pinkAntiBotAddress != msg.sender) {
      pinkAntiBot = IPinkAntiBot(pinkAntiBotAddress);
      pinkAntiBot.setTokenOwner(msg.sender);
      pinkAntiBotEnabled = true;
    }
  }

  function _transfer(address sender, address recipient, uint256 amount) override internal virtual {
    if (pinkAntiBotEnabled) {
      pinkAntiBot.onPreTransferCheck(sender, recipient, amount);
    }

    super._transfer(sender, recipient, amount);
  }

  function mintAdvisorsTokens() public onlyAfterListing("Advisors", _oneYear) onlyOwner {
    require(_minted.advisors == false, "Advisors tokens were already minted");

    ERC20._mint(_advisorsWallet, _advisorsSupply);
    _minted.advisors = true;
  }

  function mintCoreTeamTokens() public onlyAfterListing("Core Team", _oneYear) onlyOwner {
    require(_minted.coreTeam == false, "Core Team tokens were already minted");

    ERC20._mint(_coreTeamWallet, _coreTeamSupply);
    _minted.coreTeam = true;
  }

  function mintMarketingTokens() public onlyOwner {
    require(_minted.marketing < 9, "Marketing tokens were already minted");
    require(block.timestamp > _listingDate + _oneQuarter * _minted.marketing, strcc("Marketing tokens cannot be minted before ", _listingDate + _oneQuarter * _minted.marketing));

    if (_minted.marketing == 0) {
      uint amount = _marketingSupply * 2 / 100;
      ERC20._mint(_marketingWallet, amount);
    } else {
      uint amount = _marketingSupply * 1 / 100;
      ERC20._mint(_marketingWallet, amount);
    }

    _minted.marketing += 1;
  }

  function mintPlayToEarnTokens() public onlyOwner {
    require(_minted.playToEarn < 47, "Play to Earn tokens were already minted");
    require(block.timestamp > _listingDate + _oneMonth * _minted.playToEarn, strcc(strcc(strcc("Play to Earn tokens (", _minted.playToEarn), ") cannot be minted before "), _listingDate + _oneMonth * _minted.playToEarn));

    if (_minted.playToEarn == 0) {
      ERC20._mint(_playToEarnWallet, _playToEarnISupply);
    } else if (_minted.playToEarn == 1) {
      ERC20._mint(_playToEarnWallet, _playToEarnISupply - _playToEarnIDisc);
    } else {
      ERC20._mint(_playToEarnWallet, _playToEarnISupply - _playToEarnIDisc - _playToEarnPiDisc * (_minted.playToEarn - 1));
    }

    _minted.playToEarn += 1;
  }

  function mintPlayToEarnTokensBulk(uint n) public onlyOwner {
    for (uint i = 0; i < n; i++) {
      mintPlayToEarnTokens();
    }
  }

  function mintPrivateSaleTokens() public onlyAfterListing("Private Sale", 0) onlyOwner {
    require(_minted.privateSale == false, "Private Sale tokens were already minted"); 

    ERC20._mint(_privateSaleWallet, _privateSaleSupply);
  }

  function strcc(string memory str1, string memory str2) private pure returns (string memory) {
    return string(abi.encodePacked(str1, str2));
  }

  function strcc(string memory str1, uint str2) private pure returns (string memory) {
    return strcc(str1, Strings.toString(str2));
  }

  modifier onlyAfterListing(string memory allocation, uint cliff) {
    require(block.timestamp > _listingDate + cliff, strcc(strcc(allocation, " tokens cannot be minted before "), _listingDate + cliff));
    _;
  }

}
