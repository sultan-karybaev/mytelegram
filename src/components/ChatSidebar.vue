<template>


    <div class="downsection">

      <div class="downsection-sidebar">
        <div class="downsection-sidebar-search">
          <div class="downsection-sidebar-search-inputblock">
            <div class="downsection-sidebar-search-inputblock-img">
              <img src="../assets/search-white.svg" style="width: 10px; height: 10px">
            </div>
            <input class="downsection-sidebar-search-inputblock-input" placeholder="Search"/>
          </div>
        </div>

        <div class="downsection-sidebar-contacts" v-for="user in users">
            <div class="downsection-sidebar-contact" >
              <div class="downsection-sidebar-contact-icon">
                <div class="downsection-sidebar-contact-icon-circle"></div>
              </div>
              <div class="downsection-sidebar-contact-info">
                <div class="downsection-sidebar-contact-info-person" v-text="user.name"></div>
                <div class="downsection-sidebar-contact-info-message" v-text="user.address.street"></div>
              </div>
              <div class="downsection-sidebar-contact-time" v-text="user.address.zipcode"></div>
            </div>
        </div>

      </div>


      <contact />

    </div>


</template>

<script>
  import Contact from './ChatSidebarContact.vue'
  import axios from 'axios'

export default {
  name: 'Sidebar',
  data () {
    return {
      msg: 'Good Luck',
      text: "Telegram clone",
      users: []
    }
  },
  components: {
    Contact
  },
  mounted(){
    console.log("Hello");
    this.callHello();
  },
  methods: {
    callHello() {
      console.log("Call");
      let users = this.users;
      axios.get('../../users.json')
        .then(function (response) {
          console.log(response.data);
          response.data.forEach(function (t) {
            users.push(t)
          })
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
