module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    // rpc: {
    //     host: "localhost",
    //     port: 8545
    // },
    networks: {
      development: {
        host: "127.0.0.1",
        port: 7545,
        // port: 8545,
        network_id: "*", // Match any network id
        gas: 4698712
      }
    }
  };
  