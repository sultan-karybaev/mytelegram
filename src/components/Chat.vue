<template>
  <div class="hello">
    <section class="section">

      <section class="main-block">

        <div class="header">

          <div class="header-sidebar" @click="modalContactDisplay = 'display: flex'">
            <div class="header-sidebar-menu">
              <div class="header-sidebar-menu-lines">
                <div class="header-sidebar-menu-line"></div>
                <div class="header-sidebar-menu-line"></div>
                <div class="header-sidebar-menu-line"></div>
              </div>
            </div>
            <div class="header-sidebar-company">Chat</div>
          </div>

          <div class="header-name" @click="clickButton">
            <div class="header-name-person" id="contactNameChat"></div>
            <div class="header-name-index">last seen 20 minutes ago</div>
          </div>
          <div class="header-search">
            <img src="../assets/search-white.svg" style="width: 20px; height: 20px">
          </div>
          <div class="header-settings">
            <div class="header-settings-circles">
              <div class="header-settings-circle"></div>
              <div class="header-settings-circle"></div>
              <div class="header-settings-circle"></div>
            </div>
          </div>
        </div>

        <sidebar></sidebar>

      </section>

      <section class="modalContacts" :style=modalContactDisplay>
        <div class="modalContacts-center">
          <div class="modalContacts-center-header">My contacts</div>
            <div class="modalContacts-center-contact" v-for="contact in contacts"
                 @click="createRoom(contact)">
              <div class="modalContacts-center-contact-icon">
                <div class="modalContacts-center-contact-icon-circle" :style="{ 'background-image': 'url(' + contact.avatar + ')' }">
                  <!--<img :src=contact.avatar style="width: 40px; height: 40px; border-radius: 20px;"/>-->
                </div>
              </div>
              <div class="modalContacts-center-contact-username">
                {{contact.firstName}}  {{contact.lastName}}
              </div>
            </div>
        </div>
        <div class="modalContacts-drop" @click="modalContactDisplay = 'display: none'"></div>
      </section>

      <section class="modalMessage" :style=modalMessageDisplay>
        <div class="modalMessage-center">
          <div class="modalMessage-center-header">Write a message</div>
          <div class="modalMessage-center-middle">
            <textarea class="modalMessage-center-middle-textarea" v-model="chatTextarea"/>
          </div>
          <div class="modalMessage-center-bottom">
            <div class="modalMessage-center-bottom-button" @click="sendFirstMessage">Send</div>
          </div>
        </div>
        <div class="modalMessage-drop" @click="modalMessageDisplay = 'display: none'"></div>
      </section>

    </section>

      </div>
</template>



<script>
  import axios from 'axios'
  import Sidebar from './ChatSidebar.vue'

  export default {
    name: 'Chat',
    data () {
      return {
        contacts: [],
        modalContactDisplay: "display: none",
        modalMessageDisplay: "display: none",
        chatTextarea: ""
      }
    },
    mounted() {
      this.myself = this.$store.getters.getUser;
      this.contacts = this.$store.getters.getContacts;

//      if (!this.$store.getters.getExistingUserAccount) this.$router.push({ name: 'Login'});
    },
    components: {
      Sidebar
    },
    methods: {
      createRoom(contact) {
        const vm = this;
        vm.modalMessageDisplay = "display: flex";
//        axios.get("http://localhost:3000/get/roomExisting/" + this.myself._id + "/" + contact._id)
//          .then(function (res) {
//            let roomProfile = res.data;
//            if (roomProfile) {
//              vm.modalContactDisplay = 'display: none';
//              vm.$store.dispatch('setRoomChosenChatSidebarvue', roomProfile._id);
//              if (vm.$store.getters.getHasRoomBeenOpened(roomProfile.roomID)) {
//                vm.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID }});
//              } else {
//                axios.get("http://localhost:3000/get/messages/" + roomProfile.roomID)
//                  .then(function (res) {
//                    vm.$socket.emit("enterRoom-ChatSidebar.vue-Server", roomProfile.roomID);
//                    vm.$store.dispatch('setMessagesLoginSidebarvue', res.data);
//                    vm.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID }});
//                  })
//                  .catch(err => console.log(err));
//              }
//            } else {
//              vm.modalMessageDisplay = "display: flex";
//
//            }
//          })
//          .catch(err => console.log("Chat.vue-methods-createRoom", err));
      },
      clickButton: function(){
        this.$router.push({ name: 'Login'});
      },
      sendFirstMessage() {
        this.modalMessageDisplay = 'display: none';
        //vm.$socket.emit("createNewRoom-Chat.vue-Server", vm.myself, contact._id);
        if (this.chatTextarea) {
          let message = {
            type: "Text",
            text: this.chatTextarea,
            profileID: this.myself._id,
            time: new Date().getTime()
          }
        }
        this.chatTextarea = "";
      }
    },
  }
</script>




<style scoped>
</style>
