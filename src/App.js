import React, { Component } from 'react'
import crowdsaleContract from './constants/crowdsaleContract'
import tokenContract from './constants/tokenContract'
import './App.css'

let crowdsaleContractInstance
let tokenContractInstance

if (window.web3) {
  crowdsaleContractInstance = window.web3.eth.contract(crowdsaleContract.abi).at(crowdsaleContract.address)
  tokenContractInstance = window.web3.eth.contract(tokenContract.abi).at(tokenContract.address)
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ethRaised: 0,
      account: 0,
      tokenBalance: 0,
      totalSupply: 0,
      tokenBalanceAtAddress: null
    }
  }

  componentWillMount() {
    window.web3.eth.getAccounts((err, res) => {
      if (err) console.log(err)
      else {
        this.setState({
          account: res[0]
        })
        this.getTokenBalance(res[0])
      }
    })

    tokenContractInstance.totalSupply((err, res) => {
      if (err) console.log(err)
      else {
        this.setState({
          totalSupply: +res / 1e18
        })
      }
    })
    this.updateEtherRaised()

  }

  updateEtherRaised = (e) => {
    if (e) e.preventDefault();
    crowdsaleContractInstance.weiRaised((err, res) => {
      if (err) console.log(err)
      else {
        this.setState({
          ethRaised: +res / 1e18
        })
      }
    })
  }

  getTokenBalance = (address) => {
    tokenContractInstance.balanceOf(address, (err, res) => {
      if (err) console.log(err)
      else {
        this.setState({
          tokenBalance: +res / 1e18,
          tokenBalanceAtAddress: address
        })
      }
    })
  }

  handleWalletAddressSubmit = (e) => {
    e.preventDefault();
    this.getTokenBalance(this.addressInput.value);
  }

  handleEtherDepositSubmit = (e) => {
    e.preventDefault();
    crowdsaleContractInstance.buyTokens
    .sendTransaction(this.state.account, {value: window.web3.toWei(this.etherAmountInput.value, 'ether')}, (err, res) => {
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
