import Web3 from 'web3'

/**
 * Init lib web3
 */

if (Web3) {
  window.addEventListener('load', () => {
    if (typeof web3 !== 'undefined') window.web3 = new Web3(window.web3.currentProvider)
    else window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  })
}
