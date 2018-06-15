<template>
  <div class="container mt-4">
    <div class="text-center">
        <p class="lead text-muted"> История изменения</p>
    </div>
    
  </div>
</template>

<script>
import Vue from 'vue'
// import {getContractHist} from './utils/contracts.js'

export default {
    data () {
        return {
            contract: []
        }
    },
    methods: {
        fetchData(){
            // getContractHist().then(data => {
            //     this.contract = data
            //     console.log(data)
            // })
        }
    },
    created() {
        this.fetchData()
    }
  }
</script>
