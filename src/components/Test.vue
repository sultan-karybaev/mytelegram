<template>
  <div>

    <div >
      <input id="imageMessage" type="file" @change="testFile" style="display: none">
      <label tabindex="0" for="imageMessage" >Select images</label>
    </div>

  </div>
</template>


<script>
  import axios from 'axios'

  export default
  {
    name: 'Test',
    data() {
      return {
        file: ""
      }
    },
    computed: {

    },
    methods: {
      testFile(event) {
        this.someData = event.target.files[0];
        console.log(this.someData);

        let imgData = {
          name: this.someData.name,
          size: this.someData.size,
          type: this.someData.type
        };

        console.log(imgData);
        //this.$socket.emit("test", event.target.files[0]);
      }
    },
    mounted() {

    }
  }
</script>





<style>


</style>
