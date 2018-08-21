/* global it contract beforeEach artifacts */

const expect = require('chai')
  .use(require('chai-as-promised')).expect

const BigNumber = web3.BigNumber
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var SitisPlaceMarket = artifacts.require('./SitisPlaceMarket.sol')

contract('SitisPlaceMarket', function (accounts) {
  let arbiterWalet = ''
  beforeEach(async function () {
    this.placeMarket = await SitisPlaceMarket.new(arbiterWalet)
  })

  it('Должно создать услугу', async function () {
    let cnt = await this.placeMarket.serviceCount()
    cnt.should.be.bignumber.equal(0)
    await this.placeMarket.createService('', 10)
    cnt = await this.placeMarket.serviceCount()
    cnt.should.be.bignumber.equal(1)
  })

  it('Проверяем покупку услуги', async function () {
    await this.placeMarket.createService('', 10)
    await this.placeMarket.buyService(1, 1, {value: 10})
    expect(this.placeMarket.buyService(1, 1)).to.be.eventually.rejected
    expect(this.placeMarket.buyService(1, 1, {value: 7})).to.be.eventually.rejected
    const purh = await this.placeMarket.purchases(1)
    console.log(purh)
  })
})
