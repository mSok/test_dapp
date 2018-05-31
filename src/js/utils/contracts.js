import axios from 'axios'
import TruffleContract from 'truffle-contract'
import Web3 from 'web3'
import data from '../../assets/contracts/Contracts.json'

export function initContract (web3, web3Provider) {
  // return getContractJSON().then((data) => {
  return web3.eth.getCoinbase().then(selfAccount => {
    var Contracts = TruffleContract(data)
    Contracts.setProvider(web3Provider)
    Contracts.web3.eth.defaultAccount = selfAccount
    return Contracts
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
  return initContract(web3, web3Provider)
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
    }).catch(function (error) {
      console.error(error)
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
  return initWeb3().then((Contracts) => {
    return Contracts.deployed().then(instance => {
      return instance.accounts(address).then(acc => {
        if (acc[1] === '') {
          return address
        }
        return acc[1]
      })
    })
  })
}

export function getFullAccount () {
  return web3inst()[0].eth.getCoinbase().then(selfAccount => {
    if (selfAccount === undefined) {
      console.log('selfAccount: ', selfAccount)
      return new Promise((resolve, reject) => {
        return false
      })
    } else {
      return initWeb3().then((Contracts) => {
        return Contracts.deployed().then(instance => {
          return instance.accounts(selfAccount).then(acc => {
            if (acc[1] === '') { // TODO ошибка в контракте, не сохранил адрес || acc[0] === '0x0000000000000000000000000000000000000000') {
              return false
            }
            return acc[1]
          })
        })
      })
    }
  })
}

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

export function setEmail (email) {
  return initWeb3().then((Contracts) => {
    Contracts.deployed().then(instance => {
      instance.setAccount(email)
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
}

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
