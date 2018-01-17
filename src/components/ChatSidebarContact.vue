<template>

  <div class="downsection-maincontent">

    <div class="downsection-maincontent-messageblock">

      <div class="downsection-maincontent-messageblock-bottom">

          <div id="mems2" style="height: calc(100% - 160px); overflow-y: scroll; position: relative; display: flex; align-items: flex-end">
            <div style="position: absolute; bottom: 0; width: 100%" ref="allMessages">
                  <div class="downsection-maincontent-messageblock-message"    v-for="(message, messageIndex) in messages">
                    <div class="downsection-maincontent-messageblock-message-check">
                      <img src="../assets/tick.svg" style="width: 26px; height: 26px" class="downsection-maincontent-messageblock-message-check-icon">
                    </div>
                    <div class="downsection-maincontent-messageblock-message-text">
                      <div class="downsection-maincontent-messageblock-message-text-contact">
                        <div class="downsection-maincontent-messageblock-message-text-contact-icon">
                          <div class="downsection-maincontent-messageblock-message-text-contact-icon-circle"
                               :style="{ 'background-image': 'url(' + message.profile.avatar + ')' }"></div>
                        </div>
                        <div class="downsection-maincontent-messageblock-message-text-contact-info">
                          <div class="downsection-maincontent-messageblock-message-text-contact-info-person" >{{message.profile.firstName}}</div>
                            <div v-for="(text, textIndex) in message.messageArray" style="position: relative">
                              <template v-if="text.type == 'Text'">
                                <div class="downsection-maincontent-messageblock-message-text-contact-info-message"
                                     v-html="text.text" @click="testMethod(messageIndex, textIndex)">
                                </div>
                              </template>
                              <template v-if="text.type == 'Audio'">
                                <audio-file :audioWay=text.src />
                              </template>
                              <template v-if="text.type == 'Image'">
                                <img :src=text.src style="width: 300px"/>
                              </template>

                              <div class="downsection-maincontent-messageblock-message-text-contact-time"
                                   v-text="computedTime(message.messageArray[0].time, textIndex)">
                              </div>

                            </div>
                        </div>
                        <div class="downsection-maincontent-messageblock-message-text-contact-time"
                             v-text="computedTime(message.messageArray[0].time)">
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
          </div>



          <div class="writeblock">
            <div class="writeblock-block">
              <div class="writeblock-block-icon">
                <div class="writeblock-block-icon-img" :style="{ 'background-image': 'url(' + myself.avatar + ')' }"></div>
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
                     <img src="../assets/page-with-one-curled-corner.svg" style="width: 20px; height: 20px;">
                  </div>
                  <div class="writeblock-block-keyboard-buttons-icon">
                    <input id="imageMessage" type="file" @change="sendImage" style="display: none">
                    <label tabindex="0" for="imageMessage" >
                      <img src="../assets/photo-camera.svg" style="width: 20px; height: 20px; cursor: pointer">
                    </label>
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
                <div class="writeblock-block-icon-img" :style="{ 'background-image': 'url(' + roomProfile.img + ')' }"></div>
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
    }
  },
  components: {
    AudioFile
  },
  created() {
    this.myself = this.$store.getters.getUser;
    this.messages = this.$store.getters.getMessages(this.$route.params.roomID);
    this.roomProfile = this.$store.getters.getRoomProfile(this.$route.params.roomID);
    console.log("this.roomProfile", this.roomProfile);

    const vm = this;
    Event.$on("Store-to-Contact-pushMessage", function () {
      console.log("ChatSidebarContact.vue pushMessage");
      vm.messages = vm.$store.getters.getMessages(vm.$route.params.roomID);
    });
  },
  mounted() {
    $("#textarea").emojioneArea();
    Recorder.setupDownload = (blob, filename) => {
      let random = Math.floor(Math.random() * 1000000)
      let audioData = {
        name: random
      };
      let audioMessage = {
        type: "Audio",
        roomID: this.$route.params.roomID,
        profileID: this.myself._id,
        time: new Date().getTime()
      };
      this.$socket.emit("File-ChatSidebarContact.vue-Server", blob, audioMessage, audioData);
//        let data = new FormData();
//        data.append("audiofile", blob);
//        axios.post("http://localhost:3000/post/audio", data)
//          .then(res => console.log(res))
//          .catch(err => console.log(err));
    };
  },
  watch: {
    '$route.params.roomID': function (newVal) {
      this.messages = [];
      setTimeout(() => this.messages = this.$store.getters.getMessages(newVal), 0);
      this.roomProfile = this.$store.getters.getRoomProfile(this.$route.params.roomID);
      console.log("this.roomProfile", this.roomProfile);
    },
    "$store.state.allMessageArray": function (newVal) {
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
    computedTime(time, index) {
      if (!index && index == 0) {
        return null;
      }
      let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jule", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return  new Date(time * 1000 / 1000).getDate() + " " + months[new Date(time * 1000 / 1000).getMonth()];
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
      if (emoji[0].innerHTML) {
        let message = {
          type: "Text",
          text: emoji[0].innerHTML,
          roomID: this.$route.params.roomID,
          profileID: this.myself._id,
          time: new Date().getTime()
        };
        this.$socket.emit('setMessage-ChatSidebarContact.vue-Server', message);
        console.log("this.roomProfile.index !== 1", this.roomProfile.index !== 1);
        if (this.roomProfile.index !== 1) this.$socket.emit('indexRoom-ChatSidebarContact.vue-Server', this.myself._id, this.roomProfile.roomID._id);
        emoji[0].innerHTML = "";
      }
    },
    testMethod(messageIndex, textIndex) {
      let icon = this.$refs.allMessages.children[messageIndex].children[1].children[0].children[0];
      let name = this.$refs.allMessages.children[messageIndex].children[1].children[0].children[1].children[0];
      let message = this.$refs.allMessages.children[messageIndex].children[1].children[0].children[1].children[textIndex + 1];

      let color = "#819ca9";
      if (message.style.backgroundColor == "rgb(129, 156, 169)") color = "white";

      if (textIndex > 0) {
        message.style.backgroundColor = color;
      } else {
        icon.style.backgroundColor = color;
        name.style.backgroundColor = color;
        message.style.backgroundColor = color;
      }
    },
    sendImage(event) {
      this.someData = event.target.files[0];
      console.log(this.someData);

      let imgData = {
        name: this.someData.name,
        size: this.someData.size,
        type: this.someData.type
      };

      let imgMessage = {
        type: "Image",
        roomID: this.$route.params.roomID,
        profileID: this.myself._id,
        time: new Date().getTime()
      };

      console.log(imgData);
      this.$socket.emit("File-ChatSidebarContact.vue-Server", event.target.files[0], imgMessage, imgData);
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
