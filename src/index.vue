<template>
  <div id="index">

    <h1 @click="space">SpaceX</h1>

  </div>
</template>


<script>
  import Vue from 'vue'
  import VueTextareaAutosize from 'vue-textarea-autosize'
//  import App from 'App.vue'
//  import router from './router'
//  import store from './vuex'


  import VueRouter from 'vue-router'
//  import HelloWorld from '@/components/HelloWorld'
//  import Chat from '@/components/Chat'
//  import User from '@/components/ChatSidebarContact'

  Vue.use(VueRouter);
  Vue.config.productionTip = false;

  let router =  new VueRouter({
    routes: [
      {
        path: '/',
        name: 'HelloWorld',
        //component: HelloWorld
      },
      {
        path: '/chat',
        name: 'Chat',
        //component: Chat,
        children: [
          { path: ':chatID',
            name: "contact",
            //component: User
          }
        ]
      },
      {
        path: '*',
        redirect: "/chat"
      }
    ]
  });



  console.log("Ebay1");

  const Event = new Vue({

  });

export default Vue.component({
  name: 'index',
  methods: {
    space() {
      console.log("GOOOO");
    }
  },
  mounted() {
    console.log("Ebay2");
  },
  //components: {Event}
})



</script>








<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
