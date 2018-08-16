
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

var SitisArbitration = artifacts.require("./SitisArbitration.sol")
module.exports = function(deployer) {
    deployer.deploy(SitisArbitration);
};
