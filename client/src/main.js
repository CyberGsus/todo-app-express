import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import highlightjs from 'highlight.js'

Vue.config.productionTip = false

highlightjs.initHighlightingOnLoad()

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
