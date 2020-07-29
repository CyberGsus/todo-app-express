import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import hljs from 'highlight.js'

Vue.config.productionTip = false

hljs.initHighlightingOnLoad()

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
