import { useState, useEffect } from "react";
import { ethers } from "ethers";

import PropJson from "../contracts/MonopolyProp.json";
import BuildJson from "../contracts/MonopolyBuild.json";
import MonoJson from "../contracts/MonopolyMono.json";
import BankJson from "../contracts/MonopolyBank.json";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function Land(props) {
  const spinner = <Spinner as="span" animation="border" size="sm" />

  const landInfo = props.land_info
  const Bank = props.bank_contract
  const editionId = props.edition_id
  const networkId = props.network_id
  const address = props.address
  const provider = props.provider
  const [propRare, setPropRare] = useState(spinner)
  const [propUncommon, setPropUncommon] = useState(spinner)
  const [propCommon, setPropCommon] = useState(spinner)
  const [buildHouse, setBuildHouse] = useState(spinner)
  const [buildHotel, setBuildHotel] = useState(spinner)

  useEffect(() => {
    if (!(provider && address && networkId && landInfo.id && editionId)) {
      return
    }

    const Mono = new ethers.Contract(
      MonoJson.networks[networkId].address,
      MonoJson.abi,
      provider
    );

    const Prop = new ethers.Contract(
      PropJson.networks[networkId].address,
      PropJson.abi,
      provider
    );

    const Build = new ethers.Contract(
      BuildJson.networks[networkId].address,
      BuildJson.abi,
      provider.getSigner(address)
    )

    // todo retrieve Prop balance by rarity

    const houseId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        [ "uint16", "uint8", "uint8" ],
        [ editionId, landInfo.id, 0 ]
      )
    )

    const hotelId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        [ "uint16", "uint8", "uint8" ],
        [ editionId, landInfo.id, 1 ]
      )
    )

    Build.balanceOf(address, houseId).then((value) => setBuildHouse(value.toNumber()));
    Build.balanceOf(address, hotelId).then((value) => setBuildHotel(value.toNumber()));
  }, [address, provider, networkId, landInfo.id, editionId]);

  const buyProperty = async (event) => {
    if (!(Bank && editionId && landInfo.id && networkId)) {
      return
    }

    const rarity = event.target.getAttribute('data-rarity')
    Bank.buyProp(editionId, landInfo.id, rarity).then((value) => console.log("Property buy"))
  }

  const buyBuilding = (event) => {
    if (!(Bank && editionId && landInfo.id)) {
      return
    }

    const type = event.target.getAttribute('data-type')
    Bank.buyBuild(editionId, landInfo.id, type, 1).then()
  }

  return (
    <div>
      <div>{landInfo.title}</div>
      <div>Rare price: {landInfo.prices.rare} MONO$<br />
        <Button variant="primary" size="sm" onClick={buyProperty} data-rarity="0">Buy</Button> balance: {propRare}
      </div>
      <div>Uncommon price: {landInfo.prices.uncommon} MONO$<br />
        <Button variant="primary" size="sm" onClick={buyProperty} data-rarity="1">Buy</Button> balance: {propUncommon}
      </div>
      <div>Common price: {landInfo.prices.common} MONO$<br />
        <Button variant="primary" size="sm" onClick={buyProperty} data-rarity="2">Buy</Button> balance: {propCommon}
      </div>
      <div>House price: {landInfo.bprices.house} MONO$<br />
        <Button variant="primary" size="sm" onClick={buyBuilding} data-type="0">Buy</Button> balance: {buildHouse}
      </div>
      <div>Hotel price: {landInfo.bprices.hotel} MONO$<br />
        <Button variant="primary" size="sm" onClick={buyBuilding} data-type="1">Buy</Button> balance: {buildHotel}
      </div>
    </div>
  );
}
