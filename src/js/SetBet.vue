<template>
  <div class="container mt-4">
    <div class="text-center">
        <p>Ставка на контракт : #{{contract[1]}}, стоимостью {{contract[4]}}</p>
        <p class="lead text-muted"> {{contract[2]}}</p>
    </div>
    <div class="row flex-xl-nowrap justify-content-center pb-2">
        <div class="col-4">
            <input v-model="bet" type="text">
            <button @click="setBet" class="btn-primary">Тадам!</button>
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {getContract, setBet} from './utils/contracts.js'

export default {
    data () {
        return {
            bet: 0,
            contract: []
        }
    },
    props: {
        val: 0,
    },
    methods: {
        fetchData(){
            getContract(this.$route.params.contract_id).then(data => {
                this.contract = data
                console.log(data)
            })
        },
        setBet(){
            setBet(this.$route.params.contract_id, this.bet)
        },
    },
    created() {
        this.fetchData()
    }
  }
</script>
