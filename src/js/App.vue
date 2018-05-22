<template>
  <div id="reg" class="wrapper">
    <div>
        {{account}}
        <table class="table table-sm">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Номер контракта</th>
                    <th scope="col">Описание</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Цена</th>
                    <th scope="col">Владелец</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                
                <tr v-for="item in contractsData">
                    <th>{{parseInt(item[0])}}</th>
                    <td>{{item[1]}}</td>
                    <td>{{item[2]}}</td>
                    <td>{{new Date(item[3] * 1000).toLocaleDateString("ru-RU", options)}}</td>
                    <td>{{parseInt(item[4])}}</td>
                    <td>{{item[5]}}</td>
                </tr>
                
            </tbody>
        </table>

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
            hasVoted: false,
            options :{ year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric' },

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
      fetchData(){
        this.getAccount()
        this.initWeb3().then(()=>{
            // Load contract data
            this.contracts.Contracts.deployed().then(instance => {
                this.contractInstance = instance
                return this.contractInstance.contractCount()
            }).then((contractCount)  => {
                for (var i = 1; i <= contractCount+1; i++) {
                    this.contractInstance.contracts(i).then(contract => {
                        this.contractsData.splice(contract[0], 1, contract)
                    })
                }
                return true
            }).catch(function (error) {
                console.warn(error)
            })
        })
      }
    },
    created(){
      this.fetchData()
    },
  }
</script>
