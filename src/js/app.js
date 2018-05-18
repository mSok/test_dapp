App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Contracts.json", function(c) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Contracts = TruffleContract(c);
      // Connect provider to interact with contract
      App.contracts.Contracts.setProvider(App.web3Provider);

    //   App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var contractInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();
    
    $(document).on('click', '#creartContract', function () {
        App.contracts.Contracts.deployed().then(function(instance) {
            contractInstance = instance;
            let cdata = $('#contract-data').serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            var pattern = /^\d+$/;
            if (
                cdata["contructnum"] === '' ||
                cdata["descr"] === '' ||
                cdata["amount"] === '' ||
                pattern.test(cdata["amount"]) === false){
                    $("#err").html("не валидные данные ");
                    return false
                }

            let ret = contractInstance.createContract(
                cdata["contructnum"],
                cdata["descr"],
                cdata["amount"]
            )
            document.getElementById("contract-data").reset();
        })
    });
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Contracts.deployed().then(function(instance) {
      contractInstance = instance;
      return contractInstance.contractCount();
    }).then(function(contractCount) {
      var contractsResults = $("#contractsResults");
      contractsResults.empty();

      for (var i = 1; i <= contractCount; i++) {
        contractInstance.contracts(i).then(function(contract) {
          var id = contract[0];
          var contractNum = contract[1];
          var description = contract[2];
          var timestamp = new Date(contract[3] * 1000);
          var amount = contract[4];
          var address = contract[5];

          // Render candidate Result
          link = "<a class='buyref' data-id=1 href='#'>Купить</a>"
          var contractTemplate = "<tr><th>"+ id +"</th><td>" + contractNum + "</td><td>" + description + "</td><td>" + timestamp +" </td><td>" + amount +" </td><td>" +  address +" </td><td>"+ link +"</td></tr>"
          contractsResults.append(contractTemplate);
        });
      }
      $(document).on('click', '.buyref', function () {
        let ret = contractInstance.buyContract(1)
        return true
        });
      return contractInstance;
    }).then(function(hasVoted) {
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
