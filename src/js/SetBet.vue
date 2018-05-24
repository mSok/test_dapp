<template>
  <div class="container mt-4">
    BETS this
    <div class="pb-2">
        <input v-bind="bet" type="text">
        <button @click="setBet" class="btn-primary">Тадам!</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueResource from 'vue-resource'
import TruffleContract from 'truffle-contract'

export default {
    data () {
        return {
            web3Provider: null,
            web3: {},
            contracts: {},
            rateData:[],
            bet: 0
        }
    },
    props: {
        val: 0,
    },
    methods: {
        initContract: function() {
            return this.getContractJSON().then(function(c){
                this.contracts.Contracts = TruffleContract(c)
                this.contracts.Contracts.setProvider(this.web3Provider)
            })
        },
        getContractJSON: function() {
            return this.$http.get('/Contracts.json').then(response => {
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
      setBet(){
        this.getAccount()
        this.initWeb3().then(() => {
            // Load contract data
            this.contracts.Contracts.deployed().then(instance => {
                this.contractInstance = instance
                // this.contractInstance
                // Load account email
                return this.contractInstance.setContractRate(
                    $route.params.contract_id,
                    this.bet
                )
            }).catch(function (error) {
                console.warn(error)
            })
        })
      }
    }
  }
</script>
