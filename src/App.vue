<template>
  <div id="app">


      <!--<audio controls>-->
        <!--<source src="./audio/8cef22793c4da3cc05ad4583a6540479.webm" type="audio/webm"/>-->
      <!--</audio>-->

    <router-view></router-view>

  </div>
</template>


<script>
  import chat from './components/Chat.vue'

export default
{
  name: 'app',
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {

  },
  mounted() {

  },
  components: {
    chat: chat,
  }
}
</script>





<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}

</style>
