// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueTextareaAutosize from 'vue-textarea-autosize'
import App from './App'
import router from './router'
import store from './vuex'
import './style/all.css'

Vue.config.productionTip = false;

Vue.use(VueTextareaAutosize);

window.Event = new Vue({

});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
