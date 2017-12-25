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
        <div  v-for="(room, index) in rooms" @click="changeName(room.user.firstName + ' ' + room.user.lastName)">
          <router-link :to="{ name: 'contact', params: { chatID: room.roomID }}" >
          <div class="downsection-sidebar-contacts"  >
              <div class="downsection-sidebar-contact" >
                <div class="downsection-sidebar-contact-icon">
                  <div class="downsection-sidebar-contact-icon-circle"></div>
                </div>
                <div class="downsection-sidebar-contact-info">
                  <div class="downsection-sidebar-contact-info-person">
                    {{room.user.firstName}} {{room.user.lastName}}
                  </div>
                  <div class="downsection-sidebar-contact-info-message" ></div>
                </div>
                <div class="downsection-sidebar-contact-time" ></div>
              </div>
          </div>


          </router-link>
        </div>
      </div>

      <router-view></router-view>
      <!--<contact />-->



    </div>


</template>

<script>
  import Contact from './ChatSidebarContact.vue'
  import axios from 'axios'

export default {
  name: 'Sidebar',
  props: ["message"],
  data () {
    return {
      msg: 'Good Luck',
      text: "Telegram clone",
      rooms: [],
      userID: "user",
      messageText: ""
    }
  },
  components: {
    Contact
  },
  mounted(){
    //this.callHello();
    this.rooms = this.$store.getters.getRooms;
  },
  methods: {
    callHello() {
//      console.log("Call");
//      let users = this.users;
//      axios.get('../../users.json')
//        .then(function (response) {
//          console.log(response.data);
//          response.data.forEach(function (t) {
//            users.push(t)
//          })
//        })
//        .catch(function (error) {
//          console.log(error);
//        });
    },
    changeName(name) {
      this.$emit("name", name);
      Event.$emit("name", "Elon");

    },
    getChat(index, roomID) {
      //this.$router.push({ path: `/chat/${index}` });
      console.log(index);
      this.$router.push({ name: 'contact', params: { chatID: roomID }});
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
