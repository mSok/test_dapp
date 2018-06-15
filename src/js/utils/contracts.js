import app from '../../main'
import contractsConst from './interface'
import {initWeb3, getCoinbase} from './initContract'
import data from '../../assets/contracts/Contracts.json'
import axios from 'axios'

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
  return getCoinbase().then(selfAccount => {
    if (selfAccount === undefined || selfAccount === null) {
      console.log('selfAccount: ', selfAccount)
      throw (new Error({
        code: 403,
        reason: 'Not authorized'
      }))
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
  error => {
    console.error(error)
  })
}
export function setEmail (email, nick) {
  let self = this
  return getCoinbase().then(selfAccount => {
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
