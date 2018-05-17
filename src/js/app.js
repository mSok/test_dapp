App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3()
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider)
    }
    return App.initContract()
  },

  initContract: function() {
    $.getJSON('Contracts.json', function(c) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Contract = TruffleContract(c)
      // Connect provider to interact with contract
      App.contracts.Contract.setProvider(App.web3Provider)

      // App.listenForEvents()

      return App.render()
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.Contract.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function () {
    var contractInstance
    var loader = $("#loader")
    var content = $("#content")

    loader.show()
    content.hide()

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html('Your Account: ' + account)
      }
    });

    // Load contract data
    App.contracts.Contract.deployed().then(function (instance) {
      contractInstance = instance
      return contractInstance.contractCount()
    }).then(function (contractCount) {
      var contractResults = $('#contractResults')
      contractResults.empty()
      for (var i = 1; i <= contractCount; i++) {
        contractInstance.contracts(i).then(function (contract) {
          var id = contract[0]
          var contractNum = contract[1]
          var description = contract[2]
          var timestamp = new Date(contract[3] * 1000).toString()
          var amount = contract[4]
          var contractAddress = contract[5]

          // Render candidate Result
          var contractTemplate = "<tr><th>" + id + "</th><td>" + contractNum + "</td><td>" + description + "</td><td>" + timestamp + "</td><td>" + amount + "</td><td>" + contractAddress + "</td></tr>"
          contractResults.append(contractTemplate)

          // Render button
          // var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          // candidatesSelect.append(candidateOption)
        }).then(function () {
          loader.hide()
          content.show()
        })
      }
      return contractInstance.voters(App.account)
    }).catch(function (error) {
      console.warn(error)
    })
  }
}

$(function () {
  $(window).load(function () {
    App.init()
  })
})
