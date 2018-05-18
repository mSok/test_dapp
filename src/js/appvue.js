import Vue from 'vue';
import VueRouter from 'vue-router'
import App from './App.vue'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: App
    }]
})

new Vue({    // eslint-disable-line no-new
    el: '#app',
    router,
    data: {
    },
    render: h => h(App)
  })
