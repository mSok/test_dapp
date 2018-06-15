import axios from 'axios'
import Web3 from 'web3'
import { debug } from 'util'
import contractsConst from './interface'

let NETID = 1
// test network ropsten
if (process.env.NODE_ENV !== 'production') {
  // dev
  NETID = 3
}
console.log('set netID ', NETID)

export function initContract (web3Instance, web3Provider, contractType) {
  return web3Instance.eth.getCoinbase().then(selfAccount => {
    if (selfAccount === null) {
      throw (new Error({
        code: 403,
        reason: 'Not authorized'
      }))
    }
    checkNetwork(web3Instance).then(netId => {
      if (netId !== NETID) {
        console.error('Неправильная сеть')
        let e = new Error({
          code: 400,
          reason: 'Неправильная сеть'
        })
        throw (e)
      }
    })
    let abi = contractsConst[contractType]['abi']
    let Contracts = new web3Instance.eth.Contract(abi, contractsConst[contractType]['address'])
    return Contracts
  })
}

export async function checkNetwork (web3) {
  return await web3.eth.net.getId((err, netId) => {
    switch (netId) {
      case '1':
        console.log('Основная сеть: ', NETID)
        return 'Основная сеть'
      case '3':
        console.log('Cеть ROPSTEN')
        return 'Приватная сеть'
      case '15':
        console.log('Приватная сеть')
        return 'Приватная сеть'
      default:
        return 'Неизвестная сеть'
    }
  })
}

export function getContractJSON () {
  return axios.get('/src/assets/contracts/Contracts.json')
    .then((response) => {
      return response.data
    }, (error) => {
      console.error(error)
    })
}

export function web3inst () {
  var web3Provider
  if (typeof web3 !== 'undefined') {
    // If a web3 instance is already provided by Meta Mask.
    web3Provider = web3.currentProvider
    var instance = new Web3(web3.currentProvider)
  } else {
    // Specify default instance if no web3 instance provided
    web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    instance = new Web3(web3Provider)
  }
  return [instance, web3Provider]
}

export function initWeb3 (contractType = 'token') {
    // TODO: refactor conditional
  let web3, web3Provider
  [web3, web3Provider] = web3inst()
  return initContract(web3, web3Provider, contractType)
};

export function getCoinbase () {
  return web3inst()[0].eth.getCoinbase()
}
