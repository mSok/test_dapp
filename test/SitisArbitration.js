// SitisArbitration
const BigNumber = web3.BigNumber
const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var SitisArbitration = artifacts.require("./SitisArbitration.sol");

contract('SitisArbitration', function() {
  marketplace = "0x103c0483c42c63706e4f1e3bb2fd9e827f9c7a37"
  arbiterList = ["0x103c0483c42c63706e4f1e3bb2fd9e827f9c7a37", "0x03be2dc3c544c5f12a0b2850a5bbb232e20f9461", "0x152cb9bb9e4d3cc4e6116b082c3c8b9b9eb6217b"]
  noInArbiter = "0x0d0df7bd5f49618a5ca0905239f7d33784cb2a9f"

  beforeEach(async function () {
    this.arbitration = await SitisArbitration.new(marketplace, arbiterList)
  })

  // it('should be owner', async function () {
  //   const owner = await this.arbitration.owner()
  //   owner.should.equal(this.arbitration.address)
  // })


  it("Должно создать арбитраж", async function() {
      const cnt = await this.arbitration.arbiterCount()
      cnt.should.be.bignumber.equal(0)
      await this.arbitration.createArbitration(1, 1, 1, 20, 1)
      const cnt_created = await this.arbitration.arbiterCount()
      cnt_created.should.be.bignumber.equal(1)
  })

  it("Проголосовать, 2+ , 1-", async function() {
    await this.arbitration.createArbitration(1, 1, 1, 20, 1)
    console.log('Vote: ', arbiterList[0])
    await this.arbitration.vote(1, true, {from: arbiterList[0] })
    let vote_res = await this.arbitration.voitedResults(1)
    vote_res.should.be.bignumber.equal(2001)
    // second vote
    console.log('Vote: ', arbiterList[1])
    await this.arbitration.vote(1, true, {from: arbiterList[1]})
    vote_res = await this.arbitration.voitedResults(1)
    vote_res.should.be.bignumber.equal(2002)

    // third vote
    console.log('Vote: ', arbiterList[2])
    await this.arbitration.vote(1, false, {from: arbiterList[2]})
    vote_res = await this.arbitration.voitedResults(1)
    vote_res.should.be.bignumber.equal(2001)
  })

  it("Не дает дважды голосовать.", async function() {
    const res = await this.arbitration.createArbitration(1, 1, 1, 20, 1)

    console.log('Vote: ', arbiterList[0])
    await this.arbitration.vote(1, true, {from: arbiterList[0] })
    let vote_res = await this.arbitration.voitedResults(1)
    vote_res.should.be.bignumber.equal(2001)
    // second vote
    console.log('Vote: ', arbiterList[1])
    try {
      await this.arbitration.vote(1, true, {from: arbiterList[0]})
    } catch (err) { return; }
    throw new Error('Should have thrown an error');
  })

  it("Не дает голосовать не участнику арбитража.", async function() {
    await this.arbitration.createArbitration(2, 2, 1, 20, 1)
    console.log('Vote: ', noInArbiter)
    try {
      await this.arbitration.vote(1, true, {from: noInArbiter})
    } catch (err) { return; }
    throw new Error('Should have thrown an error');
    let vote_res = await this.arbitration.voitedResults(1)
    vote_res.should.be.bignumber.equal(2000)
  })

  it("Не дает закрыть арбитраж.", async function() {
    // ждем 100% голосов
    await this.arbitration.createArbitration(2, 2, 1, 99, 100)
    
    await this.arbitration.vote(1, true, {from: arbiterList[0] })
    try {
      await this.arbitration.closeVote(1, {from: noInArbiter})
    } catch (err) { return; }
    const stat = await this.arbitration.arbiterStats.call(1)
    console.log(stat)
    const cnt_arb = await this.arbitration.arbiterListCount()
    console.log("Всего арбитрев:", cnt_arb.toNumber())
    percent = await this.arbitration.percent(1, cnt_arb, 3)
    console.log("Проголосовало в %:", percent.toNumber())
    throw new Error('Закрыли не имея 100% голосов', stat);

    await this.arbitration.vote(1, true, {from: arbiterList[1] })

    console.log('Vote: ', noInArbiter)
    try {
      await this.arbitration.vote(1, true, {from: noInArbiter})
    } catch (err) { return; }
    throw new Error('Should have thrown an error');
    let vote_res = await this.arbitration.voitedResults(1)
    vote_res.should.be.bignumber.equal(2000)
  })
})
