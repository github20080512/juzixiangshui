<template>
  <div class="wrap">
    <div class="side" @click="hideFn" :class="{sideright:isSide}">

    </div>
    <div class="content" v-show="isSide">
      <div class="countdown-wrap">
        <div class="link-title">
          <h4>link</h4>
          <a href="javascript:;" @click="changeIsShell">
            <span>
              <img v-if="isShell" src="../../assets/img/chrome.png" alt="">
              <img v-else src="../../assets/img/chrome1.png" alt="">
            </span>


          </a>
        </div>
        <ul class="timer-choose link-choose">
          <li v-for="item in $store.state.lifeData.link" @click="visitLink(item)">{{item.name}}</li>
        </ul>

      </div>
      <div class="countdown-wrap">
        <div class="countdown-title">
          <h4>Countdown</h4>
          <a class="hour-btn" v-bind:class="{hourActive:hourjudge}" @click="startHour" href="javascript:;"><span
              class="iconfont icon-zhengdianmiaosha"></span></a>
        </div>
        <ul class="timer-choose">


          <li v-for="(item,index) in time1Arr" v-bind:class="{active:time1Index == index}"
            @click="generateTimer(item,index)">{{item}}min</li>


        </ul>
        <timer-control v-on:stop-timer="stoptimer" @refresh="refresh">
          {{formatTime1}}
        </timer-control>
      </div>
      <div>
        <h4>Stopwatch</h4>
        <timer-control v-on:stop-timer="stoptimer2" @refresh="refresh2">
          {{formatTime2}}
          <template v-slot:start>
            <button @click="emit3" class="btn-start">start</button>
          </template>
        </timer-control>
      </div>
    </div>
  </div>
</template>

<script>
  import dayjs from "dayjs"

  function double(n) {
    let str = "00" + n
    return str.substring(str.length - 2)
  }

  function formatfn(t) {
    let h = parseInt(t / 3600)
    let m = parseInt((t % 3600) / 60)
    let s = t % 60
    return double(h) + ":" + double(m) + ":" + double(s)
  }
  import TimerControl from '@/components/time/TimerControl.vue'
  export default {
    name: 'Timer',
    props: {
      msg: String
    },
    components: { TimerControl },
    data() {
      return {
        timer1: null,
        time1: 0,
        timer2: null,
        time2: 0,
        isSide: false,
        isShell: true,
        hourTimer: null,
        hourjudge: true,
        time1Index: -1,
        time1Arr: [10, 20, 30, 40, 60, 90]

      };
    },
    computed: {
      formatTime1() {
        let t = this.time1 / 1000;
        return formatfn(t)
      },
      formatTime2() {
        let t = this.time2 / 1000;
        return formatfn(t)
      },

    },
    methods: {
      generateTimer(n, i) {
        this.time1Index = i
        this.time1 = n * 60 * 1000
        clearInterval(this.timer1)
        this.timer1 = setInterval(() => {
          this.time1 -= 1000
          if (this.time1 <= 100) {
            clearInterval(this.timer1)
            new Notification("time", { body: "time is up" })
            this.time1Index = -1

          }

        }, 1000)
      },
      stoptimer() {
        clearInterval(this.timer1)
        this.time1Index = -1

      },
      stoptimer2() {
        clearInterval(this.timer2)

      },
      refresh() {
        clearInterval(this.timer1)
        this.time1 = 0
        this.time1Index = -1
      },
      refresh2() {
        clearInterval(this.timer2)
        this.timer2 = null
        this.time2 = 0
      },
      emit3() {
        if (this.timer2) {
          return;
        }
        this.timer2 = setInterval(() => {
          this.time2 += 1000
        }, 1000)
      },

      hideFn() {
        this.isSide = !this.isSide
      },
      visitLink(item) {
        if (this.isShell) {
          this.$http.post("/request/excuteShell", { url: item.content });
        } else {
          this.$http.post("/request/excuteNewWidow", { url: item.content });
        }

      },
      changeIsShell() {
        this.isShell = !this.isShell
      },
      startHour() {
        if (!this.hourjudge) {
          clearInterval(this.hourTimer)
        } else {
          this.hourTimer = setInterval(() => {

            var nowTime = dayjs().format("mm:ss")
            if (nowTime == "00:00") {
              console.log(dayjs().format("hh:mm:ss"))
              new Notification("Time", { body: dayjs().format("hh:mm:ss") })
            }
          }, 1000)
        }
        this.hourjudge = !this.hourjudge
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrap {
    position: absolute;
    right: 0px;
    top: 70px;
    width: 450px;
    z-index: 1999;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;

  }

  .side {
    width: 25px;
    height: 80px;
    background: url(../../assets/img/side-left.png) center center / cover no-repeat;
    float: right;
    margin-right: -3px;
    cursor: pointer;
  }

  .sideright {
    background: url(../../assets/img/side-right.png) center center / cover no-repeat;

  }

  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 8px;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  h4 {

    padding: 5px;

    color: #42b983;
    text-align: left;

  }

  .timer-choose li {
    cursor: pointer;
  }

  .timer-choose li:hover {
    color: red;
  }

  .link-choose {
    margin-bottom: 15px;
    min-height: 50px;
    max-height: 150px;
    overflow: auto;
  }

  .countdown-wrap {
    border-bottom: 1px solid #42b983;
  }

  .btn-start {
    margin-right: 5px;
  }

  .link-title a {
    float: right;
    margin-right: 30px;
    margin-top: -25px;
  }

  .link-title img {
    width: 20px;
  }

  .timer-choose li.active {
    color: #0088cf;
  }

  .countdown-title {
    position: relative;
  }

  .hour-btn {
    position: absolute;
    right: 53px;
    top: 9px;
  }

  .hour-btn>span {
    font-size: 19px;
  }

  .hourActive>span {
    color: grey;
  }
</style>