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
import {getFullAccount} from './utils/contracts.js'

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
        getFullAccount().then(acc=>{
            this.account = acc;
        })
    }

  }
</script>
