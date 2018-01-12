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
            <div class="modalContacts-center-contact" v-for="contact in contacts"
                 @click="createRoom(contact); modalContactDisplay = 'display: none'">
              <div class="modalContacts-center-contact-icon">
                <div class="modalContacts-center-contact-icon-circle"></div>
              </div>
              <div class="modalContacts-center-contact-username">
                {{contact.firstName}}  {{contact.lastName}}
              </div>
            </div>
        </div>
        <div class="modalContacts-drop" @click="modalContactDisplay = 'display: none'"></div>
      </section>

    </section>

      </div>
</template>



<script>
  import Sidebar from './ChatSidebar.vue'

  export default {
    name: 'Chat',
    data () {
      return {
        contacts: [],
        modalContactDisplay: "display: none"
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
      createRoom(user) {
        console.log("Contact");
        console.log("USER" + user);
        let room = this.$store.getters.getRoomExisting(user.userID);
        console.log(room);
        if (room) {
            this.$router.push({ name: 'contact', params: { chatID: room }});
        } else {
          this.$store.dispatch('setNewRoom', { userID: user.userID});
          let data = {
            userID: user.userID,
            ME: this.myself
          };
          this.$socket.emit("createNewRoom-Chat.vue-Server", data);
          this.createRoom(user);
        }
        this.changeName(user.firstName + " " + user.lastName);
      },
      clickButton: function(){
        this.$router.push({ name: 'Login'});
      }
    },
  }
</script>




<style scoped>
</style>
