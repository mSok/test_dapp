var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
};

var Contracts = artifacts.require("./Contracts.sol");

module.exports = function(deployer) {
  deployer.deploy(Contracts);
};