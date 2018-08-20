/* global it contract beforeEach artifacts */

const expect = require('chai')
  .use(require('chai-as-promised')).expect

var SitisPlaceMarket = artifacts.require('./SitisPlaceMarket.sol')
var SitisArbitration = artifacts.require('./SitisArbitration.sol')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

contract('SitisPlaceMarket', function (accounts) {
  let arbiterWalet = ''
  const testBuyer = accounts[4]
  const testServiceOwner = accounts[3]
  const arbiterList = [accounts[0], accounts[1], accounts[2]]
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
    console.log(purh)
    console.log('count arbitration: ', cntCreated.toNumber())
    await this.placeMarket.cancelService(1, {from: testBuyer})
    cntCreated = await this.arbitration.arbiterCount()

    purh = await this.placeMarket.purchases(1)
    console.log(purh)
    console.log('count arbitration: ', cntCreated.toNumber())
    let res = await this.arbitration.arbiterStats.call(1)
    console.log(res)
    await this.arbitration.vote(1, true, {from: arbiterList[0]})
    let _cntAr = await this.arbitration.arbiterListCount()
    console.log('arbiterListCount: ', _cntAr)
    console.log('voitedResults: ', await this.arbitration.voitedResults(1))
    console.log('voitedResults: ', await this.arbitration.percent(res[6], _cntAr, 3))
    console.log('closeVote: ', await this.arbitration.closeVote(1, {from: arbiterList[0]}))
    console.log('purchases after close: ', await this.placeMarket.purchases(1))
  })
})
