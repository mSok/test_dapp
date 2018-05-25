<template>
    <div>
        <div class="text-center">
            <p class="lead text-muted">Введите Email, он будет сохранен в сети blockchain и привязан к вашему кошельку</p>
        </div>
    <div class="row flex-xl-nowrap justify-content-center pb-2">
        <div class="form-row">
            <input v-model="email" type="text">
            <button @click="setEmail" class="btn-primary">Тадам!</button>
        </div>
    </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {setEmail} from './utils/contracts'
export default {
    data () {
        return {
            email:''
        }
    },
    methods: {
        setEmail(){
            setEmail(this.email)
        },
    }
  }
</script>
