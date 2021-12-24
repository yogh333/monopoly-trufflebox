import { useState, useEffect } from "react"
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

import Admin from "./Admin";
import Game from "./Game";
import Home from "./Home";

import "../css/App.css"
import {ethers} from "ethers";

function App() {
  const [provider, setProvider] = useState(null)
  const [networkId, setNetworkId] = useState(null)
  const [address, setAddress] = useState(null)

  window.ethereum
    .request({method: 'eth_chainId'})
    .then((value) => setNetworkId(parseInt(value)))
    .catch((err) => {
      console.error(err);
    });

  window.ethereum.on('chainChanged', handleChainChanged);

  function handleChainChanged() {
    window.location.reload();
  }

  let currentAccount = null;
  window.ethereum
    .request({method: 'eth_accounts'})
    .then(handleAccountsChanged)
    .catch((err) => {
      console.error(err);
    });

  window.ethereum.on('accountsChanged', handleAccountsChanged);

  function handleAccountsChanged(accounts) {
    console.log(accounts)
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== address) {
      setAddress(accounts[0]);
    }
  }

  function getProvider() {
    if (window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum)
    }
  }

  useEffect(() => {
    console.log("useEffect[]")
    console.log(address)
    if (window.ethereum  && !address) {
      setAddress(currentAccount)
    }

    setProvider(getProvider())
  }, [])

  useEffect(() => {
    console.log("useEffect[networkId, address]")
    console.log(address)
    setProvider(getProvider())
  }, [networkId, address])

/*  async function connectWallet() {
    if (address) {
      return
    }

    if (typeof window.ethereum !== "undefined") {
      if (window.ethereum.isMetaMask) {

        await window.ethereum.request({ method: "eth_requestAccounts" });

        setNetworkId(window.ethereum.networkVersion)
        // address is set by ethereum event
      }
    }
  }*/

  function connectWallet() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  }

  function renderOthersLinks() {
    if (!address) {
      return null
    }

    return (<>
      <Nav.Link href="/game">Game</Nav.Link>
      <Nav.Link href="/staking">Staking</Nav.Link>
    </>)
  }

  const ellipsis = (string) => { return string.substring(0, 5) + '...' + string.slice(-3) }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar className="px-3" bg="light">
          <Container>
            <Navbar.Brand className="brand">
              Monopoly World
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              { renderOthersLinks() }
            </Nav>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <Button className="mx-3" variant="outline-primary" onClick={ connectWallet }>
                  { address ? ellipsis(address) : 'Connect' }
                </Button>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route exact path='/' element={
            <Home
              provider = { provider }
              network_id = { networkId }
              address = { address }
            />
          } />
          <Route exact path='/admin/' element={
            <Admin
              provider = { provider }
              network_id = { networkId }
              address = { address }
            />
          } />
          <Route exact path='/game' element={
            <Game
              provider = { provider }
              network_id = { networkId }
              address = { address }
              edition_id = "0"
            />
          } />
          <Route exact path='/staking' element={
            <Home
              provider = { provider }
              network_id = { networkId }
              address = { address }
            />
          } />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
