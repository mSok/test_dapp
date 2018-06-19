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
        <button @click="signMessage" class="btn-primary ml-2">ntcn!</button>
    </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {utf8ToHex} from 'web3-utils'
import * as sigUtil from "eth-sig-util";
import {setEmail, getFullAccount } from './utils/account'
import {globalStore} from './utils/globalStore'
import {web3inst, getCoinbase} from './utils/initContract'

export default {
  data () {
    return {
      email:'',
      nick:'',
      errMsg: ''
    }
  },
  methods: {
    signMessage(text){
      text = text || 'sign your account'
      let eth, prov
      [eth, prov] = web3inst()
      var msg = utf8ToHex(text)
      return getCoinbase().then(from => {
        // https://medium.com/metamask/the-new-secure-way-to-sign-data-in-your-browser-6af9dd2a1527
        /*  web3.personal.sign not yet implemented!!!
        *  We're going to have to assemble the tx manually!
        *  This is what it would probably look like, though:
            web3.personal.sign(msg, from) function (err, result) {
              if (err) return console.error(err)
              console.log('PERSONAL SIGNED:' + result)
            })
        */
        console.log('CLICKED, SENDING PERSONAL SIGN REQ')
        var params = [msg, from]
        var method = 'personal_sign'

        return new Promise((resolve, reject) => web3.currentProvider.send({
          method,
          params,
          from},
          (err, result) => {
            if (err) {
              reject(err)
            } else {
              if (result.error) return reject(err)
              console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))
              console.log('recovering...')
              const msgParams = { data: msg }
              msgParams.sig = result.result
              console.dir({ msgParams })
              const recovered = sigUtil.recoverPersonalSignature(msgParams)
              console.dir({ recovered })

              if (recovered === from ) {
                console.log('SigUtil Successfully verified signer as ' + from)
                    resolve(true);
              } else {
                console.dir(recovered)
                console.log('SigUtil Failed to verify signer when comparing ' + recovered.result + ' to ' + from)
                console.log('Failed, comparing %s to %s', recovered, from)
                    resolve(false);
              }
            }
        }));
    })
    },
    
    setEmail(){
      this.signMessage('set new account email and name').then(res =>{
        console.log('res of sign :', res)
        if (res === true) {
          setEmail(this.email, this.nick)
        }
      })
      
    },
  },
  created(){
    // если не задали в глобальном сторадже, то прочитаем из БД
    if (globalStore.account === undefined) {
      getFullAccount().then(data => {
      if (data){
        this.email=data.email
        this.nick=data.nick
        }
      },
      error => {
        if (error.code !== 403) {
          console.error(error)
        }
      })
    } else {
      console.log('read from global store ')
      this.email=globalStore.account.email
      this.nick=globalStore.account.nick
    }
  },
}
</script>
