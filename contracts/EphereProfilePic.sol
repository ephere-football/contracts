// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract EphereProfilePic is ERC721PresetMinterPauserAutoId {
  string  private constant BASE_TOKEN_URI = "https://pfp.ephere.io/erc721/";

  constructor() ERC721PresetMinterPauserAutoId("Ephere Profile Picture", "EPFP", BASE_TOKEN_URI) {}
}
