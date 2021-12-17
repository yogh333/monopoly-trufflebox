import { useState, useEffect } from "react"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

//import Admin from "./components/Game/Admin";
import Game from "./components/Game/Game";
import Home from "./components/Home/Home";

import "./App.css"

function App() {
  const [networkId, setNetworkId] = useState(window.ethereum && window.ethereum.networkVersion)
  const [address, setAddress] = useState(window.ethereum && window.ethereum.selectedAddress)

  let isSubscriptionToEthereumEventsDone = false

  const subscribeEthereumEvents = () => {
    if (isSubscriptionToEthereumEventsDone) {
      return
    }

    isSubscriptionToEthereumEventsDone = true

    window.ethereum.on('accountsChanged', accounts => {
      setAddress(accounts[0])
      console.log(`Accounts updated: ${accounts}`)
    })

    window.ethereum.on('chainChanged', networkId => {
      console.log(`Network updated: ${networkId}`)
      window.location.reload()
    })
  }

  useEffect(() => {
    subscribeEthereumEvents()
  })

  async function connectWallet() {
    if (address) {
      return
    }

    if (typeof window.ethereum !== "undefined") {
      if (window.ethereum.isMetaMask) {

        await window.ethereum.request({ method: "eth_requestAccounts" });

        setNetworkId(window.ethereum.networkVersion)
        // address is setted with ethereum event
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
              network_id = { networkId }
              address = { address }
            />
          } />
          <Route exact path='/admin/' />
          <Route exact path='/game' element={
            <Game
              network_id = { networkId }
              address = { address }
            />
          } />
          <Route exact path='/staking' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
