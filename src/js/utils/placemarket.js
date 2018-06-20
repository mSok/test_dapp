import {initWeb3} from './initContract'
const interfaceName = 'sitisPlaceMarket'

// получить из ethereum все услуги
// TODO метод только для тестирования, так как не оптимальный и не защищен
export function getAllServices () {
  return initWeb3(interfaceName).then((Contracts) => {
    return Contracts.methods.serviceCount().call().then(cnt => {
      var contractsData = []
      for (var i = 1; i <= cnt; i++) {
        getService(i).then(contract => {
          contractsData.push(contract)
        })
      }
      return contractsData
    })
  })
}

// получит услугу по id
export function getService (id) {
  return initWeb3(interfaceName).then((Contracts) => {
    return Contracts.methods.services(id).call()
  })
}

// получит услугу по id
export function getPurchace (id) {
  return initWeb3(interfaceName).then((Contracts) => {
    return Contracts.methods.purchases(id).call()
  })
}

export function getPurchaceEvent (id) {
  return initWeb3(interfaceName)
    .then((Contracts) => {
      return Contracts.getPastEvents('buyServiceEvent', {
        filter: {_buyerAddresss: '0xdC5D1D9803EB98e6d2f1c7E6E1F1A61DB8B17538'},
        fromBlock: 0,
        toBlock: 'latest'
      })
      .then((events) => {
        return events
      })
    })
}
