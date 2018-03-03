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
          tokenBalance: +res,
          tokenBalanceAtAddress: address
        })
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.getTokenBalance(this.addressInput.value);
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Welcome to ABC ICO</h1>
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
          <form className="form-inline App-content" onSubmit={this.handleSubmit}>
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
