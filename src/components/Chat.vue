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

          <div class="header-name">
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
            <div class="modalContacts-center-contact" v-for="contact in contacts">
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
    },
    components: {
      Sidebar
    },
    methods: {
      changeName(name) {
        console.log("Header " + name);
        this.contactName = name;
      }
    },
    created() {
      Event.$on("name", function () {
        console.log("CHAT");
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
