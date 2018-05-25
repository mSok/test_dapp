import Vue from 'vue'
import router from './router'
import App from './App.vue'

new Vue({    // eslint-disable-line no-new
  el: '#app',
  router,
  data: { },
  render: h => h(App)
})
