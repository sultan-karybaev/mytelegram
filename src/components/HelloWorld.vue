<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 @click="testSocket">Essential Links</h2>

  </div>
</template>

<script>
  import axios from "axios"

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted() {
    this.$options.sockets.register = (data) => {
      console.log("register");
      console.log(data);
//      this.messages.push(data);
//      setTimeout(() => this.secondAudioPlayer(), 1000);
    }
  },
  methods: {
    getPush() {
      axios.get('http://localhost:3000/get')
        .then(response =>{
          console.log(response.data);
          //this.msg = response.data.message
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    testSocket() {
      console.log("testSocket");
      let username = "Sultan";
      let password = "test";
//      axios.post("http://blablachat.me:8080/" + "?username=" + username + "&password=" + password + "&v=0.2")
//        .then(response =>{
//          console.log(response);
//          //this.msg = response.data.message
//        })
//        .catch(function (error) {
//          console.log(error);
//        });
      let jsonObject = {phone:7077777777};
      this.$socket.emit("register", jsonObject);

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
