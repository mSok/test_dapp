<template>
    <div>
        <div class="text-center">
            <p class="lead text-muted">Введите Email, он будет сохранен и привязан к вашему кошельку</p>
        </div>
    <div class="row pb-2">
        <div class="col-12">
            <div class="form-row justify-content-center pt-4">
                <input v-model="email" type="text" placeholder="Email">
                <input v-model="nick" type="text" class="ml-2" placeholder="Nickname">
                <button @click="setEmail" class="btn-primary ml-2">Тадам!</button>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {setEmail, getFullAccount } from './utils/contracts'
export default {
    data () {
        return {
            email:'',
            nick:''
        }
    },
    methods: {
        setEmail(){
            setEmail(this.email, this.nick)
        },
    },
    created(){
      getFullAccount().then(data => {
          if (data){
              this.email=data.email
              this.nick=data.nick
          }
      })
    },
  }
</script>
