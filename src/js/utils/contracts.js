import app from '../../main'
import axios from 'axios'
import TruffleContract from 'truffle-contract'
import Web3 from 'web3'
import data from '../../assets/contracts/Contracts.json'
import { debug } from 'util';
import contractsConst from './interface';

export function initContract (web3Instance, web3Provider, contractType) {
  // return getContractJSON().then((data) => {
  return web3Instance.eth.getCoinbase().then(selfAccount => {
    if (selfAccount === null) {
      throw({
        code: 403,
        reason:'Not authorized'
      })
    }
    checkNetwork(web3Instance).then(netId => {
      // if (netId !== 15){
      //   console.log('Неправильная сеть')
      //   throw ({
      //     code: 400,
      //     reason: 'Неправильная сеть'
      //   })
      // }
    })
    let instweb3 = new Web3(window.web3.web3Provider)
    
    let abi = contractsConst[contractType]['abi']
    let Contracts = new web3Instance.eth.Contract(abi, contractsConst[contractType]['address'])
    return Contracts
  })
}
export async function checkNetwork(web3){
  return await web3.eth.net.getId((err, netId) => {
    switch (netId) {
      case "1":
        console.log('Основная сеть')
        return 'Основная сеть'
        break
      case "15":
        console.log('Приватная сеть')
        return 'Приватная сеть'
        break
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

export function initWeb3 () {
    // TODO: refactor conditional
  let web3, web3Provider
  [web3, web3Provider] = web3inst()
  return initContract(web3, web3Provider, 'token')
};

export function getAllContracts () {
  var Contractinstance
  return initWeb3().then(Contracts => {
    // Load contract data
    return Contracts.deployed().then(instance => {
      Contractinstance = instance
      return instance.contractCount()
    }).then((contractCount) => {
      return async function (contractCount) {
        var contractsData = []
        for (var i = 1; i <= contractCount; i++) {
          await getContract(i).then(contract => {
            contractsData.push(contract)
          })
        }
        return contractsData
      }(contractCount)
    })
  })
}

export function getContract (id) {
  return initWeb3().then((Contracts) => {
    // Load contract data
    return Contracts.deployed().then(instance => {
      return instance.contracts(id).then(contract => {
        return async function _getName (contract) {
          contract[5] = await getAccountName(contract[5])
          return contract
        }(contract)
      })
    })
  })
}

export function setBet (contractId, value) {
  return initWeb3().then((Contracts) => {
    // Load contract data
    Contracts.deployed().then(instance => {
      console.log('contractId, value: ', contractId, value)
      return instance.setContractRate(contractId, value)
    }).catch(function (error) {
      console.error(error)
    })
  })
}

function getAccountName (address) {
  return axios.get('/api/user/' + address).then(res => {
    if (!res.data) return address
    return res.data.nick
  })
}

export function getFullAccount () {
  return web3inst()[0].eth.getCoinbase().then(selfAccount => {
    if (selfAccount === undefined || selfAccount === null) {
      console.log('selfAccount: ', selfAccount)
      throw({
        code: 403,
        reason:'Not authorized'
      })
      // return new Promise((resolve, reject) => {
      //   return false
      // })
    } else {
      return axios.get('/api/user/' + selfAccount).then(res => {
        console.log(res.data)
        if (!res.data) return false
        return res.data
      })
    }
  },
  error=>{
    console.error(error)
  })
}
export function setEmail (email, nick) {
  let self = this
  return web3inst()[0].eth.getCoinbase().then(selfAccount => {
    if (selfAccount === undefined) return false
    let postData = {
      email: email,
      nick: nick,
      id: selfAccount,
      address: selfAccount
    }
    return axios.post('/api/user/', postData).then(res => {
      console.log('Account changed')
      console.log(res)
      console.log(self)
      app.bus.$emit('reloadAccount', res)
    })
  })
}

export function getBalanceAccount () {
  return web3inst()[0].eth.getCoinbase().then(selfAccount => {
    return initWeb3().then((Contracts) => {
      let _name = Contracts.methods.name().call()
      let _balance = Contracts.methods.balanceOf(selfAccount).call()
      let _decimal = Contracts.methods.decimals().call()
      let _sym = Contracts.methods.symbol().call()
      let _address = Contracts._address
      return Promise.all([_name, _balance, _decimal, _sym, _address])
    })
  })
}
// ************ не храним данные пользователя в сети, неоч! просто для теста было.
// export function setEmail (email) {
//   return initWeb3().then((Contracts) => {
//     Contracts.deployed().then(instance => {
//       instance.setAccount(email)
//     })
//   })
// }

// export function getFullAccount () {
//   return web3inst()[0].eth.getCoinbase().then(selfAccount => {
//     if (selfAccount === undefined) {
//       console.log('selfAccount: ', selfAccount)
//       return new Promise((resolve, reject) => {
//         return false
//       })
//     } else {
//       return initWeb3().then((Contracts) => {
//         return Contracts.deployed().then(instance => {
//           return instance.accounts(selfAccount).then(acc => {
//             if (acc[1] === '') { // TODO ошибка в контракте, не сохранил адрес || acc[0] === '0x0000000000000000000000000000000000000000') {
//               return false
//             }
//             return acc[1]
//           })
//         })
//       })
//     }
//   })
// }

export function createContract (contract) {
  return initWeb3().then((Contracts) => {
    Contracts.deployed().then(instance => {
      instance.createContract(
        contract['contructnum'],
        contract['descr'],
        contract['amount']).then(
          res => { console.log(res) },
          err => { console.error(err) }
        )
    })
  })
}

export function getBets () {
  var contractInstance
  return initWeb3().then((Contracts) => {
    // Load contract data
    return Contracts.deployed().then(instance => {
      contractInstance = instance
      return contractInstance.rateCount()
    }).then(async (rateCount) => {
      var rateData = []
      for (var i = 1; i <= rateCount; i++) {
        await contractInstance.contractRates(i).then(async rate => {
          await getContract(rate[1]).then(async contract => {
            rate[1] = contract
            rate[2] = await getAccountName(rate[2])
            rateData.push(rate)
          })
        })
      }
      return rateData
    }).catch(function (error) {
      console.warn(error)
    })
  })
}Vue

export function getContractBets (contractID) {
  var contractInstance
  return initWeb3().then((Contracts) => {
    // Load contract data
    return Contracts.deployed().then(instance => {
      contractInstance = instance
      return contractInstance.getContractRateCount(contractID).then(async cnt => {
        console.log('getContractRateCount:', cnt)
        let bets = []
        for (var i = 0; i < cnt; i++) {
          console.log('index:', i)
          await contractInstance.getContractRateAtIndex(contractID, i).then(async data => {
            data[2] = await getAccountName(data[2])
            bets.push(data)
          })
        }
        console.log('contract bets:', bets)
        return bets
      })
    })
  })
}

// export function listenForEvents (app) {
//   return initWeb3().then((Contracts) => {
//     return Contracts.deployed().then(instance => {
//       instance.accountEvent({_accountAddresss: web3.eth.coinbase}, {
//         filter: {_from: web3.eth.coinbase},
//         fromBlock: 'latest',
//         toBlock: 'latest'
//       }).watch(function (err, event) {
//         console.log('event triggered', event)
//         app.$root.bus.$emit('reloadAccount', event.args)
//       })
//     })
//   })
// }

// export function getAccountHist (app) {
//   return initWeb3().then((Contracts) => {
//     return Contracts.deployed().then(instance => {
//       instance.accountEvent({_accountAddresss: web3.eth.coinbase}, {
//         fromBlock: 0,
//         toBlock: 'latest'
//       }).get((err, event) => {
//         console.log('event get triggered', event)
//         app.$root.bus.$emit('accountHist', event)
//       })
//     })
//   })
// }
