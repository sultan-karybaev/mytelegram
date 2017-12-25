<template>

  <div class="downsection-maincontent">

    <div class="downsection-maincontent-messageblock">

      <div class="downsection-maincontent-messageblock-bottom">

        <div class="downsection-maincontent-messageblock-message" v-for="message in messages">
          <div class="downsection-maincontent-messageblock-message-check">
            <img src="../assets/tick.svg" style="width: 26px; height: 26px" class="downsection-maincontent-messageblock-message-check-icon">
          </div>
          <div class="downsection-maincontent-messageblock-message-text">
            <div class="downsection-maincontent-messageblock-message-text-contact">
              <!-- ------------- -->
              <div class="downsection-maincontent-messageblock-message-text-contact-icon">
                <div class="downsection-maincontent-messageblock-message-text-contact-icon-circle"></div>
              </div>
              <div class="downsection-maincontent-messageblock-message-text-contact-info">
                <div class="downsection-maincontent-messageblock-message-text-contact-info-person" >{{message.senderName}}</div>
                <div class="downsection-maincontent-messageblock-message-text-contact-info-message" v-text="message.text"></div>
              </div>
              <div class="downsection-maincontent-messageblock-message-text-contact-time" v-text="message.time"></div>
            </div>
          </div>
        </div>









          <div class="downsection-maincontent-writeblock">
            <div class="downsection-maincontent-writeblock-block">
              <div class="downsection-maincontent-writeblock-block-icon">
                <div class="downsection-maincontent-writeblock-block-icon-img"></div>
              </div>
              <div class="downsection-maincontent-writeblock-block-keyboard">
                <div class="downsection-maincontent-writeblock-block-keyboard-write">
                  <textarea class="downsection-maincontent-writeblock-block-keyboard-write-input"
                            placeholder="Write a message..." v-model="messageText" @keypress="addMessageEnter"></textarea>
                  <div class="downsection-maincontent-writeblock-block-keyboard-write-smile">
                    <img src="../assets/smile.svg" style="width: 20px; height: 20px">
                  </div>
                </div>
                <div class="downsection-maincontent-writeblock-block-keyboard-buttons">
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-icon">
                    <img src="../assets/page-with-one-curled-corner.svg" style="width: 20px; height: 20px">
                  </div>
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-icon">
                    <img src="../assets/photo-camera.svg" style="width: 20px; height: 20px">
                  </div>
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-icon">
                    <img src="../assets/microphone-of-voice.svg" style="width: 20px; height: 20px">
                  </div>
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-mems"></div>
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-send" @click="addMessage">send</div>
                </div>
              </div>
              <div class="downsection-maincontent-writeblock-block-icon">
                <div class="downsection-maincontent-writeblock-block-icon-img">

                </div>
              </div>
            </div>
          </div>

      </div>


    </div>



  </div>


</template>

<script>
  import axios from 'axios'

export default {
  name: 'Contact',
  props: [],
  data () {
    return {
      msg: 'Good Luck',
      text: "Telegram clone",
      messages: [],
      messageText: ""
    }
  },
  mounted() {
    console.log("Route");
    console.log(this.$route.params.chatID);
    //console.log(this.$store.state.words[$route.params.userID]);
    this.myself = this.$store.getters.getUser;
    console.log(this.messages);

  },
  watch: {
    '$route.params.chatID': function (newVal) {
      this.messages = this.$store.getters.getMessages(newVal);
    },
    msg: function (val, oldval) {

    },
    "$store.state.messages": function (newVal) {
      this.messages = this.$store.getters.getMessages(this.$route.params.chatID);
    },
  },
  created() {
    Event.$on("name", function () {
      console.log("EVENT");
    });
  },
  methods: {
    addMessageEnter(event) {
      if (event.code === "Enter") {
        this.addMessage();
        event.preventDefault();
      }
    },
    addMessage() {
      if (this.messageText) {
//        let payload = {
//          number: this.$route.params.userID,
//          obj: {name: "Nick", text: this.messageText, time: "12 Oct"}
//        };
//        this.$store.commit("arrayPush", payload);
        console.log(this.$route.params.chatID);


        this.$store.dispatch('setMessage',
          { messageID: 33,
            roomID: this.$route.params.chatID,
            senderID: this.myself.accountID,
            text: this.messageText,
            time: "12/07/17",
            senderName: this.myself.name});

        this.messageText = "";
      }
    }
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
