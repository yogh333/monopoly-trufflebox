// MonopolyPROP.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./MonopolyPawn.sol";

contract MonopolyBoard is AccessControl {
	bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

	event eNewBoard(uint16 indexed new_edition_nb);

	struct Pawn {
		uint256 id;
		uint8 position;
		uint8[] dices_score;
		uint16 rolls_balance;
	}

	struct Board {
		uint8 nbOfLands;
		uint8 rarityLevel;
		mapping(uint8 => bool) isBuildingLand;
		uint8 buildType;
		mapping(uint256 => Pawn) pawns;
		uint16 nb_pawns_max;
		uint16 nb_pawns;
	}

	uint16 private editionMax;

	mapping(uint16 => Board) private boards;

	MonopolyPawn immutable pawnToken;

	constructor(address pawnToken_address)
		VRFConsumerBase(
			0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
			0x326C977E6efc84E512bB9C30f76E30c160eD06FB  // LINK Token
		)
	{
		keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
		fee = 0.0001 * 10 ** 18; // 0.1 LINK (Varies by network)

		require(pawnToken_address != address(0));

		_setupRole(ADMIN_ROLE, msg.sender);
		_setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);

		editionMax = 0;
		pawnToken = MonopolyPawn(pawnToken_address);

		Board storage b = boards[0];
		b.nbOfLands = 40;
		b.rarityLevel = 2;
		b.isBuildingLand[1] = true;
		b.isBuildingLand[3] = true;
		b.isBuildingLand[5] = true;
		b.isBuildingLand[6] = true;
		b.isBuildingLand[8] = true;
		b.isBuildingLand[9] = true;
		b.isBuildingLand[11] = true;
		b.isBuildingLand[13] = true;
		b.isBuildingLand[14] = true;
		b.isBuildingLand[15] = true;
		b.isBuildingLand[16] = true;
		b.isBuildingLand[18] = true;
		b.isBuildingLand[19] = true;
		b.isBuildingLand[21] = true;
		b.isBuildingLand[23] = true;
		b.isBuildingLand[24] = true;
		b.isBuildingLand[25] = true;
		b.isBuildingLand[26] = true;
		b.isBuildingLand[27] = true;
		b.isBuildingLand[29] = true;
		b.isBuildingLand[31] = true;
		b.isBuildingLand[32] = true;
		b.isBuildingLand[34] = true;
		b.isBuildingLand[35] = true;
		b.isBuildingLand[37] = true;
		b.isBuildingLand[39] = true;

		b.buildType = 1;
	}

	/**
     * @notice Requests randomness
     * @return requestId the id of the request for the oracle
     */
	function getRandomNumber() public returns (bytes32 requestId) {
		require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
		return requestRandomness(keyHash, fee);
	}

	/**
     * @notice Callback function used by VRF Coordinator
     * @param requestId the id of the request for the oracle
     * @param randomness randomness must be requested from an oracle, which generates a number and a cryptographic proof
     */
	function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
		randomResult = randomness % 6 + 1;

		emit GenerateRandomResult(randomResult);
	}

	function isBuildingLand(uint16 edition, uint8 land) external view returns (bool) {
		return boards[edition].isBuildingLand[land];
	}

	function getMaxEdition() external view returns (uint16) {
		return editionMax;
	}

	function getNbLands(uint16 edition) external view returns (uint8) {
		return boards[edition].nbOfLands;
	}

	function getRarityLevel(uint16 edition) external view returns (uint8) {
		return boards[edition].rarityLevel;
	}

	function getBuildType(uint16 edition) external view returns (uint8) {
		return boards[edition].buildType;
	}

	function newBoard(
		uint8 _nbOfLands,
		uint8 _rarityLevel,
		uint8[] calldata _buildingLands,
		uint8 _buildType
	) public onlyRole(ADMIN_ROLE) {
		editionMax += 1;
		Board storage b = boards[editionMax];
		b.nbOfLands = _nbOfLands;
		b.rarityLevel = _rarityLevel;
		for (uint8 i = 0; i < _buildingLands.length; i++) {
			require(_buildingLands[i] < b.nbOfLands, "land index out of range");
			b.isBuildingLand[_buildingLands[i]] = true;
		}

		b.buildType = _buildType;

		emit eNewBoard(editionMax);
	}

	function register(uint16 _edition, uint256 _pawnID) external onlyRole(ADMIN_ROLE) {
		require(_edition <= editionMax, "Unknown edition");
		require(boards[_edition].pawns[_pawnID].id == 0, "pawns already registered");
		require(boards[_edition].nb_pawns + 1 < boards[_edition].nb_pawns_max, "game is full");

		Pawn storage p = boards[_edition].pawns[_pawnID];
		p.id = _pawnID;

		boards[_edition].nb_pawns += 1;

		// emit event new pawn
		//emit ePlayer(_player, _edition);
	}

	function updateRollsBalance(
		uint16 _edition,
		uint256 _pawnID,
		uint16 value
	) external {
		require(boards[_edition].pawns[_pawnID].id != 0, "Unregistered pawn");

		// To be done: check overflow
		boards[_edition].pawns[_pawnID].rolls_balance += value;
	}

	function play(uint16 _edition, uint256 _pawnID) external {
		require(boards[_edition].pawns[_pawnID].id != 0, "Unregistered pawn");
		require(boards[_edition].pawns[_pawnID].rolls_balance > 0, "no more dices roll available");

		// roll dices (randomly, to be improved)
		uint8 dice = 2 + uint8(uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp))) % 11);
		boards[_edition].pawns[_pawnID].dices_score.push(dice);
		boards[_edition].pawns[_pawnID].rolls_balance -= 1;

		// update player's position (modulo boards[edition].nbOfLands)
		boards[_edition].pawns[_pawnID].position += dice % boards[_edition].nbOfLands;

		// emit event with player's new position
		//emit ePosition(msg.sender, _edition, board[edition].players[msg.sender].position);
	}
}
