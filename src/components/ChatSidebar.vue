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
        <div  v-for="(room, index) in rooms" @click="getChat(room, index)" :class="room.chosen ? 'chosen' : 'unchosen'">
          <!--<router-link :to="{ name: 'contact', params: { chatID: room.roomID }}" >-->
          <div class="downsection-sidebar-contacts"  >
              <div class="downsection-sidebar-contact" >
                <div class="downsection-sidebar-contact-icon">
                  <div class="downsection-sidebar-contact-icon-circle">
                    <img :src="room.img" style="width: 46px; height: 46px; border-radius: 23px"/>
                  </div>
                </div>
                <div class="downsection-sidebar-contact-info">
                  <div class="downsection-sidebar-contact-info-person">
                    {{room.name}}
                  </div>
                  <div class="downsection-sidebar-contact-info-down">
                    <div class="downsection-sidebar-contact-info-down-text" v-html="room.roomID.lastMessageText"></div>
                    <div class="downsection-sidebar-contact-info-down-count">
                      <div class="downsection-sidebar-contact-info-down-count-number"
                           v-show="room.unreadMessageCount == 0 ? false : true">{{room.unreadMessageCount}}</div>
                    </div>
                  </div>
                </div>
                <div class="downsection-sidebar-contact-time" >{{room.roomID.lastMessageTime}}</div>
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
      currentRoomID: "",
      openedRooms: [],
    }
  },
  components: {
    Contact
  },
  mounted(){
    this.myself = this.$store.getters.getUser;
    this.rooms = this.$store.getters.getRooms;
    this.messagesTest = this.$store.getters.getMessegesTest;
    console.log("this.myself", this.myself);
    console.log("this.rooms", this.rooms);
    console.log("this.messagesTest", this.messagesTest);

    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].chosen) {
        document.getElementById("contactNameChat").innerHTML = this.rooms[i].name;
        this.openedRooms.push(this.rooms[i].roomID._id);
        this.$router.push({ name: 'contact', params: { roomID: this.rooms[i].roomID._id }});
      }
    }

    //this.$router.push({ name: 'contact', params: { roomID: defaultRoom }});

//    let data = {
//      roomID: this.rooms[0]._id,
//      userID: this.myself.userID
//    };
    //this.$socket.emit("enterRoom-ChatSidebar.vue-Server", data);

    //Socket
    this.$options.sockets.newLastMessageChatSidebarSocket = (data) => {
      console.log("Titanic");
      this.setLastMessage(data);
    };
  },
  watch: {
    "$store.state.rooms": function (newVal) {
      this.rooms = this.$store.getters.getRooms;
    },
  },
  methods: {
    getChat(roomProfile, index) {
      const vm = this;
      console.log("this.openedRooms", this.openedRooms);
      document.getElementById("contactNameChat").innerHTML = roomProfile.name;
      let data = {
        roomID: roomProfile,
        userID: this.myself.userID
      };
//      this.$socket.emit("enterRoom-ChatSidebar.vue-Server", data);

      //edged script - next is Messages
      let check = 0;
      for (let i = 0; i < this.openedRooms.length; i++) {
        if (this.openedRooms[i] == roomProfile.roomID._id) {
          vm.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID._id }});
          break;
        }
        check++;
      }
      if (check == this.openedRooms.length) {
        axios.get("http://localhost:3000/get/messages/" + roomProfile.roomID._id)
          .then(function (res) {
            console.log("res.data", res.data);
            vm.openedRooms.push(roomProfile.roomID._id);
            vm.$store.dispatch('setMessagesLoginvue', res.data);
            vm.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID._id }});
          })
          .catch(err => console.log(err));
      }

      //this.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID._id }});
      this.currentRoomID = roomProfile;
      for (let i = 0; i < this.rooms.length; i++) {
        this.rooms[i].chosen = false;
      }
      this.rooms[index].chosen = true;
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
