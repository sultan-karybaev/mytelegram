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
// export const SocketInstance = socketio('http://blablachat.me:8080?username=guest&v=0.2');
// Vue.use(VueSocketio, SocketInstance);
// Vue.use(VueSocketio, 'http://207.154.201.153:8080/?username=guest');
let username = 22;
let password = "9rFqkf2U";
// Vue.use(VueSocketio, 'http://207.154.201.153:8080/?username='+username+'&password='+password);
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
    updateRoomProfileSocket: function (roomProfile) {
      console.log('updateRoomProfileMainjs');
      console.log(roomProfile);
      if (!roomProfile.member) {
        this.$socket.emit("leaveRoom-ChatSidebar.vue-Server", roomProfile.roomID._id);
      }
      this.$store.dispatch('updateRoomProfileMainjs', roomProfile);
    },
    setFirstMessageSocket: function (data) {
      console.log('setFirstMessageSocket');
      console.log(data);
      this.$store.dispatch('setMessagesLoginSidebarvue', data);
    },
    createNewRoomSocketEmit: function (data) {
      console.log('createNewRoomSocketEmit');
      console.log(data);
      this.myself = this.$store.getters.getUser;
      this.$store.dispatch('setNewRoomEmitMainjs', data);
      this.$socket.emit("enterRoom-ChatSidebar.vue-Server", data.roomID._id, this.myself._id);
      this.$router.push({ name: 'contact', params: { roomID: data.roomID._id }});
    },
    createNewRoomSocketBroadcast: function (data) {
      console.log('createNewRoomSocketBroadcast');
      console.log(data);
      this.$store.dispatch('setNewRoomBroadcastMainjs', data);
    },
    connect: function (data) {
      console.log("socket connect1");
      this.$socket.emit("presence", {username : 22, lastActivity: 1})
    },
    chatevent: function () {
      console.log("chatevent");
    },
    register: function (data) {
      console.log("register");
      console.log(data);
    }
  },
  template: '<App/>',
  components: { App }
});
