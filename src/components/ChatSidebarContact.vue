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
                <div class="downsection-maincontent-writeblock-block-keyboard-write" style="border: 1px solid black;">
                  <!--<input class="downsection-maincontent-writeblock-block-keyboard-write-input"-->
                            <!--placeholder="Write a message..." v-model="messageText" @keypress="addMessageEnter">-->
                  <!--<div id="test" class="downsection-maincontent-writeblock-block-keyboard-write-input"-->
                       <!--contentEditable="true" hidefocus="true"-->

                       <!--placeholder="Write a message..." style="text-align: left;  border: 1px solid black;" ref="myinput"-->
                       <!--v-html="html" >-->

                  <!--</div>-->

                  <textarea id="textarea"></textarea>


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

      <div style="background-color: rebeccapurple; width: 10px; height: 10px"></div>
      <span class="em em-a"></span>
      <i class="em em-a"></i>

    </div>



  </div>


</template>

<script>
  import axios from 'axios'
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
      html: "vlnsejvereherhreh<i class=\"em em-a\"></i>fpjweiofojwoifwof ejv ewv ev wev wfoewh weu\n" +
      "<img id='img' src=\"/static/imgs/logo.png\" style=\"width: 20px; height: 20px; border: 0 solid black; vertical-align: middle\"/>",

    }
  },
  mounted() {
//    console.log("Route");
//    console.log(this.$route.params.chatID);
    //console.log(this.$store.state.words[$route.params.userID]);
    this.myself = this.$store.getters.getUser;
    this.messages = this.$store.getters.getMessages(this.$route.params.chatID);
    this.senderUser = this.$store.getters.getSenderUser(this.$route.params.chatID);
    console.log(this.senderUser);
    Event.$emit("headerSenderUserName", this.senderUser);
    //let t = document.getElementById("test").innerHTML;
    //console.log(t);

    $("#textarea").emojioneArea();

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

      const emoji = document.getElementsByClassName("emojionearea-editor");
      console.log(emoji[0].innerHTML);

      if (emoji[0].innerHTML) {
//        let payload = {
//          number: this.$route.params.userID,
//          obj: {name: "Nick", text: this.messageText, time: "12 Oct"}
//        };
//        this.$store.commit("arrayPush", payload);
        console.log(this.$route.params.chatID);

        this.$socket.emit('setMessageServer',
          { messageID: 33,
            roomID: this.$route.params.chatID,
            senderID: this.myself.accountID,
            text: emoji[0].innerHTML,
            time: "12/07/17",
            senderName: this.myself.name}
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

.emojionearea .emojionearea-editor{
  width: 100%;
  min-height: 35px;
  max-height: none;
  border: 1px solid black;
  border-radius: 0;
}

  .emojioneemoji{
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }

</style>
