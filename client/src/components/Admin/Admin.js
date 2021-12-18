import {useState, useEffect, useRef} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";

import "./Admin.css";

import Paris from "../../data/Paris.json";

import BankJson from "../../contracts/MonopolyBank.json";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

function Admin(props) {
  const spinner = <Spinner as="span" animation="border" size="sm" />

  const provider = props.provider
  const networkId = props.network_id
  const address = props.address

  const [Bank, setBank] = useState(null)
  const [adminRole, setAdminRole] = useState(null)
  const [hasAdminRole, setHasAdminRole] = useState(false)
  const [isReadyToRender, setIsReadyToRender] = useState(false)

  let lastAddress = null

  useEffect(() => {
    if (address) {
      lastAddress = address
    }

    if (window.ethereum && !window.ethereum.selectedAddress) { // Redirect to Home if disconnected
      window.location.href = "/"

      return
    }

    if (!(provider && address && networkId)) {
      return
    }

    setBank(new ethers.Contract(
      BankJson.networks[networkId].address,
      BankJson.abi,
      provider
    ))
  }, [provider, address, networkId]);

  useEffect(() => {
    if (!Bank) {
      return
    }

    Bank.ADMIN_ROLE().then((value) => {
      setAdminRole(value)
    })
  }, [Bank]);

  useEffect(() => {
    if (!(Bank && adminRole)) {
      setHasAdminRole(false)

      return
    }

    Bank.hasRole(adminRole, address).then((value) => {
      if (!value) {
        window.location.href = "/"

        return
      }

      setHasAdminRole(true)
      setIsReadyToRender(true)
    })
  }, [adminRole]);

  async function sendPricesToBank() {

  }

  if (!isReadyToRender || !hasAdminRole) {
    return (<></>)
  }

  return (
    <div className="Admin">
      <Container>
        <h1>Admin</h1>
        <Button className="mx-3" variant="primary" onClick={sendPricesToBank}>
          Send prices to Bank for Paris Board
        </Button>
      </Container>
    </div>
  );
}

export default Admin;
