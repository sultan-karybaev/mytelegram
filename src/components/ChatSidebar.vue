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
        <div  v-for="(room, index) in rooms" @click="getChat(room.roomID, index)" :class="room.chosenClass">
          <!--<router-link :to="{ name: 'contact', params: { chatID: room.roomID }}" >-->
          <div class="downsection-sidebar-contacts"  >
              <div class="downsection-sidebar-contact" >
                <div class="downsection-sidebar-contact-icon">
                  <div class="downsection-sidebar-contact-icon-circle"></div>
                </div>
                <div class="downsection-sidebar-contact-info">
                  <div class="downsection-sidebar-contact-info-person">
                    {{room.user.firstName}} {{room.user.lastName}}
                  </div>
                  <div class="downsection-sidebar-contact-info-message" v-html="room.lastMessage.text"></div>
                </div>
                <div class="downsection-sidebar-contact-time" >{{room.lastMessage.time}}</div>
              </div>
          </div>


          <!--</router-link>-->
        </div>
      </div>

      <!--<router-view></router-view>-->
      <contact />



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
      rooms: [],
      userID: "user",
      messageText: "",
    }
  },
  components: {
    Contact
  },
  mounted(){
    //this.callHello();
    this.rooms = this.$store.getters.getRooms;
    this.rooms[0].chosenClass = "chosen";

  },
  created() {
    Event.$on("newLastMessage", (message) => {
      this.setLastMessage(message);
    });

    this.$router.push({ name: 'contact', params: { chatID: 1 }});

  },
  watch: {
    "$store.state.rooms": function (newVal) {
      console.log("ROOMS");
      //this.messages = this.$store.getters.getMessages(this.$route.params.chatID);
    },
    "$store.state.messages": function (newVal) {
      //console.log("$store.state.messages");
      //this.rooms = this.$store.getters.getRooms;
      //console.log(this.rooms);
      //this.messages = this.$store.getters.getMessages(this.$route.params.chatID);
    },
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
    },
    getChat(roomID, index) {
      //this.$router.push({ path: `/chat/${index}` });
      console.log("getChat");
      this.$router.push({ name: 'contact', params: { chatID: roomID }});


      for (let i = 0; i < this.rooms.length; i++) {
        console.log("room");
        this.rooms[i].chosenClass = "unchosen";
      }
      this.rooms[index].chosenClass = "chosen";
    },
    setLastMessage(message) {
      console.log("setLastMessage");
      //this.rooms[0].lastMessage.text = "Blablabla";
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].roomID == message.roomID) {
          console.log(message);
          this.rooms[i].lastMessage = message;
        }
      }
    },
    changeClass() {
      if (this.chosenClass === "unchosen") {

      }
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

.unchosen{
  background-color: none;
}
.chosen{
  background-color: #7594e3;
}


</style>
