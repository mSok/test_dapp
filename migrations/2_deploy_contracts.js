
// var SitisTradeTokenCrowdsale = artifacts.require("./SitisTradeTokenCrowdsale.sol");
// var SitisTradeToken = artifacts.require("./SitisTradeToken.sol");

// module.exports = function(deployer, network, accounts) {
//   const rate = new web3.BigNumber(1000);
//   const wallet = accounts[1];

//   return deployer
//       .then(() => {
//           return deployer.deploy(
//               SitisTradeTokenCrowdsale,
//               rate,
//               wallet,
//               SitisTradeToken.address
//           );
//       });
// };

// 
// (0) 0x103c0483c42c63706e4f1e3bb2fd9e827f9c7a37 (~100 ETH)
// (1) 0x03be2dc3c544c5f12a0b2850a5bbb232e20f9461 (~100 ETH)
// (2) 0x152cb9bb9e4d3cc4e6116b082c3c8b9b9eb6217b (~100 ETH)
//

var SitisArbitration = artifacts.require("./SitisArbitration.sol")
var SitisPlaceMarket = artifacts.require("./SitisPlaceMarket.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(
        SitisPlaceMarket,
        "",
    ).then(function(instancePlaceMarket) {
        console.log('PlceMarket adderss: ', SitisPlaceMarket.address)
        deployer.deploy(
            SitisArbitration,
            SitisPlaceMarket.address,
            [accounts[0], accounts[1], accounts[2]]
        ).then(function (res) {
            instancePlaceMarket.changeArbiter(SitisArbitration.address).then(async function() {
                console.log("arbiter walet in PlaceMarket after deploy: " ,await instancePlaceMarket.arbiterWallet())
            })
        })
    })
};
