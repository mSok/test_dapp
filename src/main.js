import Vue from 'vue'
import router from './router'
import App from './App.vue'

Object.defineProperty(Vue.prototype, '$bus', {
  get () {
    return this.$root.bus
  }
})

var bus = new Vue({})

// eslint-disable-next-line
var app = new Vue({
  el: '#app',
  router,
  data: {
    bus: bus
  },
  render: h => h(App)
})

export default app
