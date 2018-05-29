<template>
    <div>
        <div class="text-center">
            <p class="lead text-muted">Введите Email, он будет сохранен в сети blockchain и привязан к вашему кошельку</p>
        </div>
    <div class="row pb-2">
        <div class="col-6">
            <div class="form-row justify-content-center pt-4">
                <input v-model="email" type="text">
                <button @click="setEmail" class="btn-primary">Тадам!</button>
            </div>
        </div>
        <div class="col-6">
            <p class="lead text-muted">История логина: </p>
            <table class="table table-sm">
                <thead class="thead-dark">
                    <tr >
                        <th>логин</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in hist">
                        <td>{{item['_email']}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {setEmail, getFullAccount, getAccountHist} from './utils/contracts'
export default {
    data () {
        return {
            email:'',
            hist: []
        }
    },
    methods: {
        setEmail(){
            setEmail(this.email)
        },
    },
    created(){
    //   getAccountHist(this)
      getFullAccount().then(data => {
          if (data){
              this.email=data
          }
      })
    },
    mounted(){
        this.$bus.$on('reloadAccount', event => {
            getAccountHist(this)
        })
        this.$bus.$on('accountHist', event => {
            console.log('catch bus event accountHist....')
            for (var i = 0; i < event.length; i++) {
                this.hist.push(event[i].args)
            }
        });
    }
  }
</script>
