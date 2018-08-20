/* global artifacts*/

var SitisArbitration = artifacts.require('./SitisArbitration.sol')
var SitisPlaceMarket = artifacts.require('./SitisPlaceMarket.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(
    SitisPlaceMarket,
    '',
  ).then(function (instancePlaceMarket) {
    console.log('PlaceMarket address: ', SitisPlaceMarket.address)
    deployer.deploy(
      SitisArbitration,
      SitisPlaceMarket.address,
      [accounts[0], accounts[1], accounts[2]]
    ).then(function (res) {
      instancePlaceMarket.changeArbiter(SitisArbitration.address).then(async function () {
        console.log('arbiter walet in PlaceMarket after deploy: ', await instancePlaceMarket.arbiterWallet())
      })
    })
  })
}
