import Vue from 'vue'
import router from './router'
import App from './App.vue'

Object.defineProperty(Vue.prototype, '$bus', {
  get () {
    return this.$root.bus
  }
})

var bus = new Vue({})

new Vue({    // eslint-disable-line no-new
  el: '#app',
  router,
  data: {
    bus: bus
  },
  render: h => h(App)
})
