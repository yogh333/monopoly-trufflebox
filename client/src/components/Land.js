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
  const [propBalance, setPropBalance] = useState(null)
  const [propRare, setPropRare] = useState(spinner)
  const [propUncommon, setPropUncommon] = useState(spinner)
  const [propCommon, setPropCommon] = useState(spinner)

  useEffect(() => {
    if (!(provider && address && networkId && landInfo.id && editionId)) {
      return
    }

    const Prop = new ethers.Contract(
      PropJson.networks[networkId].address,
      PropJson.abi,
      provider
    );

    Prop.balanceOf(address).then((value) => setPropBalance(value.toNumber()));
  }, [address, provider, networkId, landInfo.id, editionId]);

  useEffect(async () => {
    if (!(propBalance)) {
      return
    }

    const Prop = new ethers.Contract(
      PropJson.networks[networkId].address,
      PropJson.abi,
      provider
    );

    const nbOfPropsByRarity = []
    for (let rarity = 0; rarity < 3; rarity++) {
      nbOfPropsByRarity[rarity] = await Prop.getNbOfProps(editionId, landInfo.id, rarity)
    }
    console.log("nbOfPropsByRarity")
    console.log(nbOfPropsByRarity)

    const totalSupply = await Prop.totalSupply()
    console.log("totalSupply")
    console.log(totalSupply.toString())

    for (let index = 0; index < propBalance; index++) {
      let id_ = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint16", "uint8", "uint8", "uint32"],
          [editionId, landInfo.id, 1, index]
        )
      )

      console.log("id_")
      console.log(ethers.BigNumber.from(id_).toString())
    }

    for (let index = 0; index < propBalance; index++) {
      const idx = await Prop.tokenOfOwnerByIndex(address, index)
      console.log("Prop.tokenOfOwnerByIndex(address, 0)");
      console.log(idx.toString())
    }
    /*for (let index = 0; index < totalSupply; index++) {
      const value = await Prop.tokenByIndex(index)
      console.log("Prop.tokenByIndex(index)");
      console.log(value.toString())
    }*/
  }, [propBalance]);



  const buyProperty = async (event) => {
    if (!(Bank && editionId && landInfo.id && networkId)) {
      return
    }

    const rarity = event.target.getAttribute('data-rarity')
    Bank.buyProp(editionId, landInfo.id, rarity).then((value) => console.log("Property buy"))
  }

  if (landInfo.title === "undefined") {
    return (<><div>Select a land on board</div></>)
  }

  return (<>
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
  </>)
}
