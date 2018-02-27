<template>

  <div class="downsection-maincontent">

    <div class="downsection-maincontent-messageblock">

          <div class="messageblock" ref="scrollTest1" style="position: relative;
    display: flex;
    overflow-y: auto;
    flex-direction: column-reverse;">
            <div ref="allMessages" style="    flex: 0 0 auto
">
                  <div   style="width: 100%"  v-for="(message, messageIndex) in messages">

                    <!--todo style-->
                    <template v-if="message.messageType == 'Time'">
                      <div style="width: 100%; display: flex; justify-content: center; margin: 5px 0;">
                        <div style="background-color: #7594e3; padding: 5px; border-radius: 5px; color: white">{{message.messageTime}}</div>
                      </div>
                    </template>

                    <template v-else v-if="message.messageType == 'System'">
                      <div style="width: 100%; text-align: center; font-size: 12px; margin: 10px 0;">
                        <span style="cursor: pointer; color: rebeccapurple; font-weight: 700" @click="getContactInfo(message.profile._id)">
                          {{message.profile.firstName}} {{message.profile.lastName}}
                        </span>
                        {{message.messageArray[0].text}}
                        <template v-if="message.messageArray[0].secondPerson">
                          <span style="cursor: pointer; color: brown; font-weight: 700" @click="getContactInfo(message.messageArray[0].secondPerson._id)">
                            {{message.messageArray[0].secondPerson.firstName}} {{message.messageArray[0].secondPerson.lastName}}
                          </span>
                        </template>
                      </div>
                    </template>

                    <template v-else>

                      <div class="message" v-for="(text, textIndex) in message.messageArray"  @click="accentMessage(messageIndex, textIndex)">
                        <div class="message-check">
                          <img src="../assets/tick.svg" class="message-check-icon">
                        </div>

                        <template v-if="textIndex == 0">
                          <div class="message-text">
                            <div class="message-text-contact">
                              <div class="message-text-contact-icon">
                                <div class="message-text-contact-icon-circle" :style="{ 'background-image': 'url(' + message.profile.avatar + ')' }"></div>
                              </div>
                              <div class="message-text-contact-info">
                                <div class="message-text-contact-info-person" >{{message.profile.firstName}}</div>
                                  <!--<div v-for="(text, textIndex) in message.messageArray" style="position: relative">-->
                                    <template v-if="text.type == 'Text'">
                                      <div class="message-text-contact-info-message">
                                        <div v-html="text.text" >
                                          <!--style="display: inline; padding: 3px; background-color: #3631b9; border-radius: 3px; color: white"-->
                                        </div>
                                      </div>
                                    </template>
                                    <template v-if="text.type == 'Audio'">
                                      <div @click="accentMessageBoolean = false">
                                        <audio-file :audioWay=text.src />
                                      </div>
                                    </template>
                                    <template v-if="text.type == 'Image'">
                                      <img :src=text.src style="width: 300px" @click="accentMessageBoolean = false"/>
                                    </template>

                                  <!--</div>-->
                              </div>
                              <div class="message-text-contact-time"
                                   v-text="computedTime(text.time)">
                              </div>
                            </div>
                          </div>
                        </template>

                        <template v-else>
                          <div style="width: 80%; height: 100%; display: flex">
                            <div style="width: 20%"></div>

                            <div style="width: 80%; height: 100%; position: relative;">
                              <template v-if="text.type == 'Text'">
                                <div class="message-text-contact-info-message" >
                                  <div v-html="text.text">
                                    <!--style="display: inline; padding: 3px; background-color: #3631b9; border-radius: 3px; color: white"-->
                                  </div>
                                </div>
                              </template>
                              <template v-if="text.type == 'Audio'">
                                <div @click="accentMessageBoolean = false">
                                  <audio-file :audioWay=text.src />
                                </div>
                              </template>
                              <template v-if="text.type == 'Image'">
                                <img :src=text.src style="width: 300px" @click="accentMessageBoolean = false"/>
                              </template>
                              <div class="message-text-contact-time"  v-text="computedTime(text.time)"></div>
                            </div>

                          </div>
                        </template>


                      </div>
                    </template>



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
      accentMessageBoolean: true,
      roomProfile: {},
    }
  },
  components: {
    AudioFile
  },
  created() {
    this.myself = this.$store.getters.getUser;
    this.messages = this.$store.getters.getMessages(this.$route.params.roomID);
    this.roomProfile = this.$store.getters.getRoomProfile(this.$route.params.roomID);
//    this.test = this.$store.getters.getMessegesTest;
//    console.log("this.$route.params.roomID", this.$route.params.roomID)
//    console.log("this.messages", this.messages);
//    console.log("this.test", this.test);

    const vm = this;
    Event.$on("Store-to-Contact-pushMessage", function () {
      console.log("ChatSidebarContact.vue pushMessage");
      vm.messages = vm.$store.getters.getMessages(vm.$route.params.roomID);
    });
  },
  mounted() {
//    console.log("this.$refs.allMessages.scrollHeight", this.$refs.allMessages.scrollHeight)
//    setTimeout(() => this.$refs.scrollTest1.scrollTop = this.$refs.allMessages.scrollHeight, 200);

    const vm = this;
    $("#textarea").emojioneArea();
    setTimeout(function () {
      $(".emojionearea-editor").keypress(function (e) {
        if (e.charCode == 13) {
          vm.addMessage();
          e.preventDefault();
//          setTimeout(function () {
//            vm.$refs.scrollTest1.scrollTop = vm.$refs.allMessages.scrollHeight;
//          }, 300);
        }
      });
    }, 500);
    Recorder.setupDownload = (blob, filename) => {
      if (this.roomProfile.member) {
        let random = Math.floor(Math.random() * 1000000);
        let audioData = {
          name: random
        };
        let audioMessage = {
          type: "Audio",
          text: "Audio File",
          roomID: this.$route.params.roomID,
          profileID: this.myself._id,
          time: new Date().getTime()
        };
        this.$socket.emit("File-ChatSidebarContact.vue-Server", blob, audioMessage, audioData, this.roomProfile.roomID);
      }
    };
  },
  watch: {
    '$route.params.roomID': function (newVal) {
      this.messages = [];
      setTimeout(() => this.messages = this.$store.getters.getMessages(newVal), 0);
      setTimeout(() => this.$refs.scrollTest1.scrollTop = this.$refs.allMessages.offsetHeight, 0);
      this.roomProfile = this.$store.getters.getRoomProfile(this.$route.params.roomID);
    },
    "$store.state.roomProfiles": function (newVal) {
      this.roomProfile = this.$store.getters.getRoomProfile(this.$route.params.roomID);
    },
    "$store.state.allMessageArray": function (newVal) {
      console.log("$store.state.allMessageArray");
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
    computedTime(time) {
      let hours = new Date(time * 2 / 2).getHours();
      let minutes = new Date(time * 2 / 2).getMinutes();
      let seconds = new Date(time * 2 / 2).getSeconds();
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      return  hours + ":" + minutes + ":" + seconds;
    },
    addMessageEnter(event) {
      console.log("ENTER");
      if (event.code === "Enter") {
        this.addMessage();
        event.preventDefault();
      }
    },
    addMessage() {
      const vm = this;
      if (this.roomProfile.member) {
        const emoji = document.getElementsByClassName("emojionearea-editor");
        let s = emoji[0].innerHTML
        //emoji[0].innerHTML
        if (s) {
//          let d = emoji[0].innerHTML;
//          Notification.requestPermission(function(permission){
//            if (permission = "granted") {
//              new Notification(vm.myself.firstName + " " + vm.myself.lastName, {
//                tag : "ache-mail",
//                body : d,
//                icon : vm.myself.avatar
//              });
//            }
//          });

          let message = {
            type: "Text",
            text: s,
            roomID: this.$route.params.roomID,
            profileID: this.myself._id,
            time: new Date().getTime()
          };
          this.$socket.emit('setMessage-ChatSidebarContact.vue-Server', message,  this.roomProfile.roomID);
          emoji[0].innerHTML = "";
        }
      }
    },
    accentMessage(messageIndex, textIndex) {
      console.log(this.accentMessageBoolean);
      if (this.accentMessageBoolean) {
        let message = this.$refs.allMessages.children[messageIndex].children[textIndex];
        let color = "rgba(129, 156, 169, .5)";
        if (message.style.background == "rgba(129, 156, 169, 0.5)") color = "";
        message.style.background = color;
      }
      this.accentMessageBoolean = true;
    },
    sendImage(event) {
      if (this.roomProfile.member) {
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
          text: "Image",
          profileID: this.myself._id,
          time: new Date().getTime()
        };

        console.log(imgData);
        this.$socket.emit("File-ChatSidebarContact.vue-Server", event.target.files[0], imgMessage, imgData, this.roomProfile.roomID);
      }
    },
    getContactInfo(profileID) {
      Event.$emit("From-Contact-To-Chat", profileID);
    },

    scr() {
      //console.log(this.$refs.scrollTest1.scrollTop)
//      this.$refs.scrollTest1.scrollTop
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

</style>
