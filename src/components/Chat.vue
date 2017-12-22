<template>
  <div class="hello">
    <section class="section">

      <section class="main-block">

        <div class="header">
          <div class="header-sidebar">
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
            <div class="header-name-person">Elon Musk</div>
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


        <sidebar />

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
        text: "Telegram clone"
      }
    },
    components: {
      Sidebar
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
