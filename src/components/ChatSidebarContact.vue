<template>

  <div class="downsection-maincontent">

    <div class="downsection-maincontent-messageblock">

      <div class="downsection-maincontent-messageblock-bottom">

        <div id="mems2">
        <div class="downsection-maincontent-messageblock-message" v-for="(message, index) in messages">
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
                <div class="downsection-maincontent-messageblock-message-text-contact-info-message" v-html="message.text">
                </div>
              </div>
              <div class="downsection-maincontent-messageblock-message-text-contact-time" v-text="message.time"></div>
            </div>
          </div>
        </div>
        </div>



          <div id="mems" class="downsection-maincontent-writeblock">
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
  import MediaStreamRecorder from 'msr'
//  import {$,jQuery} from 'jquery'
//  import emojioneArea from 'emojionearea'

export default {
  name: 'Contact',
  props: [],
  data () {
    return {
      msg: 'Good Luck',
      text: "Telegram clone",
      messages: [],
      messageText: "",
      date: "",
      textWriting: true
    }
  },
  computed: {

  },
  mounted() {
    this.myself = this.$store.getters.getUser;

    let data = {
      roomID: this.$route.params.chatID,
      userID: this.myself.userID
    };

    this.$socket.emit("enterRoomServer", data);

    this.messages = this.$store.getters.getMessages(this.$route.params.chatID);
    this.senderUser = this.$store.getters.getSenderUser(this.$route.params.chatID);
    console.log(this.$route.params.chatID);
    console.log(this.senderUser);
    console.log("this.myself", this.myself);
    Event.$emit("headerSenderUserName", this.senderUser);

    $("#textarea").emojioneArea();

    ((window) => {

      var WORKER_PATH = 'src/js/recorderjs/recorderWorker.js';

      var Recorder = function(source, cfg){
        var config = cfg || {};
        var bufferLen = config.bufferLen || 4096;
        this.context = source.context;
        if(!this.context.createScriptProcessor){
          this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
        } else {
          this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
        }

        var worker = new Worker(config.workerPath || WORKER_PATH);
        worker.postMessage({
          command: 'init',
          config: {
            sampleRate: this.context.sampleRate
          }
        });
        var recording = false,
          currCallback;

        this.node.onaudioprocess = function(e){
          if (!recording) return;
          worker.postMessage({
            command: 'record',
            buffer: [
              e.inputBuffer.getChannelData(0),
              e.inputBuffer.getChannelData(1)
            ]
          });
        }

        this.configure = function(cfg){
          for (var prop in cfg){
            if (cfg.hasOwnProperty(prop)){
              config[prop] = cfg[prop];
            }
          }
        }

        this.record = function(){
          recording = true;
        }

        this.stop = function(){
          recording = false;
        }

        this.clear = function(){
          worker.postMessage({ command: 'clear' });
        }

        this.getBuffers = function(cb) {
          currCallback = cb || config.callback;
          worker.postMessage({ command: 'getBuffers' })
        }

        this.exportWAV = function(cb, type){
          currCallback = cb || config.callback;
          type = type || config.type || 'audio/wav';
          if (!currCallback) throw new Error('Callback not set');
          worker.postMessage({
            command: 'exportWAV',
            type: type
          });
        }

        this.exportMonoWAV = function(cb, type){
          currCallback = cb || config.callback;
          type = type || config.type || 'audio/wav';
          if (!currCallback) throw new Error('Callback not set');
          worker.postMessage({
            command: 'exportMonoWAV',
            type: type
          });
        }

        worker.onmessage = function(e){
          var blob = e.data;

          currCallback(blob);
        }

        source.connect(this.node);
        this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
      };

      Recorder.setupDownload = (blob, filename) => {

        console.log("FUCK", blob);
        console.log(this);

        console.log(URL.createObjectURL(blob));

        this.$socket.emit("jupiter", blob);

        console.log(blob.filename);

        let data = new FormData();
        data.append("audiofile", blob);
        data.append("sick", "qwerty");
        axios.post("http://localhost:3000/post/audio", data)
          .then(res => console.log(res))
          .catch(err => console.log(err));
        //this.$socket.emit("jupiter", data);
        //this.$socket.emit("venera", data);
      }

      window.Recorder = Recorder;

    })(window);
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
    timer() {
      console.log("TIMER");

      let countDownDate = new Date().getTime();
      this.x = setInterval(function() {
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
      clearInterval(this.x);
    },
    serverConnection() {

      console.log("serverConnection");

      axios.get("http://localhost:3000/mars")
        .then(res => console.log(res))
        .catch(err => console.log(err));
      axios.get("http://localhost:3001/showman")
        .then(res => console.log(res))
        .catch(err => console.log(err));
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
//        let payload = {
//          number: this.$route.params.userID,
//          obj: {name: "Nick", text: this.messageText, time: "12 Oct"}
//        };
//        this.$store.commit("arrayPush", payload);
        console.log(this.$route.params.chatID);

        this.$socket.emit('setMessage-ChatSidebarContact.vue-Server',
          { messageID: 33,
            roomID: this.$route.params.chatID,
            senderID: this.myself.userID,
            text: emoji[0].innerHTML,
            time: "12/07/17",
            senderName: this.myself.userID}
        );

//        this.$store.dispatch('setMessage',
//          { messageID: 33,
//            roomID: this.$route.params.chatID,
//            senderID: this.myself.accountID,
//            text: this.messageText,
//            time: "12/07/17",
//            senderName: this.myself.name});

//        Event.$emit("newLastMessage",
//          { messageID: 33,
//            roomID: this.$route.params.chatID,
//            senderID: this.myself.accountID,
//            text: this.messageText,
//            time: "12/07/17",
//            senderName: this.myself.name});



        emoji[0].innerHTML = "";
      }
    },
    testMessage() {
//      this.messages.push({ messageID: 33,
//        roomID: this.$route.params.chatID,
//        senderID: this.myself.accountID,
//        text: "jfejfewjfbewjkbf" + "<span class='em em-a' title='confused'>:confused:</span>",
//        time: "12/07/17",
//        senderName: this.myself.name});

     // let sas = document.getElementById("mems").children[3].innerHTML;
      let test = document.getElementById("test");

      test.addEventListener("focus", function (e) {
        console.log(e);
      });
      test.addEventListener("keypress", function (e) {
        console.log(e);
      });

//      test.addEventListener("blur", function (e) {
//        console.log(e);
//      });

      test.focus();

      console.log("SAS");
      let ch = document.createElement("i");
      ch.setAttribute("class", "em em-cry");
      ch.setAttribute("style", "width: 20px; height: 20px; border: 0 solid black; vertical-align: middle");
      ch.setAttribute("display", "block");
      ch.setAttribute("contentEditable", "false");
      ch.setAttribute("hidefocus", "true");

      console.log(this.htmlmodel);

      function f1(el) {
        var val = el.value;
        console.log(val);
        alert(val.slice(0, el.selectionStart).length);
      }


      document.getElementById("img").focus();

      let img = document.createElement("img");
      img.setAttribute("src", "/static/imgs/logo.png");
      img.setAttribute("style", "width: 20px; height: 20px; border: 0 solid black; vertical-align: middle");

      //console.log(ch);
      //test.appendChild(ch);
      this.html = test.innerHTML +  "<i class=\"em em-a\" contentEditable=\"false\" hidefocus=\"true\"></i>";
      console.log(test);
      console.log(test.innerHTML);
      //console.log(document.getElementById("mems").children[0].children[1].children[0].children[0].nodeValue);
    }
  }
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

#textarea{
  border: none;
  box-shadow: none;
}

.emojionearea{
  border: none;
  background: rgba(0, 0, 0, 0);
  outline: none;
  box-shadow: none;
}


.emojionearea .emojionearea-editor{
  width: 100%;
  min-height: 70px;
  max-height: none;
  /*border: 1px solid black;*/
  border-radius: 0;
  outline: none;
  border: none;
  box-shadow: none;
  background: rgba(0, 0, 0, 0);
}

  .emojioneemoji{
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }

</style>
