<template>
  <div id="reg" class="wrapper">
    <div>
        {{account}}
        {{contractsData}}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueResource from 'vue-resource'
import TruffleContract from 'truffle-contract'

Vue.use(VueResource)

export default {
    data () {
        return {
            message: 'Hello Vue!',
            web3Provider: null,
            web3: {},
            contracts: {},
            contractsData:[],
            account: '0x0',
            hasVoted: false
        }
    },
    methods: {
        getAccount(){
            // Load account data
            var self = this
            web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                self.account = account;
            }
            });
        },
        initContract: function() {
            
            let c = this.getContractJSON()
            // Instantiate a new truffle contract from the artifact
            this.contracts.Contracts = TruffleContract(c)
            // Connect provider to interact with contract
            this.contracts.Contracts.setProvider(this.web3Provider)
        },
        getContractJSON: function() {
             this.$http.get('/Contracts.json').then(response => {

                // get body data
                this.contractJSON = response.body
                return response.body

            }, response => {
                console.error('error get json contract')
            });
        },
        initWeb3: function () {
            // TODO: refactor conditional
            if (typeof web3 !== 'undefined') {
                // If a web3 instance is already provided by Meta Mask.
                this.web3Provider = web3.currentProvider
                this.web3 = new Web3(web3.currentProvider)
            } else {
                // Specify default instance if no web3 instance provided
                this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
                this.web3 = new Web3(this.web3Provider)
            }
            return this.initContract()
      },
      fetchData(){
        this.getAccount()
        this.initWeb3()

        // Load contract data
        debugger;
        this.contracts.Contracts.deployed().then(function (instance) {
          contractInstance = instance
          return contractInstance.contractCount()
        }).then(function (contractCount) {
            console.log('!!!!')
            console.log(contractCount)
            
          for (var i = 1; i <= contractCount; i++) {
            contractInstance.contracts(i).then(function (contract) {
              contractsData.push(contract)
              // var id = contract[0]
              // var contractNum = contract[1]
              // var description = contract[2]
              // var timestamp = new Date(contract[3] * 1000).toString()
              // var amount = contract[4]
              // var contractAddress = contract[5]

              // Render candidate Result
              // var contractTemplate = "<tr><th>" + id + "</th><td>" + contractNum + "</td><td>" + description + "</td><td>" + timestamp + "</td><td>" + amount + "</td><td>" + contractAddress + "</td></tr>"
              // contractResults.append(contractTemplate)

              // Render button
              // var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
              // candidatesSelect.append(candidateOption)
            })
          }
          return true
        }).catch(function (error) {
          console.warn(error)
        })
      }
    },
    created(){
      this.fetchData()
    },
  }
</script>