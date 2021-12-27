import { useState, useEffect } from "react";
import { ethers } from "ethers";

import PropJson from "../contracts/MonopolyProp.json";
import BuildJson from "../contracts/MonopolyBuild.json";
import MonoJson from "../contracts/MonopolyMono.json";
import BankJson from "../contracts/MonopolyBank.json";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function Land(props) {
  const spinner = <Spinner as="span" animation="border" size="sm" />;

  const landInfo = props.land_info;
  const Bank = props.bank_contract;
  const editionId = props.edition_id;
  const networkId = props.network_id;
  const address = props.address;
  const provider = props.provider;
  const [propBalance, setPropBalance] = useState(null);
  const [propRare, setPropRare] = useState(spinner);
  const [propUncommon, setPropUncommon] = useState(spinner);
  const [propCommon, setPropCommon] = useState(spinner);
  const [propRareLeft, setPropRareLeft] = useState(spinner);
  const [propUncommonLeft, setPropUncommonLeft] = useState(spinner);
  const [propCommonLeft, setPropCommonLeft] = useState(spinner);
  const [buildHouse, setBuildHouse] = useState(spinner);
  const [buildHotel, setBuildHotel] = useState(spinner);

  useEffect(() => {
    if (!(provider && address && networkId && landInfo.id && editionId)) {
      return;
    }

    const Prop = new ethers.Contract(
      PropJson.networks[networkId].address,
      PropJson.abi,
      provider
    );

    const Build = new ethers.Contract(
      BuildJson.networks[networkId].address,
      BuildJson.abi,
      provider.getSigner(address)
    );

    const houseId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint16", "uint8", "uint8"],
        [editionId, landInfo.id, 0]
      )
    );

    const hotelId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint16", "uint8", "uint8"],
        [editionId, landInfo.id, 1]
      )
    );

    Build.balanceOf(address, houseId).then((value) =>
      setBuildHouse(value.toNumber())
    );
    Build.balanceOf(address, hotelId).then((value) =>
      setBuildHotel(value.toNumber())
    );
    Prop.balanceOf(address).then((value) => setPropBalance(value.toNumber()));
  }, [address, provider, networkId, landInfo.id, editionId]);

  useEffect(async () => {
    if (!propBalance) {
      return;
    }

    const Prop = new ethers.Contract(
      PropJson.networks[networkId].address,
      PropJson.abi,
      provider
    );

    const nbOfPropsByRarity = [];
    for (let rarity = 0; rarity < 3; rarity++) {
      nbOfPropsByRarity[rarity] = await Prop.getNbOfProps(
        editionId,
        landInfo.id,
        rarity
      );
    }

    let properties = [];
    let propertiesCountByRarity = [0, 0, 0];
    for (let index = 0; index < propBalance; index++) {
      const idx = await Prop.tokenOfOwnerByIndex(address, index);

      properties[index] = await Prop.get(idx); // can be used
      propertiesCountByRarity[properties[index].rarity]++;
    }

    setPropRare(propertiesCountByRarity[0]);
    setPropUncommon(propertiesCountByRarity[1]);
    setPropCommon(propertiesCountByRarity[2]);
    setPropRareLeft(1 - nbOfPropsByRarity[0]);
    setPropUncommonLeft(10 - nbOfPropsByRarity[1]);
    setPropCommonLeft(100 - nbOfPropsByRarity[2]);
  }, [propBalance]);

  const buyProperty = async (event) => {
    if (!(Bank && editionId && landInfo.id && networkId)) {
      return;
    }

    const rarity = event.target.getAttribute("data-rarity");
    Bank.buyProp(editionId, landInfo.id, rarity).then((value) =>
      console.log("Property buy")
    );
  };

  const buyBuilding = (event) => {
    if (!(Bank && editionId && landInfo.id)) {
      return;
    }

    const type = event.target.getAttribute("data-type");
    Bank.buyBuild(editionId, landInfo.id, type, 1).then();
  };

  if (landInfo.title === "undefined") {
    return (
      <>
        <div>Select a land on board</div>
      </>
    );
  }

  return (
    <>
      <div>{landInfo.title}</div>
      <div>
        Rare price: {landInfo.prices.rare} MONO$
        <br />
        <Button
          variant="primary"
          size="sm"
          onClick={buyProperty}
          data-rarity="0"
        >
          Buy
        </Button>{" "}
        balance: {propRare}, {propRareLeft} left
      </div>
      <div>
        Uncommon price: {landInfo.prices.uncommon} MONO$
        <br />
        <Button
          variant="primary"
          size="sm"
          onClick={buyProperty}
          data-rarity="1"
        >
          Buy
        </Button>{" "}
        balance: {propUncommon}, {propUncommonLeft} left
      </div>
      <div>
        Common price: {landInfo.prices.common} MONO$
        <br />
        <Button
          variant="primary"
          size="sm"
          onClick={buyProperty}
          data-rarity="2"
        >
          Buy
        </Button>{" "}
        balance: {propCommon}, {propCommonLeft} left
      </div>
      <div>
        House price: {landInfo.bprices.house} MONO$
        <br />
        <Button variant="primary" size="sm" onClick={buyBuilding} data-type="0">
          Buy
        </Button>{" "}
        balance: {buildHouse}
      </div>
      <div>
        Hotel price: {landInfo.bprices.hotel} MONO$
        <br />
        <Button variant="primary" size="sm" onClick={buyBuilding} data-type="1">
          Buy
        </Button>{" "}
        balance: {buildHotel}
      </div>
    </>
  );
}
