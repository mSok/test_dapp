
<template>
    <div>
        <div class="mx-auto w-50 mt-5 p-3 bg-dark text-white text-center">
                <span>ТОКЕН {{tokenName}} </span>
                <a v-bind:href="tokenUrl" target="_blank"> >>> </a>
          </div>
          <div class="mx-auto w-50 bg-dark text-white text-center">
            Это лучшее вложение средств. Успевай купить!.
          </div>
          <div class="mx-auto w-50 p-3 bg-dark text-white text-center">>
            Ваш Баланс токенов: <p style="font-size:21pt;">{{balance}}</p>
          </div>

          <div class="mx-auto w-50 p-3 text-center">
            <input v-model="buyAmount" type="text" class="form-control" placeholder="кол-во токенов">
            <button @click.prevent.stop="buyTokens" class="btn-primary" >Купить</button>
            <button class="btn" disabled>Продать</button>
          </div>
          <div>
            <span>Курс токена: {{rateBuitify}} ETH за 1 токен</span>

          </div>

          <!-- <span v-if="buyTX"> {{buyTX}} </span> -->
    </div>
</template>

<script>

import Vue from 'vue'
import VueResourse from 'vue-resource'
import {getAllContracts, getBalanceAccount, buyTokens, getTokenRate} from './utils/contracts.js'

export default {
  data () {
    return {
      tokenName: '',
      sym: '',
      amount: '',
      buyAmount: 0,
      buyTX:'',
      rate: 0,
      tokenAaddress: '',
      decimal:0,
      tokenUrl:'',
      options :{ year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric' },
    }
  },
  computed: {
    rateBuitify: function() {
      if (this.rate === 0 || this.rate === '0' || this.rate === undefined) {
        return ''
      }
      let humanRate = (1 / this.rate).toString()
      return humanRate.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    },
    // геттер вычисляемого значения
    balance: function () {
      if (this.amount === '0' || this.amount === undefined) {
        return '0'
      }
      let shortAmount = this.amount.substring(0, this.amount.length - this.decimal)
      shortAmount.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
      let shortDecial = this.amount.substring(this.amount.length - this.decimal, this.amount.length - this.decimal + 3)
      return shortAmount +',' + shortDecial + ' ' + this.sym
    }
  },
  methods: {
    fetchData(){
        getTokenRate().then(res =>{
          this.rate = res
        })
        getBalanceAccount().then(dt => {
          this.tokenName = dt[0]
          this.amount = dt[1]
          this.decimal = parseInt(dt[2])
          this.sym = dt[3]
          this.tokenAaddress = dt[4]
          this.tokenUrl = 'https://etherscan.io/token/' + this.tokenAaddress
        })
    },
    buyTokens(){
      console.log('buy ', this.buyAmount, ' tokens')
      let conwertToWei = web3.toWei(this.buyAmount / this.rate)
      console.log('this is  ', conwertToWei, ' wei')

      buyTokens(conwertToWei).then(res => {
        this.buyTX = res.transactionHash
        console.log('buy res ', res)
      })
    }
  },
  created(){
    this.fetchData()
  },
}
</script>

<style>
.table {
	table-layout:fixed;
}

.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
