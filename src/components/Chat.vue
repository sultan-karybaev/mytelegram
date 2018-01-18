<template>
  <div class="hello">
    <section class="section">

      <section class="main-block">

        <div class="header">

          <div class="header-sidebar">
            <div class="header-sidebar-block" @click="openMenu">
              <div class="header-sidebar-block-menu">
                <div class="header-sidebar-block-menu-lines">
                  <div class="header-sidebar-block-menu-line"></div>
                  <div class="header-sidebar-block-menu-line"></div>
                  <div class="header-sidebar-block-menu-line"></div>
                </div>
              </div>
              <div class="header-sidebar-block-company">Chat</div>
            </div>

            <div class="header-sidebar-down" :style="{display: menuDisplay}">
              <div class="header-sidebar-down-block" @click="openMenu(); modalGroupDisplay = 'display: flex';">
                <div class="header-sidebar-down-block-icon">
                  <img src="../assets/multiple-users-silhouette.svg"/>
                </div>
                <div class="header-sidebar-down-block-text">New Group</div>
              </div>
              <div class="header-sidebar-down-block" @click="openMenu(); modalContactDisplay = 'display: flex';">
                <div class="header-sidebar-down-block-icon">
                  <img src="../assets/user.svg"/>
                </div>
                <div class="header-sidebar-down-block-text">Contacts</div>
              </div>
              <div class="header-sidebar-down-block">
                <div class="header-sidebar-down-block-icon">
                  <img src="../assets/gear.svg"/>
                </div>
                <div class="header-sidebar-down-block-text">Settings</div>
              </div>
            </div>
          </div>

          <div class="header-name" >
            <div class="header-name-person" v-text="roomProfile.name"></div>
            <div class="header-name-index">last seen 20 minutes ago</div>
          </div>
          <div class="header-search" @click="clickButton">
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

      <section class="modalWindow" :style=modalContactDisplay>
        <div class="modalContacts-center">
          <div class="modal-header">My contacts</div>
          <div class="modalContacts-center-contacts">
            <div class="modal-contact" v-for="contact in contacts"
                 @click="createRoom(contact)">
              <div class="modal-contact-icon">
                <div class="modal-contact-icon-circle" :style="{ 'background-image': 'url(' + contact.avatar + ')' }">
                  <!--<img :src=contact.avatar style="width: 40px; height: 40px; border-radius: 20px;"/>-->
                </div>
              </div>
              <div class="modal-contact-username">
                {{contact.firstName}}  {{contact.lastName}}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-drop" @click="modalContactDisplay = 'display: none'"></div>
      </section>

      <section class="modalWindow" :style=modalMessageDisplay>
        <div class="modalMessage-center">
          <div class="modal-header">Write a message</div>
          <div class="modalMessage-center-middle">
            <textarea class="modalMessage-center-middle-textarea" v-model="chatTextarea"/>
          </div>
          <div class="modalMessage-center-bottom">
            <div class="modalMessage-center-bottom-button" @click="sendFirstMessage">Send</div>
          </div>
        </div>
        <div class="modal-drop" @click="modalMessageDisplay = 'display: none'"></div>
      </section>

      <section class="modalWindow" :style=modalGroupDisplay>
        <div class="modalGroup-center">
          <div class="modal-header">Create new group</div>
          <div class="modalGroup-center-name">
            <input placeholder="Group's name" v-model="groupName" @keyup="groupChecking"/>
          </div>
          <div class="modalGroup-center-typeGroup">
            <div class="modalGroup-center-typeGroup-button" :class="publicClass"
                 @click="publicClass = 'typeGroupChosen'; privateClass = 'typeGroupUnchosen'">Public</div>
            <div class="modalGroup-center-typeGroup-button" :class="privateClass"
                 @click="publicClass = 'typeGroupUnchosen'; privateClass = 'typeGroupChosen'">Private</div>
          </div>
          <div class="modalGroup-center-contacts" ref="modalGroup">
            <div class="modal-contact" v-for="(contact, index) in contacts"  @click="addContact(index)">
              <div class="modal-contact-icon">
                <div class="modal-contact-icon-circle" :style="{ 'background-image': 'url(' + contact.avatar + ')' }">
                </div>
              </div>
              <div class="modal-contact-username">
                {{contact.firstName}}  {{contact.lastName}}
              </div>
            </div>
          </div>
          <div class="modalGroup-center-bottom" ref="modalGroupBottom">
            <div class="modalGroup-center-bottom-button" @click="createNewGroup">Create new group</div>
          </div>
        </div>
        <div class="modal-drop" @click="modalGroupDisplay = 'display: none'"></div>
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
        modalGroupDisplay: "display: none",
        chatTextarea: "",
        menuDisplay: "none",
        groupIndexes: [],
        publicClass: "typeGroupChosen",
        privateClass: "typeGroupUnchosen",
        groupName: "",
        roomProfile: {}
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
    watch: {
      '$route.params.roomID': function (newVal) {
        this.roomProfile = this.$store.getters.getRoomProfile(this.$route.params.roomID);
        console.log("HEADER");
        console.log(this.roomProfile);
      },
    },
    methods: {
      openMenu() {
        if (this.menuDisplay == "none") this.menuDisplay = "block";
        else this.menuDisplay = "none";
      },
      createRoom(contact) {
        const vm = this;
        this.contact = contact;
//        vm.modalMessageDisplay = "display: flex";
        axios.get("http://localhost:3000/get/roomExisting/" + this.myself._id + "/" + this.contact._id)
          .then(function (res) {
            let roomProfile = res.data;
            if (roomProfile) {
              vm.modalContactDisplay = 'display: none';
              vm.$store.dispatch('setRoomChosenChatSidebarvue', roomProfile._id);
              if (vm.$store.getters.getHasRoomBeenOpened(roomProfile.roomID)) {
                vm.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID }});
              } else {
                axios.get("http://localhost:3000/get/messages/" + roomProfile.roomID)
                  .then(function (res) {
                    vm.$socket.emit("enterRoom-ChatSidebar.vue-Server", roomProfile.roomID, vm.myself._id);
                    vm.$store.dispatch('setMessagesLoginSidebarvue', res.data);
                    vm.$router.push({ name: 'contact', params: { roomID: roomProfile.roomID }});
                  })
                  .catch(err => console.log(err));
              }
            } else {
              vm.modalMessageDisplay = "display: flex";
            }
          })
          .catch(err => console.log("Chat.vue-methods-createRoom", err));
      },
      clickButton: function(){
        this.$router.push({ name: 'Login'});
      },
      sendFirstMessage() {
        const vm = this;
        if (this.chatTextarea) {
          let firstMessage = {
            type: "Text",
            text: this.chatTextarea,
            time: new Date().getTime()
          };
          vm.$socket.emit("createNewRoom-Chat.vue-Server", vm.myself, vm.contact._id, firstMessage);
          this.modalMessageDisplay = 'display: none';
          this.modalContactDisplay = 'display: none';
          this.chatTextarea = "";
        }
      },
      addContact(index) {
        console.log(index);
        if (this.$refs.modalGroup.children[index].style.backgroundColor == "rgb(41, 67, 78)") {
          this.$refs.modalGroup.children[index].style.backgroundColor = "";
          this.$refs.modalGroup.children[index].children[1].style.color = "";
          for (let i = 0; i < this.groupIndexes.length; i++) {
            if (this.groupIndexes[i] == index) this.groupIndexes.splice(i, 1);
          }
        } else {
          this.$refs.modalGroup.children[index].style.backgroundColor = "#29434e";
          this.$refs.modalGroup.children[index].children[1].style.color = "#f5ecff";
          this.groupIndexes.push(index);
        }
      },
      groupChecking() {
        if (this.groupName) {
          this.$refs.modalGroupBottom.style.display = "block";
          this.$refs.modalGroupBottom.style.opacity = 1;
        } else {
          this.$refs.modalGroupBottom.style.display = "none";
          this.$refs.modalGroupBottom.style.opacity = 0;
        }
      },
      createNewGroup() {
        let roomType;
        if (this.publicClass == "typeGroupChosen") roomType = "Public-Group";
        else roomType = "Private-Group";

        let message = {
          type: "System",
          text: "created the group " + this.groupName,
          profileID: this.myself._id,
          time: new Date().getTime()
        };

        let room = {
          typeRoom: roomType,
          lastMessageText: this.myself.firstName + " created the group " + this.groupName,
          lastMessageTime: new Date().getTime(),
          memberCount: this.groupIndexes.length
        };

        let profileArray = [];

        console.log("createNewGroup");
        console.log(this.groupName);
        for (let i = 0; i < this.groupIndexes.length; i++) {
          console.log(this.contacts[this.groupIndexes[i]].firstName + " " + this.contacts[this.groupIndexes[i]].lastName);
          profileArray.push(this.contacts[this.groupIndexes[i]]);
        }

        this.$socket.emit("createNewGroup-Chat.vue-Server", this.myself, room, message, this.groupName, profileArray);
      },
    },
  }
</script>




<style scoped>
</style>
