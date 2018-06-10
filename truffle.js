var path = require('path')

console.log(path.join(__dirname, 'src', 'assets'))
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  // rpc: {
  //     host: "localhost",
  //     port: 8545
  // },
  contracts_build_directory: path.join(__dirname, 'src', 'assets', 'contracts'),
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: '94.154.15.64',
      port: 8545,
      network_id: '15',
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: "3",
      gas: 6712389,
      gasPrice: 65000000000
    }
  }
}
