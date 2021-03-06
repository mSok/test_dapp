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
      // host: '94.154.15.64',
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    // ropsten: {
    //   host: "localhost",
    //   port: 8545,
    //   network_id: "3",
    //   gas: 1000000,
    //   gasPrice: 65000000000
    // }
  }
}
