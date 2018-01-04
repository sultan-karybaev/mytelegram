<template>
  <div id="app" style="text-align: left">

    <!--<script src="https://cdn.WebRTC-Experiment.com/MediaStreamRecorder.js"></script>-->


      <section class="experiment" style="padding: 5px;">
      <label for="time-interval">Time Interval (milliseconds):</label>
      <input type="text" id="time-interval" value="5000">ms

      <br>
      <br> recorderType:

      <select id="audio-recorderType" style="font-size:22px;vertical-align: middle;margin-right: 5px;">
        <option>[Best Available Recorder]</option>
        <option>MediaRecorder API</option>
        <option>WebAudio API (WAV)</option>
        <option>WebAudio API (PCM)</option>
      </select>
      <br>

      <br>
      <br>

      <button id="start-recording" >Start</button>
      <!--<button id="stop-recording" disabled>Stop</button>-->

      <!--<button id="pause-recording" disabled>Pause</button>-->
      <!--<button id="resume-recording" disabled>Resume</button>-->

      <button id="save-recording" disabled>Save</button>
    </section>

    <audio controls >
      Тег audio не поддерживается вашим браузером.
      <a href="audio/319e3c14a2868c5c647157dddbe1b6d1.webm">Скачайте музыку</a>.
    </audio>

    <video controls autoplay name="media">
      <source src="audio/319e3c14a2868c5c647157dddbe1b6d1.webm" type="audio/webm"/>
    </video>

    <section class="experiment">
      <div id="audios-container"></div>
    </section>



    <!--<h2>Plain Vue binding</h2>-->
    <!--<div style="width: 1200px; height: 100px; background-color: #42b983; overflow-y: hidden; overflow-x: hidden">-->
    <!--<textarea id="emo" v-model="message2" style="height: 30px"></textarea>-->
    <!--</div>-->
    <!--<p>{{ message2 }}</p>-->
    <!--<button id="btn" @click="cl">Button</button>-->

    <!--<img src="./assets/logo.png">-->

    <!--<h1>Venera</h1>-->

    <!--<router-link to="/chat">link</router-link>-->

    <router-view></router-view>

    <!--<chat></chat>-->

  </div>
</template>


<script>
  import chat from './components/Chat.vue'
  import map from './components/Map.vue'
  import 'msr'
  var MediaStreamRecorder = require('msr');
  import axios from 'axios'


//  document.getElementById("btn").addEventListener("click", function () {
//    console.log("Button");
//    console.log(document.getElementById("emo").value);
//    console.log(document.getElementsByClassName("emojionearea"));
//  });


export default
{
  name: 'app',
  data() {
    return {
      message2: "22222"
    }
  },
  methods: {
    startAudio() {
      document.querySelector('#start-recording').onclick = function() {
        //this.disabled = true;
        captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
      };
    },
    stopAudio() {
      document.querySelector('#stop-recording').onclick = function() {
        this.disabled = true;
        mediaRecorder.stop();
        mediaRecorder.stream.stop();
//        document.querySelector('#pause-recording').disabled = true;
//        document.querySelector('#start-recording').disabled = false;
      };
    }
  },
  mounted() {
//    $("#emo").emojioneArea({
//      pickerPosition: "left"
//    });



//    console.log('require-msr', MediaStreamRecorder);
//
//    console.log('\n\n-------\n\n');
//
//    var recorder = new MediaStreamRecorder({});
//    console.log('MediaStreamRecorder', recorder);
//
//    console.log('\n\n-------\n\n');
//
//    var multiStreamRecorder = new MediaStreamRecorder.MultiStreamRecorder([]);
//    console.log('MultiStreamRecorder', multiStreamRecorder);


//    var mediaConstraints = {
//      audio: true,
//      video: true
//    };
//
//    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
//
//    function onMediaSuccess(stream) {
//      var mediaRecorder = new MediaStreamRecorder(stream);
//      mediaRecorder.mimeType = 'video/webm';
//      mediaRecorder.ondataavailable = function (blob) {
//        // POST/PUT "Blob" using FormData/XHR2
//        var blobURL = URL.createObjectURL(blob);
//        document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
//      };
//      mediaRecorder.start(3000);
//    }
//
//    function onMediaError(e) {
//      console.error('media error', e);
//    }





    function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
      navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
    }

    var mediaConstraints = {
      audio: true
    };

    document.querySelector('#start-recording').onmousedown = function() {
      //this.disabled = true;
      captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
    };
    document.querySelector('#start-recording').onmouseup = function() {
      //this.disabled = true;
      mediaRecorder.stop();
      mediaRecorder.stream.stop();
      //document.querySelector('#pause-recording').disabled = true;
      //document.querySelector('#start-recording').disabled = false;
    };
//    document.querySelector('#pause-recording').onclick = function() {
//      this.disabled = true;
//      mediaRecorder.pause();
//      document.querySelector('#resume-recording').disabled = false;
//    };
//    document.querySelector('#resume-recording').onclick = function() {
//      this.disabled = true;
//      mediaRecorder.resume();
//      document.querySelector('#pause-recording').disabled = false;
//    };
    document.querySelector('#save-recording').onclick = function() {
      this.disabled = true;

      console.log(mediaRecorder);

      mediaRecorder.save();
    };

    var mediaRecorder;

    function onMediaSuccess(stream) {
      var audio = document.createElement('audio');
      audio = mergeProps(audio, {
        controls: true,
        muted: true
      });
      audio.srcObject = stream;
      audio.play();

      audiosContainer.appendChild(audio);
      audiosContainer.appendChild(document.createElement('hr'));
      mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.stream = stream;
      //mediaRecorder.recorderType = StereoAudioRecorder;
      //mediaRecorder.mimeType = 'video/webm';

      var recorderType = document.getElementById('audio-recorderType').value;

      if (recorderType === 'MediaRecorder API') {
        mediaRecorder.recorderType = MediaRecorderWrapper;
        mediaRecorder.mimeType = 'audio/wav';
      }
      if (recorderType === 'WebAudio API (WAV)') {
        mediaRecorder.recorderType = StereoAudioRecorder;
        mediaRecorder.mimeType = 'audio/wav';
      }
      if (recorderType === 'WebAudio API (PCM)') {
        mediaRecorder.recorderType = StereoAudioRecorder;
        mediaRecorder.mimeType = 'audio/pcm';
      }

      // don't force any mimeType; use above "recorderType" instead.
      // mediaRecorder.mimeType = 'audio/webm'; // audio/ogg or audio/wav or audio/webm

      mediaRecorder.ondataavailable = function(blob) {

        let data = new FormData();

        data.append("audiofile", blob);

        axios.post("http://localhost:3000/post/audio", data)
          .then(res => console.log(res))
          .catch(err => console.log(err));

        console.log(blob);

        var a = document.createElement('a');
        a.target = '_blank';
        a.innerHTML = "The End";
        //a.innerHTML = 'Open Recorded Audio No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);
        a.href = URL.createObjectURL(blob);
        audiosContainer.appendChild(a);
        audiosContainer.appendChild(document.createElement('hr'));
      };
//      var timeInterval = document.querySelector('#time-interval').value;
//      if (timeInterval) timeInterval = parseInt(timeInterval);
//      else timeInterval = 5 * 1000;

      mediaRecorder.start(true);

//      document.querySelector('#stop-recording').disabled = false;
//      document.querySelector('#pause-recording').disabled = false;
//      document.querySelector('#save-recording').disabled = false;
    }

    function onMediaError(e) {
      console.error('media error', e);
    }

    var audiosContainer = document.getElementById('audios-container');
    var index = 1;

//    function bytesToSize(bytes) {
//      var k = 1000;
//      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//      if (bytes === 0) return '0 Bytes';
//      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
//      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
//    }
//
//    function getTimeLength(milliseconds) {
//      var data = new Date(milliseconds);
//      return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
//    }

    window.onbeforeunload = function() {
      document.querySelector('#start-recording').disabled = false;
    };
  },
  components: {
    chat: chat,
    map
  }
}
</script>





<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}

/*.emojionearea{*/
  /*width: 300px;*/
  /*border: 1px solid black;*/
  /*border-radius: 0;*/
/*}*/

/*.emojioneemoji{*/
  /*width: 20px;*/
  /*height: 20px;*/
  /*vertical-align: middle;*/
/*}*/

</style>
