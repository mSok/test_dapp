import axios from 'axios'
import TruffleContract from 'truffle-contract'
import Web3 from 'web3'

export function initContract (web3, web3Provider) {
  return getContractJSON().then((data) => {
    var Contracts = TruffleContract(data)
    Contracts.setProvider(web3Provider)
    return Contracts
  })
}

export function getContractJSON () {
  return axios.get('/Contracts.json')
    .then((response) => {
      return response.data
    }, (error) => {
      console.error(error)
    })
}

export function initWeb3 () {
    // TODO: refactor conditional
  var web3Provider
  if (typeof web3 !== 'undefined') {
    // If a web3 instance is already provided by Meta Mask.
    web3Provider = web3.currentProvider
    web3 = new Web3(web3.currentProvider)
  } else {
    // Specify default instance if no web3 instance provided
    web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    web3 = new Web3(web3Provider)
  }
  web3.eth.defaultAccount = web3.eth.accounts[0]
  return initContract(web3, web3Provider)
};

export function getAllContracts () {
  var Contractinstance
  return initWeb3().then((Contracts) => {
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
  var selfAccount = web3.eth.coinbase
  if (selfAccount === undefined) {
    return false
  }
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

export function createContract (contract) {
  return initWeb3().then((Contracts) => {
    Contracts.deployed().then(instance => {
      instance.createContract(
        contract['contructnum'],
        contract['descr'],
        contract['amount']).then(
          res => { console.log(res) },
          err => { console.log(err) }
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

//  TODO
export function getContractHist(){
  return initWeb3().then((Contracts) => {
    return Contracts.deployed().then(instance => {
      console.log('address: ', instance.address)
      var filter = web3.eth.filter({
        address: instance.address,
        fromBlock: 0
      })
      filter.get(function(err, result) {
        debugger
        if(err) {
          alert(err);
          return;
        }
        // sort the events based on blockNumber since they don't seem to come
        // ordered
        result.sort(function(a,b) {
          return a.blockNumber - b.blockNumber;
        })
        // iterate over the events and get the data we need for the table
        // using the blockNumber in the event object.  Specifying the blockNumber
        // is how we access prior state for a smart contract instance
        result.forEach(function(e) {
          console.log('e:', e);
        })
    })
  })
})
}