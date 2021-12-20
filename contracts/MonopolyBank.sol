// MonopolyBank.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "./MonopolyBoard.sol";
import "./MonopolyMono.sol";
import "./MonopolyProp.sol";
import "./MonopolyBuild.sol";

contract MonopolyBank is AccessControl, IERC721Receiver {
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
	bytes32 public constant BANKER_ROLE = keccak256("BANKER_ROLE");

	MonopolyProp private immutable monopolyPROP;
	MonopolyBuild private immutable monopolyBUILD;
	MonopolyMono private immutable monopolyMONO;

	// price_by_rarity_by_land_by_edition (prop token)
	mapping(uint16 => mapping(uint8 => mapping(uint8 => uint256))) propPrices;

	// price_by_buildtype_by_land_by_edition (build token)
	mapping(uint16 => mapping(uint8 => mapping(uint8 => uint256))) buildPrices;

	event eBuyProp(address indexed to, uint256 indexed prop_id);
	event eBuyBuild(address indexed to, uint256 indexed build_id, uint32 nb);
	event eSellProp(address indexed seller, uint256 indexed prop_id, uint256 price);
	event eSellBuild(address indexed seller, uint256 indexed prop_id, uint256 price);
	event eWithdraw(address indexed to, uint256 value);

	constructor(
		address _monopolyPROP,
		address _monopolyBUILD,
		address _monopolyMONO
	) {
		require(_monopolyPROP != address(0), "PROP token smart contract address must be provided");
		require(_monopolyBUILD != address(0), "BUILD token smart contract address must be provided");
		require(_monopolyMONO != address(0), "MONO token smart contract address must be provided");

		monopolyPROP = MonopolyProp(_monopolyPROP);
		monopolyBUILD = MonopolyBuild(_monopolyBUILD);
		monopolyMONO = MonopolyMono(_monopolyMONO);

		// Set roles
		// Must be set at deployment or in admin ?
		_setupRole(ADMIN_ROLE, msg.sender);
		_setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
		_setupRole(BANKER_ROLE, msg.sender);
		_setRoleAdmin(BANKER_ROLE, ADMIN_ROLE);
	}

	function buyProp(
		uint16 _edition,
		uint8 _land,
		uint8 _rarity
	) public {
		require(monopolyPROP.isValidProp(_edition, _land, _rarity), "PROP does not exist");
		uint256 price = propPrices[_edition][_land][_rarity];

		require(monopolyMONO.transferFrom(msg.sender, address(this), price), "$MONO transfer failed");

		uint256 prop_id = monopolyPROP.mint(msg.sender, _edition, _land, _rarity);

		emit eBuyProp(msg.sender, prop_id);
	}

	function sellProp(uint256 _id) public {
		require(monopolyPROP.ownerOf(_id) == msg.sender, "cannot sell a non owned property");

		//(version, cell, rarity, serial) = monopolyPROP.get(_id);
		Prop memory prop = monopolyPROP.get(_id);

		/* Bank buys PROP at 30% of selling price */
		uint256 price = (propPrices[prop.edition][prop.land][prop.rarity] * 30) / 100;

		require(monopolyMONO.balanceOf(address(this)) >= price, "Bank does not own enough funds");

		monopolyPROP.safeTransferFrom(msg.sender, address(this), _id);

		monopolyMONO.transfer(msg.sender, price);

		emit eSellProp(msg.sender, _id, price);
	}

	function buyBuild(
		uint16 _edition,
		uint8 _land,
		uint8 _buildType,
		uint32 _amount
	) public payable {
		require(monopolyBUILD.isValidBuild(_edition, _land, _buildType), "BUILD does not exist");
		uint256 price = buildPrices[_edition][_land][_buildType];

		require(monopolyMONO.transferFrom(msg.sender, address(this), _amount * price), "$MONO transfer failed");

		uint256 build_id = monopolyBUILD.mint(msg.sender, _edition, _land, _buildType, _amount);

		emit eBuyBuild(msg.sender, build_id, _amount);
	}

	function sellBuild(uint256 _id, uint32 _amount) public {
		Build memory b = monopolyBUILD.get(_id);

		/* Bank buys BUILD at 30% of selling price */
		uint256 price = (buildPrices[b.edition][b.land][b.buildType] * 30 * _amount) / 100;

		require(monopolyMONO.balanceOf(address(this)) >= price, "Bank does not own enough funds");

		monopolyBUILD.burn(msg.sender, _id, _amount);

		monopolyMONO.transfer(msg.sender, price);

		emit eSellBuild(msg.sender, _id, price);
	}

	function getPriceOfProp(
		uint16 _edition,
		uint8 _land,
		uint8 _rarity
	) external view returns (uint256 price) {
		require(monopolyPROP.isValidProp(_edition, _land, _rarity), "PROP does not exist");
		price = propPrices[_edition][_land][_rarity];
	}

	function getPriceOfBuild(
		uint16 _edition,
		uint8 _land,
		uint8 _buildType
	) external view returns (uint256 price) {
		require(monopolyBUILD.isValidBuild(_edition, _land, _buildType), "BUILD does not exist");
		price = buildPrices[_edition][_land][_buildType];
	}

	function setPriceOfProp(
		uint16 _edition,
		uint8 _land,
		uint8 _rarity,
		uint256 _price
	) public onlyRole(BANKER_ROLE) {
		require(monopolyPROP.isValidProp(_edition, _land, _rarity), "PROP does not exist");
		propPrices[_edition][_land][_rarity] = _price;
	}

	function setPriceOfBuild(
		uint16 _edition,
		uint8 _land,
		uint8 _buildType,
		uint256 _price
	) public onlyRole(BANKER_ROLE) {
		require(monopolyBUILD.isValidBuild(_edition, _land, _buildType), "BUILD does not exist");
		buildPrices[_edition][_land][_buildType] = _price;
	}

	function withdraw(address _to, uint256 _value) external onlyRole(BANKER_ROLE) {
		require(monopolyMONO.transfer(_to, _value), "withdraw failure");

		emit eWithdraw(_to, _value);
	}

	function onERC721Received(
		address operator,
		address from,
		uint256 tokenId,
		bytes calldata data
	) external pure override returns (bytes4) {
		return this.onERC721Received.selector;
	}

	function setBoardPrices(
		uint16 editionId,
		uint8 maxLands,
		uint8 maxLandRarities,
		uint16 rarityMultiplier,
		uint16 buildingMultiplier,
		uint256[] calldata commonLandPrices,
		uint256[] calldata commonHousePrices
	) external onlyRole(ADMIN_ROLE) {
		for (uint8 landId = 0; landId < maxLands; landId++) {
			if (commonLandPrices[landId] == 0) {
				continue;
			}

			for (uint8 rarity = 0; rarity < maxLandRarities; rarity++) {
				propPrices[editionId][landId][rarity] = commonLandPrices[landId] * rarityMultiplier ** (maxLandRarities - rarity -1) * (1 ether);
			}

			if (commonHousePrices[landId] == 0) {
				continue;
			}

			buildPrices[editionId][landId][0] = commonHousePrices[landId] * (1 ether);
			buildPrices[editionId][landId][1] = commonHousePrices[landId] * buildingMultiplier * (1 ether);
		}
	}
}
