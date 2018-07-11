import Vue from 'vue'
import App from './App'
import router from './router'
import http from './common/js/http'
// import 'element-ui/lib/theme-chalk/index.css'
// import {DatePicker} from 'element-ui'

import 'common/stylus/index.styl'

// Vue.use(DatePicker)
http.setDefaults()

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
