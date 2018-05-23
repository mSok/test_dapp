import Vue from 'vue'
import VueRouter from 'vue-router'

import BetContract from './BetContract.vue'
import Dashboard from './Dashboard.vue'


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
    }
  ]
})

export default router
