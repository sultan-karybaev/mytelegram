<template>
  <div id="app" style="text-align: left">
    <!--<h2>Plain Vue binding</h2>-->
    <!--<div style="width: 1200px; height: 100px; background-color: #42b983; overflow-y: hidden; overflow-x: hidden">-->
    <!--<textarea id="emo" v-model="message2" style="height: 30px"></textarea>-->
    <!--</div>-->
    <!--<p>{{ message2 }}</p>-->
    <!--<button id="btn" @click="cl">Button</button>-->

    <!--<img src="./assets/logo.png">-->

    <!--<h1>Venera</h1>-->

    <!--<router-link to="/chat">link</router-link>-->

    <router-view></router-view>

    <!--<chat></chat>-->

  </div>
</template>


<script>
  import chat from './components/Chat.vue'


//  document.getElementById("btn").addEventListener("click", function () {
//    console.log("Button");
//    console.log(document.getElementById("emo").value);
//    console.log(document.getElementsByClassName("emojionearea"));
//  });


export default
{
  name: 'app',
  data() {
    return {
      message2: "22222"
    }
  },
  methods: {
    cl() {
      console.log("Button");

      let d = document.getElementsByClassName("emojionearea");

      console.log(d[0]);

      d[0].style.width = "300px";
      d[0].style.borderRadius = "0";

      var obj = document.getElementsByClassName("emojionearea-editor");
      console.log(obj[0].innerHTML);
      console.log(document.getElementsByClassName("emojionearea-editor").innerHTML);
    }
  },
  mounted() {
    console.log("Button");

    $("#emo").emojioneArea({
      pickerPosition: "left"
    });

    let d = document.getElementsByClassName("emojionearea");

    let t = document.getElementById("emo");
    console.log(t);
    //d.style.width = "300px";

    console.log(d);

    //setTimeout(this.cl(), 10000);
//    $(document).ready(function () {
//      let d = document.getElementsByClassName("emojionearea");
//      console.log(d);
//    })
  },
  components: {
    chat: chat
  }
}
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

/*.emojionearea{*/
  /*width: 300px;*/
  /*border: 1px solid black;*/
  /*border-radius: 0;*/
/*}*/

/*.emojioneemoji{*/
  /*width: 20px;*/
  /*height: 20px;*/
  /*vertical-align: middle;*/
/*}*/

</style>
