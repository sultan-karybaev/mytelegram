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
                  <div class="downsection-sidebar-contact-icon-circle" :style="{ 'background-image': 'url(' + room.img + ')' }">
                    <!--<img :src="room.img" style="width: 46px; height: 46px; border-radius: 23px"/>-->
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
                <div class="downsection-sidebar-contact-time" v-text="computedTime(room.roomID.lastMessageTime)"></div>
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
    }
  },
  components: {
    Contact
  },
  created() {
    const vm = this;
    Event.$on("Store-to-Sidebar-lastMessage", function () {
      vm.rooms = vm.$store.getters.getRooms;
      console.log("vm.rooms", vm.rooms);
    });
    Event.$on("Store-to-Sidebar-enterRoom", function (roomID) {
      console.log("Store-to-Sidebar-enterRoom");
      vm.$socket.emit("enterRoom-ChatSidebar.vue-Server", roomID);
    });
  },
  mounted(){
    this.myself = this.$store.getters.getUser;
    this.rooms = this.$store.getters.getRooms;

    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].chosen) {
        if (this.rooms[i].member) this.$socket.emit("enterRoom-ChatSidebar.vue-Server", this.rooms[i].roomID._id, this.myself._id);
        this.$router.push({ name: 'contact', params: { roomID: this.rooms[i].roomID._id }});
      }
    }
  },
  watch: {
    "$store.state.roomProfiles": function (newVal) {
      console.log("$store.state.roomProfiles");
      this.rooms = this.$store.getters.getRooms;
    },
  },
  methods: {
    getChat(roomProfile, index) {
      const vm = this;
      this.$store.dispatch('setRoomChosenChatSidebarvue', roomProfile._id);
      vm.$socket.emit("chooseRoom-ChatSidebar.vue-Server", roomProfile.roomID._id, vm.myself._id);
      if(vm.$store.getters.getHasRoomBeenOpened(roomProfile.roomID._id)) {
        vm.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID._id }});
      } else {
        axios.get("http://localhost:3000/get/messages/" + roomProfile._id)
          .then(function (res) {
            console.log("GROUP", res.data);
            if (roomProfile.member) vm.$socket.emit("enterRoom-ChatSidebar.vue-Server", roomProfile.roomID._id);
            vm.$store.dispatch('setMessagesLoginSidebarvue', res.data);
            vm.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID._id }});
          })
          .catch(err => console.log(err));
      }
    },
    computedTime(time) {
      let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jule", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return  new Date(time * 1000 / 1000).getDate() + " " + months[new Date(time * 1000 / 1000).getMonth()];
    }
  }
}
</script>




<style scoped>

.unchosen{
  /*background-color: none;*/
}
.chosen{
  background-color: #546e7a;

}
  .chosen > div > div > div div{
    color: white;
  }
  .chosen > div > div > div {
    color: white;
  }
.unchosen:hover {
  background: rgba(129, 156, 169, .5);
}


</style>
