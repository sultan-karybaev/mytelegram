<template>

  <div class="downsection-maincontent">

    <div class="downsection-maincontent-messageblock">

      <div class="downsection-maincontent-messageblock-bottom">

          <div id="mems2">
            <div class="downsection-maincontent-messageblock-message"    v-for="(message, index) in messages">
              <div class="downsection-maincontent-messageblock-message-check">
                <img src="../assets/tick.svg" style="width: 26px; height: 26px" class="downsection-maincontent-messageblock-message-check-icon">
              </div>
              <div class="downsection-maincontent-messageblock-message-text">
                <div class="downsection-maincontent-messageblock-message-text-contact">
                  <div class="downsection-maincontent-messageblock-message-text-contact-icon">
                    <div class="downsection-maincontent-messageblock-message-text-contact-icon-circle"></div>
                  </div>
                  <div class="downsection-maincontent-messageblock-message-text-contact-info">
                    <div class="downsection-maincontent-messageblock-message-text-contact-info-person" >{{message.senderName}}</div>
                      <div v-for="text in message.messageArray">
                        <template v-if="text.type == 'Text'">
                          <div class="downsection-maincontent-messageblock-message-text-contact-info-message"     v-html="text.text"></div>
                        </template>
                        <template v-if="text.type === 'Audio'">
                          <audio-file :audioWay=text.src />
                        </template>
                      </div>
                  </div>
                  <div class="downsection-maincontent-messageblock-message-text-contact-time"     v-text="message.time"></div>
                </div>
              </div>
            </div>
          </div>



          <div class="writeblock">
            <div class="writeblock-block">
              <div class="writeblock-block-icon">
                <div class="writeblock-block-icon-img"></div>
              </div>
              <div class="writeblock-block-keyboard">
                <div class="writeblock-block-keyboard-write">
                  <div class="writeblock-block-keyboard-write-emojiTextarea" v-show="textWriting">
                    <textarea id="textarea" ></textarea>
                  </div>
                  <div class="writeblock-block-keyboard-write-audio" v-show="!textWriting">
                    <div class="writeblock-block-keyboard-write-audio-timerBlock">
                      <div id="timer" class="writeblock-block-keyboard-write-audio-timerBlock-timer"></div>
                    </div>
                    <h4 class="writeblock-block-keyboard-write-audio-text">Идет запись вашего голоса</h4>
                  </div>
                </div>
                <div class="writeblock-block-keyboard-buttons">
                  <div class="writeblock-block-keyboard-buttons-icon">
                    <img src="../assets/page-with-one-curled-corner.svg" style="width: 20px; height: 20px">
                  </div>
                  <div class="writeblock-block-keyboard-buttons-icon">
                    <img src="../assets/photo-camera.svg" style="width: 20px; height: 20px">
                  </div>
                  <div class="writeblock-block-keyboard-buttons-icon"  style="cursor: pointer">
                      <img id="record" src="../assets/microphone-of-voice.svg" style="width: 20px; height: 20px"
                           onmousedown="toggleRecording(this)" onmouseup="toggleRecording(this)"
                           @mousedown="timer(); textWriting=false" @mouseup="clearTimer(); textWriting=true">
                  </div>
                  <div class="writeblock-block-keyboard-buttons-mems"></div>
                  <div class="writeblock-block-keyboard-buttons-send" @click="addMessage">send</div>
                </div>
              </div>
              <div class="writeblock-block-icon">
                <div class="writeblock-block-icon-img"></div>
              </div>
            </div>
          </div>


      </div>

    </div>

  </div>


</template>

<script>
  import axios from 'axios'
  import AudioFile from './AudioFile.vue'

export default {
  name: 'Contact',
  props: [],
  data () {
    return {
      messages: [],
      messageText: "",
      date: "",
      textWriting: true,
      testArray: []
    }
  },
  components: {
    AudioFile
  },
  created() {
    this.myself = this.$store.getters.getUser;
    this.messages = this.$store.getters.getMessages(this.$route.params.roomID);
//    this.senderUser = this.$store.getters.getSenderUser(this.$route.params.roomID);
    console.log(this.messages);
  },
  mounted() {
    $("#textarea").emojioneArea();
    Recorder.setupDownload = (blob, filename) => {
      let message = {
        messageID: 33,
        roomID: this.$route.params.roomID,
        //senderID: this.myself.userID,
        senderID: 3,
        time: "12/07/17",
        //senderName: this.myself.userID,
        senderName: "Elon",
        type: "Audio"
      };
      this.$socket.emit("audioFile-ChatSidebarContact.vue-Server", blob, message);
//        let data = new FormData();
//        data.append("audiofile", blob);
//        axios.post("http://localhost:3000/post/audio", data)
//          .then(res => console.log(res))
//          .catch(err => console.log(err));
    };
  },
  watch: {
    '$route.params.roomID': function (newVal) {
      console.log("ROUTE");
      this.messages = [];
      setTimeout(() => this.messages = this.$store.getters.getMessages(newVal), 0);
    },
    "$store.state.messages": function (newVal) {
      console.log("STORE");
      this.messages = this.$store.getters.getMessages(this.$route.params.roomID);
    },
  },
  methods: {
    timer() {
      console.log("TIMER");
      let countDownDate = new Date().getTime();
      this.interval = setInterval(function() {
        let now = new Date().getTime();
        let distance = now - countDownDate;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        document.getElementById("timer").innerHTML = minutes + " : " + seconds;
      });
    },
    clearTimer() {
      console.log("clearTimer");
      document.getElementById("timer").innerHTML = "";
      clearInterval(this.interval);
    },
    addMessageEnter(event) {
      console.log("ENTER");
      if (event.code === "Enter") {
        this.addMessage();
        event.preventDefault();
      }
    },
    addMessage() {
      const emoji = document.getElementsByClassName("emojionearea-editor");
      console.log(emoji[0].innerHTML);
      if (emoji[0].innerHTML) {
        this.$socket.emit('setMessage-ChatSidebarContact.vue-Server',
          { messageID: 33,
            roomID: this.$route.params.roomID,
            //senderID: this.myself.userID,
            senderID: 3,
            text: emoji[0].innerHTML,
            time: "12/07/17",
            //senderName: this.myself.userID,
            senderName: "Elon",
            type: "Text"
          }
        );
        emoji[0].innerHTML = "";
      }
    },
    testMethod() {
      console.log("testMethod");
      this.$socket.emit('setMessage-ChatSidebarContact.vue-Server',
        { messageID: 33,
          roomID: this.$route.params.roomID,
          senderID: this.myself.userID,
          src: "../../static/media/kissvk.com-The Script feat. will.i.am-Hall of Fame.mp3",
          time: "12/07/17",
          senderName: 1,
          type: "Audio"
        }
      );
    }
  },
}
</script>








<style >
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

/*#textarea{*/
  /*border: none;*/
  /*box-shadow: none;*/
/*}*/

/*.emojionearea{*/
  /*border: none;*/
  /*background: rgba(0, 0, 0, 0);*/
  /*outline: none;*/
  /*box-shadow: none;*/
/*}*/


/*.emojionearea .emojionearea-editor{*/
  /*width: 100%;*/
  /*min-height: 70px;*/
  /*max-height: none;*/
  /*!*border: 1px solid black;*!*/
  /*border-radius: 0;*/
  /*outline: none;*/
  /*border: none;*/
  /*box-shadow: none;*/
  /*background: rgba(0, 0, 0, 0);*/
/*}*/

  /*.emojioneemoji{*/
    /*width: 16px;*/
    /*height: 16px;*/
    /*vertical-align: middle;*/
  /*}*/

</style>
