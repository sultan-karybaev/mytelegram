<template>
  <div>
    <audio class="audio" preload="true" ref="sound"><source :src="src"></audio>
    <div class="audioplayer" ref="audioplayer">
      <button class="play playbutton" ref="playbutton"></button>
      <div class="timeline" ref="timeline">
        <div class="playhead" ref="playhead"></div>
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
    created() {
      // Event listener for DOM
      //document.addEventListener("DOMContentLoaded", theDOMHasLoaded, false);
      const vm = this;

      console.log("audio", this.$refs.sound);
      console.log("audio", this.audio);

      function theDOMHasLoaded() {
        vm.Audio = new AudioObject2();
      }

      this.Audio = new AudioObject2();

      function AudioObject2() {
        this.audio = vm.$refs.sound;
        this.duration = 0;
        this.audioplayer = vm.$refs.audioplayer;
        this.playbutton = vm.$refs.playbutton;
        this.timeline = vm.$refs.timeline;
        this.playhead = vm.$refs.playhead;
        this.timelineWidth = this.timeline.offsetWidth - this.playhead.offsetWidth;
        this.audio.addEventListener("timeupdate", this.timeUpdate, false);
        this.audio.addEventListener("durationchange", this.durationChange, false);
        this.timeline.addEventListener("click", this.timelineClick, false);
        this.playbutton.addEventListener("click", this.pressPlay, false);
        this.playhead.addEventListener('mousedown', this.mouseDown, false);
        window.addEventListener('mouseup', AudioObject2.prototype.mouseUp, false);
      }

      AudioObject2.prototype.timeUpdate = function () {
        let playPercent = vm.Audio.timelineWidth * (vm.Audio.audio.currentTime / vm.Audio.duration);
        vm.Audio.playhead.style.marginLeft = playPercent + "px";
        // If song is over
        if (vm.Audio.audio.currentTime == vm.Audio.duration) {
          vm.changeClass(vm.Audio.playbutton, "playbutton play");
          vm.Audio.audio.currentTime = 0;
          vm.Audio.audio.pause();
          vm.playingAudio = true;
        }
      };

      AudioObject2.prototype.durationChange = function () {
        vm.Audio.duration = this.duration;
      };

      AudioObject2.prototype.timelineClick = function (event) {
        vm.Audio.audio.currentTime = vm.Audio.audio.duration * clickPercent(event, vm.Audio.timeline, vm.Audio.timelineWidth);
      };

      AudioObject2.prototype.pressPlay = function () {
        if (vm.playingAudio) {
          vm.Audio.audio.pause();
          vm.playingAudio = false;
          vm.changeClass(vm.Audio.playbutton, "playbutton play");
        } else {
          vm.Audio.audio.play();
          vm.playingAudio = true;
          vm.changeClass(vm.Audio.playbutton, "playbutton pause");
        }
      };

      AudioObject2.prototype.mouseDown = function (event) {
        vm.onplayhead = true;
        window.addEventListener('mousemove', AudioObject2.prototype.moveplayhead, true);
        vm.Audio.audio.removeEventListener('timeupdate', AudioObject2.prototype.timeUpdate, false);
      };

      AudioObject2.prototype.moveplayhead = function (e) {
        var ao = vm.Audio;
        var newMargLeft = e.clientX - getPosition(ao.timeline);

        if (newMargLeft >= 0 && newMargLeft <= ao.timelineWidth) {
          vm.Audio.playhead.style.marginLeft = newMargLeft + "px";
        }
        if (newMargLeft < 0) {
          vm.Audio.playhead.style.marginLeft = "0px";
        }
        if (newMargLeft > ao.timelineWidth) {
          vm.Audio.playhead.style.marginLeft = ao.timelineWidth + "px";
        }
      };

      AudioObject2.prototype.mouseUp = function(e) {
        if (vm.onplayhead) {
          var ao = vm.Audio;
          window.removeEventListener('mousemove', AudioObject2.prototype.moveplayhead, true);
          // change current time
          ao.audio.currentTime = ao.audio.duration * clickPercent(e, ao.timeline, ao.timelineWidth);
          ao.audio.addEventListener('timeupdate', AudioObject2.prototype.timeUpdate, false);
          vm.onplayhead = false;
        }
      };

      function clickPercent(event, timeline, timelineWidth) {
        return (event.clientX - getPosition(timeline)) / timelineWidth;
      }

      function getPosition(el) {
        return el.getBoundingClientRect().left;
      }
    },
    watch: {

    },
    methods: {
//      bindAudioPlayer2() {
//
//      },
      changeClass(element, newClasses) {
        element.className = newClasses;
      }
    },
    updated() {
      console.log("123");
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
    background-size: 50% 50%;
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
