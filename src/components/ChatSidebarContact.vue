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
                <!-- ---v-for="(message, index) in messages"---v-html="message.text"---- v-text="message.time"--- -->
                <div class="downsection-maincontent-messageblock-message-text-contact-icon">
                  <div class="downsection-maincontent-messageblock-message-text-contact-icon-circle"></div>
                </div>
                <div class="downsection-maincontent-messageblock-message-text-contact-info">
                  <div class="downsection-maincontent-messageblock-message-text-contact-info-person" >{{message.senderName}}</div>
                  <!--<div class="downsection-maincontent-messageblock-message-text-contact-info-message"     v-html="message.text">-->
                    <template v-if="message.type == 'Text'">
                      <div class="downsection-maincontent-messageblock-message-text-contact-info-message"     v-html="message.text"></div>
                    </template>
                    <template v-if="message.type === 'Audio'">
                      <audio-file :audioWay=message.src />
                    </template>

                    <!--<div class="audioMessage">-->
                      <!--<div class="audioMessage-button">-->
                        <!--<img class="audioMessage-button-img" src="../assets/play-button.svg" style="display: block"/>-->
                        <!--<img class="audioMessage-button-img" src="../assets/pause-button.svg" style="display: none"/>-->
                      <!--</div>-->
                      <!--<div class="audioMessage-block">-->
                        <!--<div class="audioMessage-block-up">-->
                          <!--<div class="audioMessage-block-up-text">Голосовое сообщение</div>-->
                          <!--<div class="audioMessage-block-up-time">00 : 00</div>-->
                        <!--</div>-->
                        <!--<div class="audioMessage-block-down">-->
                          <!--<div class="audioMessage-block-down-road" name="../static/media/539387.wav"></div>-->
                        <!--</div>-->
                      <!--</div>-->
                    <!--</div>-->

                  <!--</div>-->
                </div>
                <div class="downsection-maincontent-messageblock-message-text-contact-time"     v-text="message.time"></div>
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
                  <!--<input class="downsection-maincontent-writeblock-block-keyboard-write-input"-->
                            <!--placeholder="Write a message..." v-model="messageText" @keypress="addMessageEnter">-->
                  <!--<div id="test" class="downsection-maincontent-writeblock-block-keyboard-write-input"-->
                       <!--contentEditable="true" hidefocus="true"-->

                       <!--placeholder="Write a message..." style="text-align: left;  border: 1px solid black;" ref="myinput"-->
                       <!--v-html="html" >-->

                  <!--</div>-->
                  <div style="width: 100%; min-height: 70px; text-align: left;" v-show="textWriting">
                    <textarea id="textarea" ></textarea>
                  </div>

                  <div style="width: 100%; height: 70px; text-align: center; box-sizing: border-box" v-show="!textWriting">
                    <div style="width: 100%; display: flex; justify-content: center; margin: 10px 0">
                      <div id="timer" style="font-weight: 700; font-size: 18px"></div>
                    </div>
                    <h4 style="color: red; margin: 0">Идет запись вашего голоса</h4>
                  </div>


                </div>
                <div class="downsection-maincontent-writeblock-block-keyboard-buttons">
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-icon">
                    <img src="../assets/page-with-one-curled-corner.svg" style="width: 20px; height: 20px">
                  </div>
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-icon">
                    <img src="../assets/photo-camera.svg" style="width: 20px; height: 20px">
                  </div>
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-icon"  style="cursor: pointer">
                    <!--<div id="record" onmousedown="toggleRecording(this)" onmouseup="toggleRecording(this)">-->
                      <img id="record" src="../assets/microphone-of-voice.svg" style="width: 20px; height: 20px"
                           onmousedown="toggleRecording(this)" onmouseup="toggleRecording(this)"
                           @mousedown="timer(); textWriting=false" @mouseup="clearTimer(); textWriting=true">
                    <!--</div>-->
                  </div>
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-mems"></div>
                  <div class="downsection-maincontent-writeblock-block-keyboard-buttons-send" @click="testMethod">send</div>
                </div>
              </div>
              <div class="downsection-maincontent-writeblock-block-icon">
                <div class="downsection-maincontent-writeblock-block-icon-img">

                </div>
              </div>
            </div>
          </div>

        <audio-file audioWay="../../static/media/kissvk.com-Green%20Day-Boulevard%20of%20Broken%20Dreams-Acoustic-.mp3"></audio-file>

      </div>

    </div>

    <div id="test">
      qwerty
    </div>

    <router-link :to="{ name: 'AudioFile', params: { audioID: 123 }}">User</router-link>
    <router-view name="AudioFile"></router-view>

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
      soundTracks: []
    }
  },
  components: {
    AudioFile
  },
  mounted() {
    this.myself = this.$store.getters.getUser;
    this.messages = this.$store.getters.getMessages(this.$route.params.roomID);
    this.senderUser = this.$store.getters.getSenderUser(this.$route.params.roomID);

    const vm = this;

    document.getElementById("test").innerHTML = "<audio-file audioID=\"7\" audioWay=\"../../static/media/kissvk.com-Green%20Day-Boulevard%20of%20Broken%20Dreams-Acoustic-.mp3\"></audio-file>\n";
    console.log(document.getElementById("test").innerHTML);

    this.$options.sockets.setMessageSocket = (data) => {
      console.log(data);
      //this.messages.push(data);
      //setTimeout(() => this.secondAudioPlayer(), 1000);
    };

    //emoji Area
    $("#textarea").emojioneArea();

    //Voice recorder
    Recorder.setupDownload = (blob, filename) => {
      console.log("FUCK", blob);

      let message = {
        messageID: 33,
        roomID: this.$route.params.roomID,
        senderID: this.myself.userID,
        time: "12/07/17",
        senderName: this.myself.userID
      };

      this.$socket.emit("audioFile-ChatSidebarContact.vue-Server", blob, message);

//        let data = new FormData();
//        data.append("audiofile", blob);
//        axios.post("http://localhost:3000/post/audio", data)
//          .then(res => console.log(res))
//          .catch(err => console.log(err));

      //this.$socket.emit("jupiter", data);
      //this.$socket.emit("venera", data);
    };
  },
  watch: {
    '$route.params.roomID': function (newVal) {
      console.log("ROUTE");
      this.messages = this.$store.getters.getMessages(newVal);
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
            senderID: this.myself.userID,
            text: emoji[0].innerHTML,
            time: "12/07/17",
            senderName: this.myself.userID
          }
        );
        emoji[0].innerHTML = "";
      }
    },
    testMethod() {
      this.$socket.emit('setMessage-ChatSidebarContact.vue-Server',
        { messageID: 33,
          roomID: this.$route.params.roomID,
          senderID: this.myself.userID,
          text: "<div class=\"audioMessage\">\n" +
          "                      <div class=\"audioMessage-button\">\n" +
          "                        <img class=\"audioMessage-button-img\" src=\"src/assets/play-button.svg\" style=\"display: block\"/>\n" +
          "                        <img class=\"audioMessage-button-img\" src=\"src/assets/pause-button.svg\" style=\"display: none\"/>\n" +
          "                      </div>\n" +
          "                      <div class=\"audioMessage-block\">\n" +
          "                        <div class=\"audioMessage-block-up\">\n" +
          "                          <div class=\"audioMessage-block-up-text\">Голосовое сообщение</div>\n" +
          "                          <div class=\"audioMessage-block-up-time\">00 : 00</div>\n" +
          "                        </div>\n" +
          "                        <div class=\"audioMessage-block-down\">\n" +
          "                          <div class=\"audioMessage-block-down-road\" name=\"../static/media/539387.wav\"></div>\n" +
          "                        </div>\n" +
          "                      </div>\n" +
          "                    </div>",
          time: "12/07/17",
          senderName: this.myself.userID
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
