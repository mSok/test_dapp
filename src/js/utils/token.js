import {initWeb3, getCoinbase} from './initContract'

// получить баланс токенов
export function getBalanceAccount (account = undefined, tokenContract = undefined) {
  if (account === undefined || tokenContract === undefined) {
    return getCoinbase().then(selfAccount => {
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
  console.log('getBalanceAccount contract is saved in component')
  let _name = tokenContract.methods.name().call()
  let _balance = tokenContract.methods.balanceOf(account).call()
  let _decimal = tokenContract.methods.decimals().call()
  let _sym = tokenContract.methods.symbol().call()
  let _address = tokenContract._address
  return Promise.all([_name, _balance, _decimal, _sym, _address])
}
// получить курс токена
export function getTokenRate (tokenContract = undefined) {
  if (tokenContract === undefined) {
    return initWeb3('crowdSale').then((Contracts) => {
      return Contracts.methods.rate().call()
    })
  }
  console.log('contract is saved in component')
  return tokenContract.methods.rate().call()
}

// купить токен
export function buyTokens (amount) {
  return getCoinbase().then(selfAccount => {
    return initWeb3('crowdSale').then((Contracts) => {
      return new Promise((resolve, reject) => {
        // возвращаем сразу tx id не дождавшись майнинга
        return Contracts.methods.buyTokens(selfAccount).send({
          from: selfAccount,
          value: amount
        },
        (error, hash) => {
          if (error) reject(error)
          console.log('TX immeditly : ', hash)
          resolve(hash)
        })
      })
      // вариант ниже вернёт promise TX object только после майнинга транзакции(1-2 мин)
      // return Contracts.methods.buyTokens(selfAccount).send({
      //   from: selfAccount,
      //   value: amount
      // },
      // (error, hash) => {
      //   console.log('TX immeditly : ', hash)
      //   return hash
      // })
    })
  })
}
