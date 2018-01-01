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
            <div class="header-name-person">{{contactName}}</div>
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


        <sidebar message="Mars" @name="changeName">Earth</sidebar>

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
        msg: 'Good Luck',
        text: "Telegram clone",
        contactName: "",
        contacts: [],
        modalContactDisplay: "display: none"
      }
    },
    mounted() {
      this.contacts = this.$store.getters.getContacts;
      this.$options.sockets.titanic = (data) => {
        console.log("Titanic")
      }
    },
    components: {
      Sidebar
    },
    methods: {
      changeName(name) {
        console.log("Header " + name);
        this.contactName = name;
      },
      createRoom(user) {
        console.log("Contact");
        console.log("USER" + user);
        let room = this.$store.getters.getRoomExisting(user.userID);
        console.log(room);
        if (room) {
            this.$router.push({ name: 'contact', params: { chatID: room }});
        } else {
          this.$store.dispatch('setNewRoom', { userID: user.userID});
          this.createRoom(user);
        }
        this.changeName(user.firstName + " " + user.lastName);
      },
      clickButton: function(){
        // $socket is socket.io-client instance
        //console.log("clickButton");
        this.$socket.emit('titanic');
      }
    },
    created() {
      const vm = this;

      Event.$on("headerSenderUserName", function (user) {
        console.log("CHAT");
        console.log(user);
        //this.contactName = "user";
        vm.changeName(user.firstName + " " + user.lastName);
      });
    }
  }
</script>




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
