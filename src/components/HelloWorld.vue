<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 @click="getPush">Essential Links</h2>

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
