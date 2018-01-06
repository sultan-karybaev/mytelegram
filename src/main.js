import Vue from 'vue'
import VueTextareaAutosize from 'vue-textarea-autosize'
import VueSocketio from 'vue-socket.io';
import App from './App'
import AccountKit from 'vue-facebook-account-kit'
import router from './router'
import store from './vuex'

import './style/all.css'


Vue.config.productionTip = false;

//Vue.use(VueTextareaAutosize);
Vue.use(VueSocketio, 'http://localhost:3000');
Vue.use(AccountKit);

window.Event = new Vue({

});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {message1: "1111"},
  router,
  store,
  sockets:{
    setMessageSocket: function (data) {
      console.log('setMessageSocket');
      console.log(data);
      this.$store.dispatch('setMessage', data);
    },
    createNewRoomSocket: function (data) {
      console.log('createNewRoomSocket');
      console.log(data);
      this.$store.dispatch('setNewRoom', { userID: data.userID});
    }
  },
  template: '<App/>',
  components: { App }
});
