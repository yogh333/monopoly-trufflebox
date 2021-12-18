import { useState, useEffect } from "react"
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

import Admin from "./components/Admin/Admin";
import Game from "./components/Game/Game";
import Home from "./components/Home/Home";

import "./App.css"
import {ethers} from "ethers";

function App() {
  const [provider, setProvider] = useState(null)
  const [networkId, setNetworkId] = useState(window.ethereum && window.ethereum.networkVersion)
  const [address, setAddress] = useState(window.ethereum && window.ethereum.selectedAddress)

  const subscribeEthereumEvents = () => {
    window.ethereum.on('accountsChanged', accounts => {
      setAddress(accounts[0])
      console.log(`Accounts updated: ${accounts}`)
    })

    window.ethereum.on('chainChanged', networkId => {
      console.log(`Network updated: ${networkId}`)
      window.location.reload()
    })
  }

  function getProvider() {
    if (window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum)
    }
  }

  useEffect(() => {
    subscribeEthereumEvents()
    setProvider(getProvider())
  }, [])

  useEffect(() => {
    setProvider(getProvider())
  }, [networkId, address])

  async function connectWallet() {
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
