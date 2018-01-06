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
                  <div class="downsection-sidebar-contact-info-message" v-html="room.lastMessageText"></div>
                </div>
                <div class="downsection-sidebar-contact-time" >{{room.lastMessageTime}}</div>
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
    this.myself = this.$store.getters.getUser;
    this.rooms = this.$store.getters.getRooms;
    this.rooms[0].chosenClass = "chosen";

    let defaultRoom = 1;

    this.$router.push({ name: 'contact', params: { roomID: defaultRoom }});

    let data = {
      roomID: defaultRoom,
      userID: this.myself.userID
    };
    this.$socket.emit("enterRoom-ChatSidebar.vue-Server", data);

    //Socket
    this.$options.sockets.newLastMessageChatSidebarSocket = (data) => {
      console.log("Titanic");
      this.setLastMessage(data);
    }
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
    changeName(name) {
      this.$emit("name", name);
    },
    getChat(roomID, index) {
      console.log("getChat");
      let data = {
        roomID: roomID,
        userID: this.myself.userID
      };
      this.$socket.emit("enterRoom-ChatSidebar.vue-Server", data);
      this.$router.push({ name: 'contact', params: { roomID: roomID }});
      for (let i = 0; i < this.rooms.length; i++) {
        console.log("room");
        this.rooms[i].chosenClass = "unchosen";
      }
      this.rooms[index].chosenClass = "chosen";
    },
    setLastMessage(lastMessage) {
      console.log("setLastMessage");
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].roomID == lastMessage.roomID) {
          console.log("message", lastMessage);
          console.log("this.rooms[i].lastMessageText", this.rooms[i].lastMessageText);
          this.rooms[i].lastMessageText = lastMessage.text;
          this.rooms[i].lastMessageTime = lastMessage.time;
        }
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.unchosen{
  /*background-color: none;*/
}
.chosen{
  background-color: #7594e3;
}


</style>
