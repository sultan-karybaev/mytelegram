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
      Notification.requestPermission(function(permission){
        console.log('Результат запроса прав:', permission);
        if (permission = "granted") {
          new Notification("Sultan Karybaev", {
            tag : "ache-mail",
            body : "Привет, высылаю материалы по проекту...",
            icon : "http://habrastorage.org/storage2/cf9/50b/e87/cf950be87f8c34e63c07217a009f1d17.jpg"
          });
        }
      });
    }
  }
</script>





<style>


</style>
