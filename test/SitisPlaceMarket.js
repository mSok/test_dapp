/* global it contract beforeEach artifacts */

const expect = require('chai')
  .use(require('chai-as-promised')).expect

const BigNumber = web3.BigNumber
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var SitisPlaceMarket = artifacts.require('./SitisPlaceMarket.sol')
var SitisArbitration = artifacts.require('./SitisArbitration.sol')

contract('SitisPlaceMarket', function (accounts) {
  let arbiterWalet = ''
  const testBuyer = accounts[4]
  const testServiceOwner = accounts[3]
  beforeEach(async function () {
    this.placeMarket = await SitisPlaceMarket.new(arbiterWalet)
    this.arbitration = await SitisArbitration.new(this.placeMarket.address, [accounts[0]])
    await this.placeMarket.changeArbiter(this.arbitration.address)
  })

  function printPurchase(purch) {
    console.log(`
      id: ${purch[0].toNumber()}
      serviceId: ${purch[1].toNumber()}
      cnt: ${purch[2].toNumber()}
      buyer: ${purch[3]}
      status: ${purch[4].toNumber()}
      cancelBuyer: ${purch[5]}
      cancelOwner: ${purch[6]}
      closed: ${purch[7]}
    `)
  }

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
    // printPurchase(purh)
  })

  it('Отказываемся от покупки первым создателем', async function () {
    const resCreated = await this.placeMarket.createService('0x00123', 10000000, {from: testServiceOwner})
    const createdServiceId = resCreated.logs[0].args.serviceId
    // console.log('created id', createdServiceId)

    // TODO подумать как тестировать
    // let _beforeBalance = await web3.eth.getBalance(testBuyer)
    // console.log('Balance buyer before buy: ', _beforeBalance.toNumber());

    // let _beforeContractBalance = await web3.eth.getBalance(this.placeMarket.address)
    // console.log('Balance contract before buy: ', _beforeContractBalance.toNumber())

    let _buyServiceRes = await this.placeMarket.buyService(createdServiceId.toNumber(), 1, {from: testBuyer, value: 10000000})
    let _purchaseId = _buyServiceRes.logs[0].args.purchaseId
    // console.log('_purchaseId: ', _purchaseId.toNumber())
    // web3.eth.getBalance(testBuyer, function(err,res) {
    //       console.log('Balance after buy: ', res.toNumber());
    //       // console.log('diff: ', (_beforeBalance - res).toNumber())
    // });
    let _tmpPurch = await this.placeMarket.purchases(_purchaseId.toNumber())
    _tmpPurch[5].should.be.equal(false)
    _tmpPurch[6].should.be.equal(false)
    // printPurchase(_tmpPurch)
    await this.placeMarket.cancelService(_purchaseId.toNumber(), {from: testServiceOwner})
    _tmpPurch = await this.placeMarket.purchases(_purchaseId.toNumber())
    _tmpPurch[4].should.be.bignumber.equal(2)
    _tmpPurch[5].should.be.equal(false)
    _tmpPurch[6].should.be.equal(true)
    // printPurchase(_tmpPurch)
    await this.placeMarket.cancelService(_purchaseId.toNumber(), {from: testBuyer})

    _tmpPurch = await this.placeMarket.purchases(_purchaseId.toNumber())
    // закрыта сделка
    _tmpPurch[4].should.be.bignumber.equal(3)
    _tmpPurch[5].should.be.equal(true)
    _tmpPurch[6].should.be.equal(true)
    // printPurchase(_tmpPurch)
  })

  it('Отказываемся от покупки первым покупателем', async function () {
    const resCreated = await this.placeMarket.createService('0x00124', 10000000, {from: testServiceOwner})
    const createdServiceId = resCreated.logs[0].args.serviceId

    let _buyServiceRes = await this.placeMarket.buyService(createdServiceId.toNumber(), 1, {from: testBuyer, value: 10000000})
    let _purchaseId = _buyServiceRes.logs[0].args.purchaseId
    // console.log('_purchaseId: ', _purchaseId.toNumber())

    let _tmpPurch = await this.placeMarket.purchases(_purchaseId.toNumber())
    _tmpPurch[5].should.be.equal(false)
    _tmpPurch[6].should.be.equal(false)
    // printPurchase(_tmpPurch)
    await this.placeMarket.cancelService(_purchaseId.toNumber(), {from: testBuyer})
    _tmpPurch = await this.placeMarket.purchases(_purchaseId.toNumber())
    // printPurchase(_tmpPurch)
    _tmpPurch[4].should.be.bignumber.equal(2)
    _tmpPurch[5].should.be.equal(true)
    _tmpPurch[6].should.be.equal(false)
    await this.placeMarket.cancelService(_purchaseId.toNumber(), {from: testServiceOwner})

    _tmpPurch = await this.placeMarket.purchases(_purchaseId.toNumber())
    // printPurchase(_tmpPurch)
    // закрыта сделка
    _tmpPurch[4].should.be.bignumber.equal(3)
    _tmpPurch[5].should.be.equal(true)
    _tmpPurch[6].should.be.equal(true)
  })
})
