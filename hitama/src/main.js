import Vue from 'vue'
import conf from './conf';

import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import util from './util';

Vue.config.productionTip = false

Vue.mixin({
  data() {
    return {
      console
    }
  },
  methods: {
    refresh() {
      util.routerPush(this.$router, this.$router.currentRoute.path);
    },
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
