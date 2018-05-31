import Vue from 'vue'
import VueRouter from 'vue-router'

import BetContract from './BetContract.vue'
import Dashboard from './Dashboard.vue'
import SetBet from './SetBet.vue'
import Account from './Account.vue'
import Hist from './History.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/bets',
      name: 'bets',
      component: BetContract
    },
    {
      path: '/bets/:contract_id',
      name: 'setbet',
      component: SetBet
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/history',
      name: 'history',
      component: Hist
    }
  ]
})

export default router
