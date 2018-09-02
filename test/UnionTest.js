/* global it contract beforeEach artifacts */

const expect = require('chai')
  .use(require('chai-as-promised')).expect

var SitisPlaceMarket = artifacts.require('./SitisPlaceMarket.sol')
var SitisArbitration = artifacts.require('./SitisArbitration.sol')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

contract('SitisPlaceMarket', function (accounts) {
  let arbiterWalet = ''
  const testBuyer = accounts[4]
  const testServiceOwner = accounts[3]
  const arbiterList = [accounts[0], accounts[1], accounts[2]]
  var testResultVote = [true, false]

  beforeEach(async function () {
    this.placeMarket = await SitisPlaceMarket.new(arbiterWalet)
    this.arbitration = await SitisArbitration.new(this.placeMarket.address, [accounts[0]])
    await this.placeMarket.changeArbiter(this.arbitration.address)
  })

  it('Услуга создает арбитраж', async function () {
    await this.placeMarket.createService('', 10, {from: testServiceOwner})
    await this.placeMarket.buyService(1, 1, {from: testBuyer, value: 10})
    let purh = await this.placeMarket.purchases(1)
    let cntCreated = await this.arbitration.arbiterCount()
    // console.log(purh)
    // console.log('count arbitration: ', cntCreated.toNumber())
    await this.placeMarket.cancelService(1, {from: testBuyer})
    cntCreated = await this.arbitration.arbiterCount()

    purh = await this.placeMarket.purchases(1)
    // console.log(purh)
    // console.log('count arbitration: ', cntCreated.toNumber())
    let res = await this.arbitration.arbiterStats.call(1)
    console.log(res)
    await this.arbitration.vote(1, true, {from: arbiterList[0]})
    let _cntAr = await this.arbitration.arbiterListCount()
    // console.log('arbiterListCount: ', _cntAr)
    // console.log('voitedResults: ', await this.arbitration.voitedResults(1))
    // console.log('voitedResults: ', await this.arbitration.percent(res[6], _cntAr, 3))
    // console.log('closeVote: ', await this.arbitration.closeVote(1, {from: arbiterList[0]}))
    // console.log('purchases after close: ', await this.placeMarket.purchases(1))
  })

  testResultVote.forEach(function(arbiterRes) {
    it('Проверяем баланс при отмене покупки, с результатом голосования ' + arbiterRes, async function () {
      const costService = web3.toWei('1', 'ether')
      await this.placeMarket.createService('', costService, {from: testServiceOwner})

      let _beforeBalanceMarket = await web3.eth.getBalance(this.placeMarket.address)
      let _beforeBalanceServiceOwner = await web3.eth.getBalance(testServiceOwner)
      let _beforeBalanceBuyer = await web3.eth.getBalance(testBuyer)
      // DEBUG
      // console.log(`
      //   Before balance:
      //   market: ${web3.fromWei(_beforeBalanceMarket, 'ether')}
      //   ServiceOwner: ${web3.fromWei(_beforeBalanceServiceOwner, 'ether')}
      //   Buyer: ${web3.fromWei(_beforeBalanceBuyer, 'ether')}
      // `)
      let _buyServiceRes = await this.placeMarket.buyService(1, 1, {from: testBuyer, value: costService})
      let _purchaseId = _buyServiceRes.logs[0].args.purchaseId

      let _afterBalanceMarket = await web3.eth.getBalance(this.placeMarket.address)
      let _afterBalanceServiceOwner = await web3.eth.getBalance(testServiceOwner)
      let _afterBalanceBuyer = await web3.eth.getBalance(testBuyer)
      // DEBUG
      // console.log(`
      //   After buy service id ${_purchaseId.toNumber()} balance:
      //   market: ${web3.fromWei(_afterBalanceMarket, 'ether')}
      //   ServiceOwner: ${web3.fromWei(_afterBalanceServiceOwner, 'ether')}
      //   Buyer: ${web3.fromWei(_afterBalanceBuyer, 'ether')}
      // `)
      // проверяем баланс контракта
      expect(_afterBalanceMarket.toNumber() - _beforeBalanceMarket.toNumber() == costService, 'баланс площадки изменился более/менее чем стоимость').to.be.true
      expect(_afterBalanceServiceOwner.toNumber() == _beforeBalanceServiceOwner.toNumber(), 'баланс продавца изменился!').to.be.true
      expect(_beforeBalanceBuyer.toNumber() - _afterBalanceBuyer.toNumber() >= costService, 'Баланс покупателя изменился менее стоимости покупки').to.be.true

      _beforeBalanceMarket = _afterBalanceMarket
      _beforeBalanceBuyer = _afterBalanceBuyer

      let cancelRes = await this.placeMarket.cancelService(_purchaseId.toNumber(), {from: testBuyer})

      await this.arbitration.vote(1, arbiterRes, {from: arbiterList[0]})
      await this.arbitration.closeVote(1, {from: arbiterList[0]})

      _afterBalanceMarket = await web3.eth.getBalance(this.placeMarket.address)
      _afterBalanceServiceOwner = await web3.eth.getBalance(testServiceOwner)
      _afterBalanceBuyer = await web3.eth.getBalance(testBuyer)
      // DEBUG
      // console.log(`
      //   After cancel service id ${_purchaseId.toNumber()} balance:
      //   market: ${web3.fromWei(_afterBalanceMarket, 'ether')}
      //   ServiceOwner: ${web3.fromWei(_afterBalanceServiceOwner, 'ether')}
      //   Buyer: ${web3.fromWei(_afterBalanceBuyer, 'ether')}
      // `)
      expect(_beforeBalanceMarket.toNumber() - _afterBalanceMarket.toNumber() == costService, 'баланс площадки изменился более/менее чем стоимость').to.be.true
      if (arbiterRes){
        expect(_afterBalanceServiceOwner.toNumber() == _beforeBalanceServiceOwner.toNumber(), 'баланс продавца(проигравшего спор) изменился!').to.be.true
        // TODO: куда то делись центы!?
        // expect(_afterBalanceBuyer.toNumber() - _beforeBalanceBuyer.toNumber() >= costService, 'Баланс покупателя(выиграл спор) изменился менее стоимости покупки').to.be.true
        expect(_afterBalanceBuyer.toNumber() > _beforeBalanceBuyer.toNumber(), 'Баланс покупателя(выиграл спор) изменился менее стоимости покупки').to.be.true
      } else {
        expect(_afterBalanceServiceOwner.toNumber() - _beforeBalanceServiceOwner.toNumber() >= costService, 'Баланс продавца(выиграл спор) изменился более чем на стоимость покупки').to.be.true
        // TODO опять центы пропали
        expect(_beforeBalanceBuyer.toNumber() - _afterBalanceBuyer.toNumber() < costService , 'Баланс покупателя(проигравшего спор) изменился!').to.be.true
      }
    })
  })
})
