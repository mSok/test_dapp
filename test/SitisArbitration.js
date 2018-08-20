/* global it contract beforeEach artifacts */

const BigNumber = web3.BigNumber
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()
const expect = require('chai')
  .use(require('chai-as-promised')).expect

var SitisArbitration = artifacts.require('./SitisArbitration.sol')

contract('SitisArbitration', function (accounts) {
  // TODO: пока какой то.
  const marketplace = '0x103c0483c42c63706e4f1e3bb2fd9e827f9c7a37'
  const arbiterList = [accounts[0], accounts[1], accounts[2]]
  const noInArbiter = accounts[3]
  const testBuyer = '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55'
  const testServiceOwner = '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55'

  beforeEach(async function () {
    this.arbitration = await SitisArbitration.new(marketplace, arbiterList)
  })

  it('Должно создать арбитраж', async function () {
    const cnt = await this.arbitration.arbiterCount()
    cnt.should.be.bignumber.equal(0)
    await this.arbitration.createArbitration(testBuyer, testServiceOwner, 1, 20, 1)
    const cntCreated = await this.arbitration.arbiterCount()
    cntCreated.should.be.bignumber.equal(1)
  })

  it('Проголосовать, 2+ , 1-', async function () {
    await this.arbitration.createArbitration(testBuyer, testServiceOwner, 1, 20, 1)
    await this.arbitration.vote(1, true, {from: arbiterList[0]})
    let voteRes = await this.arbitration.voitedResults(1)
    voteRes.should.be.bignumber.equal(2001)
    // second vote
    await this.arbitration.vote(1, true, {from: arbiterList[1]})
    voteRes = await this.arbitration.voitedResults(1)
    voteRes.should.be.bignumber.equal(2002)

    // third vote
    await this.arbitration.vote(1, false, {from: arbiterList[2]})
    voteRes = await this.arbitration.voitedResults(1)
    voteRes.should.be.bignumber.equal(2001)
  })

  it('Не дает дважды голосовать.', async function () {
    await this.arbitration.createArbitration(testBuyer, testServiceOwner, 1, 20, 1)
    await this.arbitration.vote(1, true, {from: arbiterList[0]})
    let voteRes = await this.arbitration.voitedResults(1)
    voteRes.should.be.bignumber.equal(2001)
    // second vote
    return expect(this.arbitration.vote(1, true, {from: arbiterList[0]}))
      .to.be.eventually.rejected
  })

  it('Не дает голосовать не участнику арбитража.', async function () {
    await this.arbitration.createArbitration(testBuyer, testServiceOwner, 1, 20, 1)
    expect(this.arbitration.vote(1, true, {from: noInArbiter})).to.be.eventually.rejected
    let voteRes = await this.arbitration.voitedResults(1)
    voteRes.should.be.bignumber.equal(2000)
  })

  it('Не дает закрыть арбитраж.', async function () {
    // ждем 100% голосов
    await this.arbitration.createArbitration(testBuyer, testServiceOwner, 1, 99, 100)
    await this.arbitration.vote(1, true, {from: arbiterList[0]})
    return expect(this.arbitration.closeVote(1, {from: noInArbiter})).to.be.eventually.rejected
  })

  it('Проверяем чтение контракта', async function () {
    await this.arbitration.createArbitration(testBuyer, testServiceOwner, 1, 20, 1)
    await this.arbitration.createArbitration(testBuyer, testServiceOwner, 1, 99, 12)
    const cntCreated = await this.arbitration.arbiterCount()
    cntCreated.should.be.bignumber.equal(2)
    return this.arbitration.arbiterStats.call(2).then(function (res) {
      expect(res[0].toNumber()).to.be.equal(2)
      expect(res[1]).to.be.equal(testBuyer.toLowerCase())
      expect(res[2]).to.be.equal(testServiceOwner.toLowerCase())
      expect(res[3].toNumber()).to.be.equal(1)
      expect(res[4]).to.be.equal(false)
      expect(res[6].toNumber()).to.be.equal(99)
      expect(res[7].toNumber()).to.be.equal(12)
      expect(res[8].toNumber()).to.be.equal(0)
    })
  })
})
