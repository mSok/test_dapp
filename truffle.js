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
  networks: {
    development: {
      host: '94.154.15.64',
      port: 8545,
      network_id: '15',
      gas: 4712388
    }
  }
}
