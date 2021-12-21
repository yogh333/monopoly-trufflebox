# monopoly-trufflebox
Monopoly World smart contracts and React-based Dapp

This is a React Truffle box project: for more information, please check http://trufflesuite.com/boxes/react/index.html

This repository contains all the Monopoly World smart contracts (in /contracts), along with a React.js front-end (in /client).

## Cloning the project

In an empty local directory

```
git clone https://github.com/jcaporossi/monopoly-trufflebox.git
```

## Installation

After cloning the project, install dependencies with

```
cd monopoly-trufflebox
npm install
cd client
npm install
cd ..
```

## Compilation

To compile all smart contracts:

```
truffle compile
```

## Unit Tests

```
truffle test
```
## Migration

In another terminal windows, launch `ganache-cli` then

```
truffle migrate
```

## Front-end

To launch React front-end

```
cd client
npm start
```
