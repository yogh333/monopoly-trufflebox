// MonopolyPROP.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MonopolyPawn is ERC721Enumerable, AccessControl {
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

	string private baseTokenURI;

	mapping(address => uint256) playerTopawn;

	constructor(
		string memory _name,
		string memory _symbol,
		string memory _baseTokenURI
	) ERC721(_name, _symbol) {
		baseTokenURI = _baseTokenURI;

		_setupRole(ADMIN_ROLE, msg.sender);
		_setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
		_setupRole(MINTER_ROLE, msg.sender);
		_setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
	}

	function _baseURI() internal view override returns (string memory) {
		return baseTokenURI;
	}

	function tokenURI(uint256 _id) public view override returns (string memory) {
		string memory uri = super.tokenURI(_id);

		string memory ext = ".json";

		return string(abi.encodePacked(uri, ext));
	}

	function mint(address _to) external onlyRole(MINTER_ROLE) returns (uint256 id_) {
		require(playerTopawn[_to] == 0, "player already owns a pawn");

		id_ = generateID(_to);

		playerTopawn[_to] = id_;

		_safeMint(_to, id_);
	}

	function supportsInterface(bytes4 _interfaceId)
		public
		view
		override(ERC721Enumerable, AccessControl)
		returns (bool)
	{
		return super.supportsInterface(_interfaceId);
	}

	/*function get(uint256 _id) public view returns (Prop memory p_) {
		require(exists(_id), "This property does not exist");

		p_ = props[_id];
	}*/

	function generateID(address player) internal view returns (uint256 id_) {
		return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, player)));
	}
}
