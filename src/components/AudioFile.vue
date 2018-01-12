<template>

  <div class="audioMessage">
    <audio class="audio" preload="true" ref="sound"><source :src="src"></audio>
    <div class="audioMessage-button play" ref="playbutton">
      <!--<img class="audioMessage-button-img" src="../assets/play-button.svg" style="display: block"/>-->
      <!--<img class="audioMessage-button-img" src="../assets/pause-button.svg" style="display: none"/>-->
    </div>
    <div class="audioMessage-block">
      <div class="audioMessage-block-up">
        <div class="audioMessage-block-up-text">Голосовое сообщение</div>
        <div class="audioMessage-block-up-time" ref="time">00 : 00</div>
      </div>
      <div class="audioMessage-block-down">
        <div class="audioMessage-block-down-road" ref="timeline">
          <div class="audioMessage-block-down-road-playedtimeline" ref="playedtimeline"></div>
          <!--<div class="playhead" ref="playhead"></div>-->
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'AudioFile',
    props: ["audioID", "audioWay"],
    data () {
      return {
        src: this.audioWay,
        playingAudio: false,
        onplayhead: false,
      }
    },
    mounted() {
      console.log("audio", this.$refs.sound);
      const vm = this;
      this.Audio = new AudioObject2();

      function AudioObject2() {
        console.log("AudioObject2");
        this.audio = vm.$refs.sound;
        this.duration = 0;
        this.playbutton = vm.$refs.playbutton;
        this.timeline = vm.$refs.timeline;
        this.playedtimeline = vm.$refs.playedtimeline;
        this.time = vm.$refs.time;
        //this.playhead = vm.$refs.playhead;
        //this.timelineWidth = this.timeline.offsetWidth - this.playhead.offsetWidth;
        this.timelineWidth = this.timeline.offsetWidth;
        this.audio.addEventListener("timeupdate", vm.timeUpdate, false);
        this.audio.addEventListener("durationchange", durationChange, false);
        this.timeline.addEventListener("click", vm.timelineClick, false);
        this.playbutton.addEventListener("click", vm.pressPlay, false);
        //this.playhead.addEventListener('mousedown', vm.mouseDown, false);
      }

      function durationChange () {
        console.log("durationChange", this);
        vm.Audio.duration = this.duration;
      }

    },
    methods: {
      timeUpdate() {
        let minutes = Math.floor(Math.floor(this.Audio.audio.currentTime) / 60);
        let seconds = Math.floor(this.Audio.audio.currentTime) - minutes * 60;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        this.Audio.time.innerHTML = minutes + " : " + seconds;

        let playPercent = this.Audio.timelineWidth * (this.Audio.audio.currentTime / this.Audio.duration);
        //this.Audio.playhead.style.marginLeft = playPercent + "px";
        this.Audio.playedtimeline.style.width = playPercent + "px";
        // If song is over
        if (this.Audio.audio.currentTime == this.Audio.duration) {
          this.changeClass(this.Audio.playbutton, "audioMessage-button play");
          this.Audio.audio.currentTime = 0;
          this.Audio.audio.pause();
          this.playingAudio = false;
        }
      },
      timelineClick(event) {
        console.log("timelineClick");
        this.Audio.audio.currentTime = this.Audio.audio.duration * this.clickPercent(event, this.Audio.timeline, this.Audio.timelineWidth);
      },
      pressPlay() {
        console.log("pressPlay");
        if (this.playingAudio) {
          this.Audio.audio.pause();
          this.playingAudio = false;
          this.changeClass(this.Audio.playbutton, "audioMessage-button play");
        } else {
          this.Audio.audio.play();
          this.playingAudio = true;
          this.changeClass(this.Audio.playbutton, "audioMessage-button pause");
        }
      },
      mouseDown(event) {
        this.onplayhead = true;
        this.Audio.audio.removeEventListener('timeupdate', this.timeUpdate, false);
        window.addEventListener('mousemove', this.moveplayhead, true);
        window.addEventListener('mouseup', this.mouseUp, true);
      },
      moveplayhead(e) {
        let newMargLeft = e.clientX - this.getPosition(this.Audio.timeline);
        if (newMargLeft >= 0 && newMargLeft <= this.Audio.timelineWidth) {  this.Audio.playhead.style.marginLeft = newMargLeft + "px";  }
        if (newMargLeft < 0) {  this.Audio.playhead.style.marginLeft = "0px";  }
        if (newMargLeft > this.Audio.timelineWidth) {  this.Audio.playhead.style.marginLeft = this.Audio.timelineWidth + "px";  }
      },
      mouseUp(e) {
        console.log("mouseUp");
        if (this.onplayhead) {
          this.Audio.audio.addEventListener('timeupdate', this.timeUpdate, false);
          window.removeEventListener('mousemove', this.moveplayhead, true);
          window.removeEventListener('mouseup', this.mouseUp, true);
          this.Audio.audio.currentTime = this.Audio.audio.duration * this.clickPercent(e, this.Audio.timeline, this.Audio.timelineWidth);
          this.onplayhead = false;
        }
      },
      changeClass(element, newClasses) {
        element.className = newClasses;
      },
      clickPercent(event, timeline, timelineWidth) {
        return (event.clientX - this.getPosition(timeline)) / timelineWidth;
      },
      getPosition(el) {
        return el.getBoundingClientRect().left;
      },
    },
    beforeUpdate() {
      console.log("2222222");
    },
    updated() {
      console.log("2222222");
    }
  }
</script>


<style scoped>
  .audioplayer {
    width: 480px;
    height: 60px;
    margin: 0 auto auto auto;
  }

  .playbutton {
    height: 60px;
    width: 60px;
    border: none;
    float: left;
    outline: none;
  }

  .play {
    background: url('../assets/play-button.svg');
  }

  .pause {
    background: url('../assets/pause-button.svg');
  }

  .play,
  .pause {
    background-size: 50px 50px;
    background-repeat: no-repeat;
    background-position: center;
  }

  .timeline {
    width: 200px;
    height: 20px;
    margin-top: 20px;
    float: left;
    border-radius: 15px;
    background: rgba(0, 0, 0, .3);
  }

  .playhead {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-top: 1px;
    background: rgba(0, 0, 0, 1);
    cursor: pointer;
  }
</style>
