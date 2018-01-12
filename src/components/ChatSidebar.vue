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
                  <div class="downsection-sidebar-contact-info-down">
                    <div class="downsection-sidebar-contact-info-down-text" v-html="room.lastMessageText"></div>
                    <div class="downsection-sidebar-contact-info-down-count">
                      <div class="downsection-sidebar-contact-info-down-count-number"
                           v-show="room.unreadMessageCount == 0 ? false : true">{{room.unreadMessageCount}}</div>
                    </div>
                  </div>
                </div>
                <div class="downsection-sidebar-contact-time" >{{room.lastMessageTime}}</div>
              </div>
          </div>


          <!--</router-link>-->
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
  data () {
    return {
      rooms: [],
      userID: "user",
      messageText: "",
      currentRoomID: ""
    }
  },
  components: {
    Contact
  },
  mounted(){
    this.myself = this.$store.getters.getUser;
    this.rooms = this.$store.getters.getRooms;
    this.rooms[0].chosenClass = "chosen";
    document.getElementById("contactNameChat").innerHTML = this.rooms[0].user.firstName + " " + this.rooms[0].user.lastName;

    let defaultRoom = 1;
    this.currentRoomID = defaultRoom;

//    this.$router.push({ name: 'contact', params: { roomID: defaultRoom }});

    let data = {
      roomID: defaultRoom,
      userID: this.myself.userID
    };
    this.$socket.emit("enterRoom-ChatSidebar.vue-Server", data);

    //Socket
    this.$options.sockets.newLastMessageChatSidebarSocket = (data) => {
      console.log("Titanic");
      this.setLastMessage(data);
    };
  },
  watch: {
    "$store.state.rooms": function (newVal) {
      console.log("ROOMS");
    },
  },
  methods: {
    getChat(roomID, index) {
      console.log("getChat");
      Event.$emit("audio");
      document.getElementById("contactNameChat").innerHTML = this.rooms[index].user.firstName + " " + this.rooms[index].user.lastName;
      let data = {
        roomID: roomID,
        userID: this.myself.userID
      };
      this.$socket.emit("enterRoom-ChatSidebar.vue-Server", data);
      this.$router.push({ name: 'contact', params: { roomID: roomID }});
      this.currentRoomID = roomID;
      for (let i = 0; i < this.rooms.length; i++) {
        this.rooms[i].chosenClass = "unchosen";
      }
      this.rooms[index].chosenClass = "chosen";
      this.rooms[index].unreadMessageCount = 0;
    },
    setLastMessage(lastMessage) {
      console.log("setLastMessage");
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].roomID == lastMessage.roomID) {
          console.log("message", lastMessage);
          console.log("this.rooms[i].lastMessageText", this.rooms[i].lastMessageText);
          this.rooms[i].lastMessageText = lastMessage.text;
          this.rooms[i].lastMessageTime = lastMessage.time;
          if (this.rooms[i].roomID !== this.currentRoomID) this.rooms[i].unreadMessageCount++;
        }
      }
    }
  }
}
</script>


<style scoped>

.unchosen{
  /*background-color: none;*/
}
.chosen{
  background-color: #7594e3;

}
  .chosen > div > div > div div{
    color: white;
  }


</style>
