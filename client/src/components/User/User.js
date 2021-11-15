import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";

import "./User.css";

export default function User(props) {
  async function getBlockchainInfo() {
    console.log("toto");
    let provider = props.eth_provider;
    let balance = await provider.getBalance(props.eth_address);
    console.log(balance.toString());
    let signer = provider.getSigner();
    console.log(await signer.getAddress());
    console.log(await provider.getNetwork());
  }

  if (props.eth_provider == null) {
    return (
      <div>
        <h2>User Info</h2>
        <Button variant="info" size="sm" onClick={props.connect}>
          Connect Wallet
        </Button>
      </div>
    );
  } else {
    var provider = props.eth_provider;
    return (
      <div>
        <h2>User Info</h2>
        <Button variant="success" size="sm" onClick={props.connect} disabled>
          Connected
        </Button>
        <div className="address">{props.eth_address}</div>
        <Button variant="secondary" size="sm" onClick={getBlockchainInfo}>
          TEST
        </Button>
      </div>
    );
  }
}
