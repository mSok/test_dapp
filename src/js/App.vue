<template>
  <div class="container-fluid mt-4">
        <ul class="nav nav-tabs ">
            <li class="nav-item">
                <router-link exact active-class="bg-primary text-white" class="nav-link" :to="{name: 'dashboard'}">Главная</router-link>
            </li>
            <li class="nav-item">
                <router-link exact active-class="bg-primary text-white" class="nav-link" :to="{name: 'bets'}">Ставки</router-link>
            </li>
            <li class="nav-item">
                <router-link exact active-class="bg-primary text-white" class="nav-link" :to="{name: 'account'}">Аккаунт</router-link>
            </li>
        </ul>
        <router-view></router-view>
        <div v-if="account" class="alert alert-info text-center"> Ваш аккаунт: {{account}}</div>
        <div v-else class="alert alert-warning text-center"> <router-link :to="{name: 'account'}"> Необходима регистрация {{selfAddress}}</router-link></div>
        
        <!-- {{fullAccount}} -->
  </div>
</template>

<script>
import Vue from 'vue'
import {getFullAccount, listenForEvents} from './utils/contracts.js'

export default {
    data () {
        return {
            account: false,
            selfAddress: '0x00'
        }
    },
    methods: {

    },
    created(){
        this.selfAddress = web3.eth.coinbase
        listenForEvents(this)
        getFullAccount().then(acc=>{
            this.account = acc;
        })
    },
    mounted(){
      this.$bus.$on('reloadAccount', event => {
        console.log('catch bus event reloadAccount....')
        getFullAccount().then(acc=>{
            this.account = acc;
        })
      });
    },

  }
</script>
<style>

@media only screen and (max-width: 800px) {
    
    /* Force table to not be like tables anymore */
    #no-more-tables table,
    #no-more-tables thead,
    #no-more-tables tbody,
    #no-more-tables th,
    #no-more-tables td,
    #no-more-tables tr {
        display: block;
    }
 
    /* Hide table headers (but not display: none;, for accessibility) */
    #no-more-tables thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }
 
    #no-more-tables tr { border: 1px solid #ccc; }
 
    #no-more-tables td { 
        /* Behave  like a "row" */
        border: none;
        border-bottom: 1px solid #eee; 
        position: relative;
        padding-left: 50%; 
        white-space: normal;
        text-align:left;
    }
 
    #no-more-tables td:before {
        /* Now like a table header */
        position: absolute;
        /* Top/left values mimic padding */
        top: 6px;
        left: 6px;
        width: 45%; 
        padding-right: 10px; 
        white-space: nowrap;
        text-align:left;
        font-weight: bold;
    }
 
    /*
    Label the data
    */
    #no-more-tables td:before { content: attr(data-title); }
}
</style>

