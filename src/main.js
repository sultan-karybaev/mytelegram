import Vue from 'vue'
import VueTextareaAutosize from 'vue-textarea-autosize'
import VueSocketio from 'vue-socket.io';
import App from './App'
import router from './router'
import store from './vuex'
import './style/all.css'


Vue.config.productionTip = false;

//Vue.use(VueTextareaAutosize);
Vue.use(VueSocketio, 'http://localhost:3000');

window.Event = new Vue({

});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {message1: "1111"},
  router,
  store,
  sockets:{
    titan: function(){
      console.log('socket connected');

    },
    customEmit: function(val){
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    },
    setMessageSocket: function (data) {
      console.log('setMessageSocket');
      console.log(data);
      this.$store.dispatch('setMessage', data);
    },
    newLastMessageSocket: function (data) {
      console.log('newLastMessageSocket');
      Event.$emit("newLastMessage", data);
    }
  },
  template: '<App/>',
  components: { App }
});
