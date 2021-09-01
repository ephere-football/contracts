// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract EpherERC20 is ERC20Capped, Ownable {

  uint    private constant _maxSupply         = 300000000 * 10**18;

  address private constant _walletAdvisors    = 0xB86bfB0d2b11E2B86b63F7fbD995765474c71f3f;
  address private constant _walletCoreTeamM1  = 0xB621E20f17aafC11ff7408D15B3449ab0dd3FC93;
  address private constant _walletCoreTeamM2  = 0x13C7cECb0ea3987Ded126b59624C898fCBa8feB9;
  address private constant _walletCoreTeamM3  = 0x2Af22f3A5899fE765036d5FeEE97BABa512507E6;
  address private constant _walletPrivateSale = 0xf28FdC5aD77f1426A0cD7F2Dac3f96d93C11d385;
  address private constant _walletPublicSale  = 0xc3691f6e9D1eB05B02CE85B4C7c86D72a06B3cF7;
  address private constant _walletReserve     = 0xD90918CB8adF7daEbaD19AB53bCe2917f8e36077;

  uint    private immutable _created = block.timestamp;

  bool    private _mintedCoreTeamQ1  = false;
  bool    private _mintedCoreTeamQ2  = false;
  bool    private _mintedCoreTeamQ3  = false;
  bool    private _mintedCoreTeamQ4  = false;
  bool    private _mintedCoreTeamQ5  = false;
  bool    private _mintedCoreTeamQ6  = false;
  uint    private _mintedPlayToEarn  = 0;
  bool    private _mintedReserve     = false;

  constructor() ERC20("Epher", "EPH") ERC20Capped(_maxSupply) {
    // Using ERC20._mint because of https://github.com/OpenZeppelin/openzeppelin-contracts/issues/2580
    ERC20._mint(_walletAdvisors,    _maxSupply * 6 / 100);
    ERC20._mint(_walletPrivateSale, _maxSupply * 6 / 100);
    ERC20._mint(_walletPublicSale,  _maxSupply * 8 / 100);
  }

  function mintCoreTeamQ1() public onlyOwner {
    require(block.timestamp > _created + 86400 * 30, "Core Team Q1 tokens can only be minted 30 days after EPH token creation");
    require(!_mintedCoreTeamQ1, "Core Team Q1 tokens were minted already");

    _mint(_walletCoreTeamM1, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM2, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM3, _maxSupply * 1 / 100);
    _mintedCoreTeamQ1 = true;
  }

  function mintCoreTeamQ2() public onlyOwner {
    require(block.timestamp > _created + 86400 * 120, "Core Team Q2 tokens can only be minted 120 days after EPH token creation");
    require(!_mintedCoreTeamQ2, "Core Team Q2 tokens were minted already");

    _mint(_walletCoreTeamM1, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM2, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM3, _maxSupply * 1 / 100);
    _mintedCoreTeamQ2 = true;
  }

  function mintCoreTeamQ3() public onlyOwner {
    require(block.timestamp > _created + 86400 * 210, "Core Team Q3 tokens can only be minted 210 days after EPH token creation");
    require(!_mintedCoreTeamQ3, "Core Team Q3 tokens were minted already");

    _mint(_walletCoreTeamM1, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM2, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM3, _maxSupply * 1 / 100);
    _mintedCoreTeamQ3 = true;
  }

  function mintCoreTeamQ4() public onlyOwner {
    require(block.timestamp > _created + 86400 * 300, "Core Team Q4 tokens can only be minted 300 days after EPH token creation");
    require(!_mintedCoreTeamQ4, "Core Team Q4 tokens were minted already");

    _mint(_walletCoreTeamM1, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM2, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM3, _maxSupply * 1 / 100);
    _mintedCoreTeamQ4 = true;
  }

  function mintCoreTeamQ5() public onlyOwner {
    require(block.timestamp > _created + 86400 * 390, "Core Team Q5 tokens can only be minted 390 days after EPH token creation");
    require(!_mintedCoreTeamQ5, "Core Team Q5 tokens were minted already");

    _mint(_walletCoreTeamM1, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM2, _maxSupply * 1 / 100);
    _mint(_walletCoreTeamM3, _maxSupply * 1 / 100);
    _mintedCoreTeamQ5 = true;
  }

  function mintCoreTeamQ6() public onlyOwner {
    require(block.timestamp > _created + 86400 * 480, "Core Team Q6 tokens can only be minted 480 days after EPH token creation");
    require(!_mintedCoreTeamQ6, "Core Team Q6 tokens were minted already");

    _mint(_walletCoreTeamM1, _maxSupply * 2 / 100);
    _mint(_walletCoreTeamM2, _maxSupply * 2 / 100);
    _mint(_walletCoreTeamM3, _maxSupply * 1 / 100);
    _mintedCoreTeamQ6 = true;
  }

  function mintPlayToEarn(address receiver, uint amount) public onlyOwner {
    require(_mintedPlayToEarn + amount <= _maxSupply * 40 / 100, "Play to Earn tokens were minted already");

    _mint(receiver, amount);
    _mintedPlayToEarn += amount;
  }

  function mintReserve() public onlyOwner {
    require(!_mintedReserve, "Reserve tokens were minted already");

    _mint(_walletReserve, _maxSupply * 20 / 100);
    _mintedReserve = true;
  }

}
