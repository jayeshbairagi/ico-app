import Web3 from 'web3'
import React, { Component } from 'react'

import './App.css'
import tokenContract from './constants/tokenContract'
import crowdsaleContract from './constants/crowdsaleContract'

let tokenContractInstance;
let crowdsaleContractInstance;

if (window.ethereum) {
  window.ethereum.enable();
  window.web3 = new Web3(window.ethereum);
  tokenContractInstance = new window.web3.eth.Contract(tokenContract.abi, tokenContract.address).methods;
  crowdsaleContractInstance = new window.web3.eth.Contract(crowdsaleContract.abi, crowdsaleContract.address).methods;
}

class App extends Component {
  constructor(props) {
    window.web3.eth.getAccounts((err, res) => {
      if (err) console.log(err)
      else {
        this.setState({
          account: res[0]
        })
        this.getTokenBalance(res[0])
      }
    })
    super(props)
    this.state = {
      ethRaised: 0,
      account: 0,
      tokenBalance: 0,
      totalSupply: 0,
      tokenBalanceAtAddress: null
    }

    this.calculateTotalSupply();
    this.updateEtherRaised();
  }

  calculateTotalSupply = async () => {
    try {
      const totalSupply = await tokenContractInstance.totalSupply().call();
      this.setState({
        totalSupply: +totalSupply / 1e18
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  updateEtherRaised = async (e) => {
    if (e) e.preventDefault();
    try {
      const weiRaised = await crowdsaleContractInstance.weiRaised().call()
      this.setState({
        ethRaised: +weiRaised / 1e18
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getTokenBalance = async (address) => {
    try {
      const balanceOf = await tokenContractInstance.balanceOf(address).call()
      this.setState({
        tokenBalance: +balanceOf / 1e18,
        tokenBalanceAtAddress: address
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  handleWalletAddressSubmit = (e) => {
    e.preventDefault();
    this.getTokenBalance(this.addressInput.value);
  }

  handleEtherDepositSubmit = (e) => {
    e.preventDefault();
    crowdsaleContractInstance.buyTokens(this.state.account).send({
      from: this.state.account,
      value: window.web3.utils.toWei(this.etherAmountInput.value, 'ether')
    }, (err, res) => {
      if (err) console.log(err)
    })
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Welcome to Sample ICO</h1>
        </header>
        <div className='App-intro'>
          <p className="App-content">
            Total Eth Raised: {this.state.ethRaised} ETH {' '}
            <input type="button" className="btn btn-success add-btn" onClick={this.updateEtherRaised} value="Refresh" />
          </p>
          <p className="App-content">
            Your wallet address: {this.state.account}
          </p>
          <p className="App-content">
            Total token in supply: {this.state.totalSupply} tokens
          </p>
          <form className="form-inline App-content" onSubmit={this.handleEtherDepositSubmit}>
            <div className="form-group">
              To buy tokens: {' '}
              <input type="text" className="" required ref={(input) => this.etherAmountInput = input} placeholder="Enter ether amount here" />
              {' '}
              <input type="submit" className="btn btn-success add-btn" value="Submit" />
            </div>
          </form>
          <form className="form-inline App-content" onSubmit={this.handleWalletAddressSubmit}>
            <div className="form-group">
              To get token balance: {' '}
              <input type="text" className="" required ref={(input) => this.addressInput = input} placeholder="Enter wallet address here" />
              {' '}
              <input type="submit" className="btn btn-success add-btn" value="Submit" />
            </div>
          </form>
          <p>
            Total token balance of {this.state.tokenBalanceAtAddress} : {this.state.tokenBalance} tokens
          </p>
        </div>
      </div>
    )
  }
}

export default App
