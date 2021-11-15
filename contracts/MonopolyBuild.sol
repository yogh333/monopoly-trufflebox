// MonopolyBUILD.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract MonopolyBuild is ERC1155Supply, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event eNewversion(uint16 indexed old_version, uint16 indexed new_version);
    event eNewBuildType(
        uint8 indexed old_max_build_type,
        uint8 indexed new_max_build_type
    );

    struct Build {
        // version number
        uint16 version;
        // id of the cell of Monopoly board
        uint8 cell;
        // build type: e.g. 0 -> house, 1 -> hotel, 2 -> hotel
        uint8 buildType;
    }

    uint16 private maxVersion;
    uint8 private maxCell;
    uint8 private maxBuildType;

    modifier isValid(
        uint16 version,
        uint8 cell,
        uint8 buildType
    ) {
        require(version <= maxVersion, "version_id out of range");
        require(cell <= maxCell, "cell_id out of range");
        require(buildType <= maxBuildType, "build_type out of range");
        _;
    }

    mapping(uint256 => Build) private builds;
    uint256[] private buildIDs;

    constructor(string memory _uri) ERC1155(_uri) {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setupRole(MINTER_ROLE, msg.sender);
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);

        maxVersion = 0;
        maxCell = 39;
        maxBuildType = 1;
    }

    function mint(
        address _to,
        uint16 _version,
        uint8 _cell,
        uint8 _buildType,
        uint32 _supply
    )
        public
        onlyRole(MINTER_ROLE)
        isValid(_version, _cell, _buildType)
        returns (uint256 id_)
    {
        id_ = generateID(_version, _cell, _buildType);

        _mint(_to, id_, _supply, "");
    }

    function get(uint256 _id)
        public
        view
        returns (
            uint16 version_,
            uint8 cell_,
            uint8 buildType_
        )
    {
        require(exists(_id), "This build does not exist");

        Build storage build = builds[_id];

        return (build.version, build.cell, build.buildType);
    }

    function burn(
        address _account,
        uint256 _id,
        uint32 _amount
    ) public {
        _burn(_account, _id, _amount);
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }

    function increaseVersion() public onlyRole(ADMIN_ROLE) {
        maxVersion += 1;
        emit eNewversion(maxVersion - 1, maxVersion);
    }

    function increaseBuildType() public onlyRole(ADMIN_ROLE) {
        maxBuildType += 1;
        emit eNewBuildType(maxBuildType - 1, maxBuildType);
    }

    function totalID() public view returns (uint256) {
        return buildIDs.length;
    }

    function getIDByIndex(uint256 _index) public view returns (uint256) {
        return buildIDs[_index];
    }

    function generateID(
        uint16 _version,
        uint8 _cell,
        uint8 _buildType
    ) internal returns (uint256 id_) {
        id_ = uint256(keccak256(abi.encode(_version, _cell, _buildType)));

        if (!exists(id_)) {
            buildIDs.push(id_);
            builds[id_] = Build(_version, _cell, _buildType);
        }
    }
}
