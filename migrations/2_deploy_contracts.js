// var Contracts = artifacts.require("./Contracts.sol");

// module.exports = function(deployer) {
//   deployer.deploy(Contracts);
// };

var SitisTradeTokenCrowdsale = artifacts.require("./SitisTradeTokenCrowdsale.sol");
var SitisTradeToken = artifacts.require("./SitisTradeToken.sol");

// module.exports = function(deployer) {
//   deployer.deploy(SitisTradeToken);
// };

module.exports = function(deployer, network, accounts) {
  const rate = new web3.BigNumber(1000);
  const wallet = accounts[1];

  return deployer
      .then(() => {
          return deployer.deploy(
              SitisTradeTokenCrowdsale,
              rate,
              wallet,
              SitisTradeToken.address
          );
      });
};