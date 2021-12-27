// MonopolyPROP.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./@rarible/royalties/contracts/impl/RoyaltiesV2Impl.sol";
import "./@rarible/royalties/contracts/LibPart.sol";
import "./@rarible/royalties/contracts/LibRoyaltiesV2.sol";

import "./MonopolyBoard.sol";

struct Prop {
	// edition number
	uint16 edition;
	// id of the cell of Monopoly board
	uint8 land;
	// rarity level (as a power of 10, i.e rarity = 1 means 10^1 = 10 versions)
	uint8 rarity;
	// serial number
	uint32 serial;
}

/**
 * @notice
 * @dev Royalties: support royalties implementation with method royaltyInfo() from IERC2981 (see interface declaration at supportsInterface function),
 * inherit from Ownable for Opensea Marketplace
 * and getRaribleV2Royalties method for Rarible Marketplace.
 *
 *
 *
 */
contract MonopolyProp is ERC721Enumerable, AccessControl, Ownable, RoyaltiesV2Impl {
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

	bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

	MonopolyBoard private immutable board;

	function isValidProp(
		uint16 edition,
		uint8 land,
		uint8 rarity
	) public view returns (bool) {
		return
			(edition <= board.getMaxEdition()) &&
			(land <= board.getNbLands(edition)) &&
			(board.isBuildingLand(edition, land)) &&
			(rarity <= board.getRarityLevel(edition));
	}

	mapping(uint256 => Prop) private props;
	// Number of minted properties for each (edition, land, rarity) tuple
	mapping(uint16 => mapping(uint8 => mapping(uint8 => uint16))) numOfProps;

	// Bank contract allowance must be set in migration
	// and 0x58807baD0B376efc12F5AD86aAc70E78ed67deaE OpenSea's ERC721 Proxy Address
	mapping(address => bool) isContractAllowed;

	string private baseTokenURI;

	constructor(
		address board_address,
		string memory _name,
		string memory _symbol,
		string memory _baseTokenURI
	) ERC721(_name, _symbol) {
		baseTokenURI = _baseTokenURI;

		_setupRole(ADMIN_ROLE, msg.sender);
		_setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
		_setupRole(MINTER_ROLE, msg.sender);
		_setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);

		board = MonopolyBoard(board_address);
	}

	function _baseURI() internal view override returns (string memory) {
		return baseTokenURI;
	}

	function tokenURI(uint256 _id) public view override returns (string memory) {
		string memory uri = super.tokenURI(_id);

		string memory ext = ".json";

		return string(abi.encodePacked(uri, ext));
	}

	function mint(
		address _to,
		uint16 _edition,
		uint8 _land,
		uint8 _rarity
	) external onlyRole(MINTER_ROLE) returns (uint256 id_) {
		require(isValidProp(_edition, _land, _rarity), "PROP cannot be minted");
		id_ = generateID(_edition, _land, _rarity);

		_safeMint(_to, id_);
	}

	function get(uint256 _id) public view returns (Prop memory p_) {
		require(exists(_id), "This property does not exist");

		p_ = props[_id];
	}

	function exists(uint256 _id) public view returns (bool) {
		return (
			(props[_id].land == 0) && (props[_id].edition == 0) && (props[_id].rarity == 0) && (props[_id].serial == 0)
				? false
				: true
		);
	}

	function getNbOfProps(
		uint16 _edition,
		uint8 _land,
		uint8 _rarity
	) public view returns (uint32 amount_) {
		require(isValidProp(_edition, _land, _rarity), "PROP does not exist");
		return numOfProps[_edition][_land][_rarity];
	}

	function supportsInterface(bytes4 _interfaceId)
		public
		view
		override(ERC721Enumerable, AccessControl)
		returns (bool)
	{
		if (_interfaceId == LibRoyaltiesV2._INTERFACE_ID_ROYALTIES) {
			return true;
		}

		if (_interfaceId == _INTERFACE_ID_ERC2981) {
			return true;
		}

		return super.supportsInterface(_interfaceId);
	}

	function generateID(
		uint16 _edition,
		uint8 _land,
		uint8 _rarity
	) internal returns (uint256 id_) {
		uint32 serial = numOfProps[_edition][_land][_rarity];
		require(serial < 10**_rarity, "all properties already minted");

		numOfProps[_edition][_land][_rarity] += 1;

		id_ = uint256(keccak256(abi.encode(_edition, _land, _rarity, serial)));

		props[id_] = Prop(_edition, _land, _rarity, serial);
	}

	/*function setRoyalties(
		int256 _tokenId,
		address payable _royaltiesRecipientAddress,
		uint96 _percentageBasisPoints
	) public onlyOwner {
		LibPart.part[] memory _royalties = new LibPart.part[](1);
		_royalties[0].value = _percentageBasisPoints;
		_royalties[0].account = _royaltiesRecipientAddress;
		_saveRoyalties(_tokenId, _royalties);
	}*/

	function setRoyalties(
		uint256 _tokenId,
		uint96 _percentageBasisPoints
	) public onlyRole(ADMIN_ROLE) {
		LibPart.Part[] memory _royalties = new LibPart.Part[](1); // Royalties receiver is unique
		_royalties[0].value = _percentageBasisPoints;
		_royalties[0].account = payable(owner()); // unique royalties receiver is contract owner
		_saveRoyalties(_tokenId, _royalties);
	}

	function royaltyInfo(
		uint256 _tokenId,
		uint256 _salePrice
	) external view returns (
		address receiver,
		uint256 royaltyAmount
	) {
		LibPart.Part[] memory _royalties = royalties[_tokenId];
		if(_royalties.length > 0) {
			return (_royalties[0].account, (_salePrice * _royalties[0].value) / 10000);
		}

		return (address(0), 0);
	}

	/**
     * Override isApprovedForAll to auto-approve OS's proxy contract (OPTIONAL)
     * see : https://docs.opensea.io/docs/polygon-basic-integration#overriding-isapprovedforall-to-reduce-trading-friction
     */
	function isApprovedForAll(
		address _owner,
		address _operator
	) public override view returns (bool isOperator) {
		// if OpenSea's ERC721 Proxy Address is detected, auto-return true
		// if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
		//  	return true;
		// }
		if (isContractAllowed[_operator]) {
			return true;
		}

		// otherwise, use the default ERC721.isApprovedForAll()
		return ERC721.isApprovedForAll(_owner, _operator);
	}

	function setIsContractAllowed(address _address, bool value) external onlyRole(ADMIN_ROLE) {
		isContractAllowed[_address] = value;
	}
}
