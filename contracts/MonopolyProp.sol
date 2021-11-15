// MonopolyPROP.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MonopolyProp is ERC721Enumerable, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event eNewversion(uint16 indexed old_version, uint16 indexed new_version);

    struct Prop {
        // version number
        uint16 version;
        // id of the cell of Monopoly board
        uint8 cell;
        // rarity level (as a power of 10, i.e rarity = 1 means 10^1 = 10 versions)
        uint8 rarity;
        // serial number
        uint32 serial;
    }

    uint16 private maxVersion;
    uint8 private maxCell;
    uint8 private maxRarity;

    modifier isValid(
        uint16 version,
        uint8 cell,
        uint8 rarity
    ) {
        require(version <= maxVersion, "non valid version id");
        require(propAvbl[version][cell], "not allowed property");
        require(rarity <= maxRarity, "rarity lvl out of range");
        _;
    }

    // serial_by_rarity_by_cell_by_version
    mapping(uint16 => mapping(uint8 => mapping(uint8 => uint16))) serial;
    // list of minted properties
    mapping(uint256 => Prop) private props;
    // list of cells for which properties can be minted (for each version)
    mapping(uint16 => mapping(uint8 => bool)) propAvbl;
    string private baseTokenURI;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) {
        baseTokenURI = _baseTokenURI;

        maxVersion = 0;
        maxCell = 39;
        maxRarity = 2;

        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setupRole(MINTER_ROLE, msg.sender);
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);

        propAvbl[0][1] = true;
        propAvbl[0][3] = true;
        propAvbl[0][5] = true;
        propAvbl[0][6] = true;
        propAvbl[0][8] = true;
        propAvbl[0][9] = true;
        propAvbl[0][11] = true;
        propAvbl[0][13] = true;
        propAvbl[0][14] = true;
        propAvbl[0][15] = true;
        propAvbl[0][16] = true;
        propAvbl[0][18] = true;
        propAvbl[0][19] = true;
        propAvbl[0][21] = true;
        propAvbl[0][23] = true;
        propAvbl[0][24] = true;
        propAvbl[0][25] = true;
        propAvbl[0][26] = true;
        propAvbl[0][27] = true;
        propAvbl[0][29] = true;
        propAvbl[0][31] = true;
        propAvbl[0][32] = true;
        propAvbl[0][34] = true;
        propAvbl[0][35] = true;
        propAvbl[0][37] = true;
        propAvbl[0][39] = true;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(uint256 _id)
        public
        view
        override
        returns (string memory)
    {
        string memory uri = super.tokenURI(_id);

        string memory ext = ".json";

        return string(abi.encodePacked(uri, ext));
    }

    function mint(
        address _to,
        uint16 _version,
        uint8 _cell,
        uint8 _rarity
    )
        public
        onlyRole(MINTER_ROLE)
        isValid(_version, _cell, _rarity)
        returns (uint256 id_)
    {
        id_ = generateID(_version, _cell, _rarity);

        _safeMint(_to, id_);
    }

    function get(uint256 _id)
        public
        view
        returns (
            uint16 version_,
            uint8 cell_,
            uint8 rarity_,
            uint32 serialNumber_
        )
    {
        require(exists(_id), "This property does not exist");

        Prop storage prop = props[_id];

        return (prop.version, prop.cell, prop.rarity, prop.serial);
    }

    function exists(uint256 _id) public view returns (bool) {
        return (props[_id].cell == 0 ? false : true);
    }

    function getAmount(
        uint16 _version,
        uint8 _cell,
        uint8 _rarity
    ) public view isValid(_version, _cell, _rarity) returns (uint32 amount_) {
        return serial[_version][_cell][_rarity];
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        view
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }

    function increaseVersion(uint8[] calldata _list_of_cells)
        public
        onlyRole(ADMIN_ROLE)
    {
        maxVersion += 1;
        for (uint8 i = 0; i < _list_of_cells.length; i++) {
            require(_list_of_cells[i] <= maxCell, "cell_id out of range");
            propAvbl[maxVersion][_list_of_cells[i]] = true;
        }
        emit eNewversion(maxVersion - 1, maxVersion);
    }

    function generateID(
        uint16 _version,
        uint8 _cell,
        uint8 _rarity
    ) internal isValid(_version, _cell, _rarity) returns (uint256 id_) {
        uint32 s = serial[_version][_cell][_rarity];
        require(s < 10**_rarity, "No more tokens IDs left");

        serial[_version][_cell][_rarity] += 1;

        id_ = uint256(keccak256(abi.encode(_version, _cell, _rarity, s)));

        require(!exists(id_), "this property already exists");

        props[id_] = Prop(_version, _cell, _rarity, s);
    }
}
