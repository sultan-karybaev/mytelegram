<template>



    <div class="downsection-maincontent">

      <div class="downsection-maincontent-messageblock">


        <div class="downsection-maincontent-messageblock-message" v-for="message in messages">
          <div class="downsection-maincontent-messageblock-message-check">
            <img src="../assets/tick.svg" style="width: 26px; height: 26px" class="downsection-maincontent-messageblock-message-check-icon">
          </div>
          <div class="downsection-maincontent-messageblock-message-text">
            <div class="downsection-maincontent-messageblock-message-text-contact">
              <!-- ------------- -->
              <div class="downsection-sidebar-contact-icon">
                <div class="downsection-sidebar-contact-icon-circle"></div>
              </div>
              <div class="downsection-sidebar-contact-info">
                <div class="downsection-sidebar-contact-info-person" v-text="message.name"></div>
                <div class="downsection-sidebar-contact-info-message" v-text="message.text"></div>
              </div>
              <div class="downsection-sidebar-contact-time" v-text="message.time"></div>
            </div>
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
                <input class="downsection-maincontent-writeblock-block-keyboard-write-input"
                    placeholder="Write a message..." v-model="messageText"/>
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
                <div class="downsection-maincontent-writeblock-block-keyboard-buttons-send" @click="addMessage">Send</div>
              </div>
            </div>
            <div class="downsection-maincontent-writeblock-block-icon">
              <div class="downsection-maincontent-writeblock-block-icon-img">

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
  data () {
    return {
      msg: 'Good Luck',
      text: "Telegram clone",
      messages: [{name: "Nick", text: "Hey, how are you?", time: "12 Oct"}, {name: "John", text: "I'm fine, thanks", time: "12 Oct"},
        {name: "Nick", text: "Hey, how are you?", time: "12 Oct"}, {name: "John", text: "I'm fine, thanks", time: "12 Oct"},
        {name: "Nick", text: "Hey, how are you?", time: "12 Oct"}, {name: "John", text: "I'm fine, thanks", time: "12 Oct"},
        {name: "Nick", text: "Hey, how are you?", time: "12 Oct"}, {name: "John", text: "I'm fine, thanks", time: "12 Oct"},
      ],
      messageText: ""
    }
  },
  methods: {
    addMessage() {
      if (this.messageText) {
        this.messages.push({name: "Nick", text: this.messageText, time: "12 Oct"});
        this.messageText = "";
      }
    }
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
