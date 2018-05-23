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
        port: 8545,
        network_id: "15",
        gas: 4712388
      }
    }
};
