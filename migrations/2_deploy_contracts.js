/* global artifacts*/

var SitisArbitration = artifacts.require('./SitisArbitration.sol')
var SitisPlaceMarket = artifacts.require('./SitisPlaceMarket.sol')

module.exports = function (deployer, network, accounts) {
  // deployer.deploy(SitisPlaceMarket, '');
  // deployer.deploy(SitisArbitration, accounts[0] ,[accounts[0], accounts[1], accounts[2]]);

  deployer.deploy(
    SitisPlaceMarket,
    '',
  ).then(function (instancePlaceMarket) {
    console.log('PlaceMarket address: ', instancePlaceMarket.address)
    return deployer.deploy(
      SitisArbitration,
      instancePlaceMarket.address,
      [accounts[0], accounts[1], accounts[2]]
    ).then(async function (res) {
      instancePlaceMarket.changeArbiter(res.address).then(async function () {
        console.log('arbiter walet in PlaceMarket after deploy: ', await instancePlaceMarket.arbiterWallet())
      })
    })
  })
}
