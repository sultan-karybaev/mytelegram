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

          <div class="header-name" @click="getRoomInfo">
            <div class="header-name-person" v-text="roomProfile.name"></div>
            <div class="header-name-index">last seen 20 minutes ago</div>
            <!--last seen 20 minutes ago-->
          </div>
          <div class="header-search" @click="clickButton">
            <img src="../assets/search-white.svg" style="width: 20px; height: 20px">
          </div>
          <div class="header-settings" @click="openFilter">
            <div class="header-settings-circles">
              <div class="header-settings-circle"></div>
              <div class="header-settings-circle"></div>
              <div class="header-settings-circle"></div>
            </div>

            <div class="header-settings-down" :style="{display: filterDisplay}">
              <div class="header-settings-down-block">Text</div>
              <div class="header-settings-down-block">Images</div>
              <div class="header-settings-down-block">Audio</div>
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

      <section class="modalWindow" :style=modalMessageDisplay style="z-index: 5">
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

      <section class="modalWindow" :style=modalPersonDisplay>
        <div class="modalPerson-center">
          <div class="modal-header">Contact info</div>
          <div class="modalPerson-center-person">
            <div class="modalPerson-center-person-left">
              <div class="modalPerson-center-person-left-icon" :style="{ 'background-image': 'url(' + contactInfo.avatar + ')' }"></div>
            </div>
            <div class="modalPerson-center-person-right">
              <div class="modalPerson-center-person-name">{{contactInfo.firstName}}</div>
              <div class="modalPerson-center-person-name">{{contactInfo.lastName}}</div>
            </div>
          </div>
          <div class="modalPerson-center-phone">
            <div class="modalPerson-center-phone-left">
              <img src="../assets/phone-receiver.svg"/>
            </div>
            <div class="modalPerson-center-phone-right">
              {{contactInfo.phone}}
            </div>
          </div>
        </div>
        <div class="modal-drop" @click="closePersonModal"></div>
      </section>

      <section class="modalWindow" :style=modalGroupInfoDisplay>
        <div class="modalGroupInfo-center">
          <div class="modal-header">Group info</div>
          <div class="modalGroupInfo-center-group">
            <div class="modalGroupInfo-center-group-left">
              <div class="modalGroupInfo-center-group-left-icon" :style="{ 'background-image': 'url(' + roomProfile.img + ')' }"></div>
            </div>
            <div class="modalGroupInfo-center-group-right">
              <div class="modalGroupInfo-center-group-name">{{roomProfile.name}}</div>
              <div class="modalGroupInfo-center-group-members">{{roomProfile.roomID.memberCount}} members</div>
            </div>
          </div>
          <div class="modalGroupInfo-center-invite" v-if="roomProfile.admin">
            <div class="modalGroupInfo-center-invite-left">
              <img src="../assets/user.svg"/>
            </div>
            <div class="modalGroupInfo-center-invite-right">
              <p @click="modalAddNewMemberDisplay = 'display: flex'">add new member</p>
            </div>
          </div>
          <div class="modalGroupInfo-center-block">you</div>
          <div class="modalGroupInfo-center-personBlock">
            <div class="modalGroupInfo-center-personBlock-person">
                <div class="modalGroupInfo-center-personBlock-person-icon">
                  <div class="modalGroupInfo-center-personBlock-person-icon-circle" :style="{ 'background-image': 'url(' + myself.avatar + ')' }"></div>
                </div>
                <div class="modalGroupInfo-center-personBlock-person-username">
                  {{myself.firstName}}  {{myself.lastName}}
                </div>
            </div>
            <div class="modalGroupInfo-center-personBlock-buttons">
              <div class="modalGroupInfo-center-personBlock-buttons-button" style="width: 100%" @click="leaveGroup">
                <p>Leave this group</p>
              </div>
            </div>
          </div>
          <div class="modalGroupInfo-center-block">admins</div>
          <div class="modalGroupInfo-center-personBlock" v-for="(admin, index) in admins">
            <div class="modalGroupInfo-center-personBlock-person" @click="adminClick(index)">
              <div class="modalGroupInfo-center-personBlock-person-icon">
                <div class="modalGroupInfo-center-personBlock-person-icon-circle" :style="{ 'background-image': 'url(' + admin.profileID.avatar + ')' }"></div>
              </div>
              <div class="modalGroupInfo-center-personBlock-person-username">
                {{admin.profileID.firstName}}  {{admin.profileID.lastName}}
              </div>
            </div>
            <div class="modalGroupInfo-center-personBlock-buttons" v-if="roomProfile.admin && admin.profileID._id != myself._id">
              <div class="modalGroupInfo-center-personBlock-buttons-button" style="width: 60%" @click="removeAdmin(index)">
                <p>Remove admin</p>
              </div>
              <div class="modalGroupInfo-center-personBlock-buttons-button" style="width: 40%" @click="removeAdminFromGroup(index)">
                <p>Remove</p>
              </div>
            </div>
          </div>
          <div class="modalGroupInfo-center-block">members</div>
          <div class="modalGroupInfo-center-personBlock" v-for="(member, index) in members">
            <div class="modalGroupInfo-center-personBlock-person" @click="memberClick(index)">
              <div class="modalGroupInfo-center-personBlock-person-icon">
                <div class="modalGroupInfo-center-personBlock-person-icon-circle" :style="{ 'background-image': 'url(' + member.profileID.avatar + ')' }"></div>
              </div>
              <div class="modalGroupInfo-center-personBlock-person-username">
                {{member.profileID.firstName}}  {{member.profileID.lastName}}
              </div>
            </div>
            <div class="modalGroupInfo-center-personBlock-buttons" v-if="roomProfile.admin">
              <div class="modalGroupInfo-center-personBlock-buttons-button" style="width: 60%" @click="assignAdmin(index)">
                <p>Assign admin</p>
              </div>
              <div class="modalGroupInfo-center-personBlock-buttons-button" style="width: 40%" @click="removeMemberFromGroup(index)">
                <p>Remove</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-drop" @click="modalGroupInfoDisplay = 'display: none'"></div>
      </section>

      <section class="modalWindow" :style=modalAddNewMemberDisplay style="z-index: 5">
        <div class="modalContacts-center">
          <div class="modal-header">Add new member</div>
          <div class="modalContacts-center-contacts" ref="modalMember">
            <div class="modal-contact" v-for="(contact, index) in contacts" @click="addNewMember(index)">
              <div class="modal-contact-icon">
                <div class="modal-contact-icon-circle" :style="{ 'background-image': 'url(' + contact.avatar + ')' }"></div>
              </div>
              <div class="modal-contact-username">{{contact.firstName}}  {{contact.lastName}}</div>
            </div>
          </div>

          <div class="modalGroup-center-bottom" ref="modalMemberBottom">
            <div class="modalGroup-center-bottom-button" @click="addMembersToGroup">Add new members</div>
          </div>

        </div>
        <div class="modal-drop" @click="modalAddNewMemberDisplay = 'display: none'"></div>
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
        admins: [],
        members: [],
        modalContactDisplay: "display: none",
        modalMessageDisplay: "display: none",
        modalGroupDisplay: "display: none",
        modalPersonDisplay: "display: none",
        modalGroupInfoDisplay: "display: none",
        modalAddNewMemberDisplay: "display: none",
        chatTextarea: "",
        menuDisplay: "none",
        filterDisplay: "none",
        groupIndexes: [],
        memberIndexes: [],
        publicClass: "typeGroupChosen",
        privateClass: "typeGroupUnchosen",
        groupName: "",
        roomProfile: {roomID: {}},
        contactInfo: {},
        groupInfo: {},
        myself: {},
        groupBoolean: false
      }
    },
    created() {
      const vm = this;
      Event.$on("From-Contact-To-Chat", function (profileID) {
        console.log("From-Contact-To-Chat");
        console.log(profileID);
        axios.get("http://localhost:3000/get/profile/" + profileID)
          .then(function (res) {
            console.log(res.data);
            vm.contactInfo = res.data;
            vm.modalPersonDisplay = 'display: flex';
          })
          .catch(err => console.log(err));
      });
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
      },
    },
    methods: {
      openMenu() {
        const vm = this;
        if (this.menuDisplay == "none") {
          this.menuDisplay = "block";
          window.addEventListener("mouseup", vm.openMenu);
        } else {
          this.menuDisplay = "none";
          window.removeEventListener("mouseup", vm.openMenu);
        }
      },
      openFilter() {
        const vm = this;
        console.log("openFilter");
        if (this.filterDisplay == "none") {
          this.filterDisplay = "block";
          window.addEventListener("mouseup", vm.openFilter);
        } else {
          this.filterDisplay = "none";
          window.removeEventListener("mouseup", vm.openFilter);
        }
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
      addNewMember(index) {
        if (this.$refs.modalMember.children[index].style.backgroundColor == "rgb(41, 67, 78)") {
          this.$refs.modalMember.children[index].style.backgroundColor = "";
          this.$refs.modalMember.children[index].children[1].style.color = "";
          for (let i = 0; i < this.memberIndexes.length; i++) {
            if (this.memberIndexes[i] == index) this.memberIndexes.splice(i, 1);
          }
        } else {
          this.$refs.modalMember.children[index].style.backgroundColor = "#29434e";
          this.$refs.modalMember.children[index].children[1].style.color = "#f5ecff";
          this.memberIndexes.push(index);
        }

        if (this.memberIndexes.length > 0) {
          this.$refs.modalMemberBottom.style.display = "block";
          this.$refs.modalMemberBottom.style.opacity = 1;
        } else {
          this.$refs.modalMemberBottom.style.display = "none";
          this.$refs.modalMemberBottom.style.opacity = 0;
        }
      },
      addMembersToGroup() {
        let profileArray = [];
        for (let i = 0; i < this.memberIndexes.length; i++) {
          profileArray.push(this.contacts[this.memberIndexes[i]]);
        }
        for (let j = 0; j < this.members.length; j++) {
          for (let k = 0; k < profileArray.length; k++) {
           if (this.members[j].profileID._id == profileArray[k]._id) profileArray.splice(k, 1);
          }
        }
        if (profileArray.length > 0) {
          this.$socket.emit("addMembersToGroup-Chat.vue-Server", this.myself, this.roomProfile, profileArray);
        }
        this.modalAddNewMemberDisplay = 'display: none';
        this.modalGroupInfoDisplay = 'display: none';
      },
      removeMemberFromGroup(index) {
        this.$socket.emit("removeMemberFromGroup-Chat.vue-Server", this.myself, this.roomProfile, this.members[index].profileID);
        this.modalGroupInfoDisplay = 'display: none';
      },
      removeAdminFromGroup(index) {
        this.$socket.emit("removeMemberFromGroup-Chat.vue-Server", this.myself, this.roomProfile, this.admins[index].profileID);
        this.modalGroupInfoDisplay = 'display: none';
      },
      assignAdmin(index) {
        this.$socket.emit("assignAdmin-Chat.vue-Server", this.myself, this.roomProfile, this.members[index].profileID);
        this.modalGroupInfoDisplay = 'display: none';
      },
      removeAdmin(index) {
        this.$socket.emit("removeAdmin-Chat.vue-Server", this.myself, this.roomProfile, this.admins[index].profileID);
        this.modalGroupInfoDisplay = 'display: none';
      },
      leaveGroup() {
        this.$socket.emit("leaveGroup-Chat.vue-Server", this.myself, this.roomProfile);
        this.modalGroupInfoDisplay = 'display: none';
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
          memberCount: this.groupIndexes.length + 1
        };

        let profileArray = [];

        for (let i = 0; i < this.groupIndexes.length; i++) {
          profileArray.push(this.contacts[this.groupIndexes[i]]);
        }

        this.$socket.emit("createNewGroup-Chat.vue-Server", this.myself, room, message, this.groupName, profileArray);
        this.modalGroupDisplay = 'display: none';
      },
      getRoomInfo() {
        const vm = this;
        if (this.roomProfile.roomID.typeRoom == "Standart") {
          let data = {
            roomID: this.roomProfile.roomID._id,
            profileID: this.myself._id
          };
          axios.post("http://localhost:3000/post/getContactViaRoom", data)
            .then(function (res) {
              console.log(res.data);
              vm.contactInfo = res.data;
              vm.modalPersonDisplay = 'display: flex';
            })
            .catch(err => console.log(err));
        } else {
          const vm = this;
          axios.get("http://localhost:3000/get/admins/" + vm.roomProfile.roomID._id,)
            .then(function (res) {
              console.log("Admin");
              console.log(res.data);
              vm.admins = res.data;
            })
            .catch(err => console.log(err));
          axios.get("http://localhost:3000/get/members/" + vm.roomProfile.roomID._id,)
            .then(function (res) {
              console.log("Member");
              console.log(res.data);
              vm.members = res.data;
            })
            .catch(err => console.log(err));
          this.modalGroupInfoDisplay = 'display: flex';
        }
      },
      adminClick(index) {
        this.contactInfo = this.admins[index].profileID;
        this.modalPersonDisplay = 'display: flex';
        this.modalGroupInfoDisplay = 'display: none';
        this.groupBoolean = true;
      },
      memberClick(index) {
        this.contactInfo = this.members[index].profileID;
        this.modalPersonDisplay = 'display: flex';
        this.modalGroupInfoDisplay = 'display: none';
        this.groupBoolean = true;
      },
      closePersonModal() {
        this.modalPersonDisplay = 'display: none';
        if (this.groupBoolean) this.modalGroupInfoDisplay = 'display: flex'; this.groupBoolean = false;
      }
    },
  }
</script>




<style scoped>
</style>
