import Vue from 'vue'
import VueRouter from 'vue-router'

import BetContract from '../js/BetContract.vue'
import ServiceDashboard from '../js/ServiceDashboard.vue'
import TokenDashboard from '../js/TokenDashboard.vue'
import SetBet from '../js/SetBet.vue'
import Account from '../js/Account.vue'
import Hist from '../js/History.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: TokenDashboard
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceDashboard
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
