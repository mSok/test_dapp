import app from '../../main'
import axios from 'axios'
import {getCoinbase} from './initContract'

// получаем инф. о аккаунте из БД
export function getFullAccount () {
  return getCoinbase().then(selfAccount => {
    if (selfAccount === undefined || selfAccount === null) {
      console.log('selfAccount: ', selfAccount)
      throw (new Error({
        code: 403,
        reason: 'Not authorized'
      }))
    } else {
      console.log('account read from db...')
      return axios.get('/api/user/' + selfAccount).then(res => {
        console.log(res.data)
        if (!res.data) return false
        return res.data
      })
    }
  },
  error => {
    console.error(error)
  })
}
export function setEmail (email, nick) {
  let self = this
  return getCoinbase().then(selfAccount => {
    if (selfAccount === undefined) return false
    let postData = {
      email: email,
      nick: nick,
      id: selfAccount,
      address: selfAccount
    }
    return axios.post('/api/user/', postData).then(res => {
      console.log('Account changed')
      console.log(res)
      console.log(self)
      app.bus.$emit('reloadAccount', res)
    })
  })
}