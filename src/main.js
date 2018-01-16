import Vue from 'vue'
import VueTextareaAutosize from 'vue-textarea-autosize'
import VueSocketio from 'vue-socket.io';
import App from './App'
import AccountKit from 'vue-facebook-account-kit'
import router from './router'
import store from './vuex'
import axios from 'axios'
import socketio from 'socket.io-client'

import './style/all.css'


Vue.config.productionTip = false;

//Vue.use(VueTextareaAutosize);
//export const SocketInstance = socketio('http://blablachat.me:8080?username=guest&v=0.2');
//Vue.use(VueSocketio, SocketInstance);
Vue.use(VueSocketio, 'http://localhost:3000');
Vue.use(AccountKit);
// Vue.use(axios);

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
      this.$store.dispatch('setMessageMainjs', data);
    },
    setLastMessageSocket: function (data) {
      console.log('setLastMessageSocket');
      console.log(data);
      this.$store.dispatch('setLastMessageMainjs', data);
    },
    createNewRoomSocketEmit: function (data) {
      console.log('createNewRoomSocketEmit');
      console.log(data);
      this.$store.dispatch('setNewRoomEmitMainjs', data);
      this.$router.push({ name: 'contact', params: { roomID: data.roomID._id }});
    },
    createNewRoomSocketBroadcast: function (data) {
      console.log('createNewRoomSocketBroadcast');
      console.log(data);
      this.$store.dispatch('setNewRoomBroadcastMainjs', data);
    },
    register: function (data) {
      console.log("register main");
      console.log(data);
    }
  },
  template: '<App/>',
  components: { App }
});
