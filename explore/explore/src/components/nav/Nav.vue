<template>
  <div :class="{ bgColor: isIndex }" class="nav">
    <div class="nav-wrap" v-if="getIsLogin">
      <div class="left">
        <ul>
          <li>
            <router-link to="/">Control</router-link>
          </li>
          <li class="nav-music" @mouseleave="musicLeave">
            <a href="javascript:;" @click="musicEnter">Music</a>
            <div class="mp3" v-show="musicShow">
              <audio id="mp3" ref="mp3" controls loop>
                <source src="" type="audio/mpeg" style="float: right" />
              </audio>
              <ul class="music-wrap">
                <li
                  class="music-li"
                  :class="{
                    'music-ready': i != index,
                    'music-playing': i == index,
                  }"
                  v-for="(item, i) in songArr"
                  @click="musicLiClick(i, item)"
                >
                  <div class="song-name">
                    {{ item.split(" - ")[1].replace(".mp3", "") }}
                  </div>
                  <div class="song-oprate">
                    <span class="iconfont iconfont-set icon-bofang"> </span>
                    <div class="xui-playing" v-show="i == index">
                      <i></i>&nbsp;<i></i>&nbsp;<i></i>&nbsp;<i></i>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <router-link to="/note">Note</router-link>
          </li>
          <li
            class="fabtn"
            @mouseenter="mouseenterMainFn"
            @mouseleave="mouseleaveMainFn"
            @click="isMainShow = false"
          >
            <a href="javascript:;">To</a>
            <div class="subbtns" v-show="isMainShow">
              <li>
                <router-link to="/todo">todo</router-link>
              </li>
              <li>
                <router-link to="/search">search</router-link>
              </li>
              <li>
                <router-link to="/serve">Serve</router-link>
              </li>
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <li
          class="moreMenu"
          @mouseenter="mouseenterFn"
          @mouseleave="mouseleaveFn"
          @click="isShow = false"
        >
          <a href="javascript:;"><span class="iconfont icon-caidan"></span></a>
          <div class="subMenu" v-show="isShow">
            <ul>
              <li>
                <router-link to="/set"
                  ><span class="iconfont icon-shezhi1"></span
                ></router-link>
              </li>
              <li>
                <a href="javascript:;" @click="changeFrame" class="frame-btn">
                  <span v-if="isFrame" class="iconfont icon-frame"></span>
                  <span v-else class="iconfont icon-icon_pc_frameless"></span>
                </a>
              </li>
              <li>
                <router-link to="/change"
                  ><span class="iconfont icon-yuechi xiugaimima"></span>
                </router-link>
              </li>
            </ul>
          </div>
        </li>

        <li>
          <a href="javascript:;" @click="setScreen('window-min')"
            ><span class="iconfont icon-window-min"></span
          ></a>
        </li>
        <li>
          <a href="javascript:;" @click="setScreen('window-full')"
            ><span class="iconfont icon-zuidahua"></span
          ></a>
        </li>
        <li class="window-close-btn">
          <a href="javascript:;" @click="setScreen('window-close')"
            ><span class="iconfont icon-guanbi "></span
          ></a>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav",

  data() {
    return {
      isFrame: true,
      isShow: false,
      isMainShow: false,
      mouseleaveTimer: null,
      songArr: [
        "C:\\Users\\ADMIN\\Music\\BGM供货商 - Extasy.mp3",
        "C:\\Users\\ADMIN\\Music\\大哲 - 听闻远方有你.mp3",
        "C:\\Users\\ADMIN\\Music\\GARNiDELiA (ガルニデリア) - 極楽浄土.mp3",
      ],
      urlPath: "",
      index: -1,
      musicShow: false,
    };
  },

  computed: {
    isIndex() {
      return ["/index", "/login", "/change"].includes(this.$route.fullPath);
    },
    getIsLogin() {
      return this.$store.state.user.time;
    },
    isEscToDisBtn() {
      return this.$store.state.lifeData.settings.escToDisBtn.escToDisBtn * 1;
    },
  },

  mounted() {
    this.$http.post("/request/musicNames").then((res) => {
      this.songArr = res.data.arr;
      this.urlPath = res.data.str;
    });
  },

  watch: {
    $route(to, from) {},
  },

  methods: {
    setScreen(content) {
      this.$http.post("/request/setScreen", { str: content });
    },
    changeFrame() {
      this.isFrame = !this.isFrame;
      this.$http.post("/request/setIsFrame", { isFrame: this.isFrame });
    },
    mouseenterFn() {
      clearTimeout(this.mouseleaveTimer);
      if (!this.isEscToDisBtn || this.$store.state.navButtonShow) {
        this.isShow = true;
      }
    },
    mouseleaveFn() {
      clearTimeout(this.mouseleaveTimer);
      this.mouseleaveTimer = setTimeout(() => {
        this.isShow = false;
      }, 800);
    },
    mouseenterMainFn() {
      if (!this.isEscToDisBtn || this.$store.state.navButtonShow) {
        this.isMainShow = true;
      }
    },
    mouseleaveMainFn() {
      this.isMainShow = false;
    },
    musicLiClick(i, item) {
      if (this.index == i) {
        this.index = -1;
        this.$refs.mp3.pause();
      } else {
        var temarr = item.split("\\");
        this.index = i;
        this.$refs.mp3.src =
          this.urlPath + "/music*-*" + temarr[temarr.length - 1];
        this.$refs.mp3.play();
        console.log(this.$refs.mp3.src + " start play");
      }
    },
    musicEnter() {
      this.musicShow = true;
    },
    musicLeave() {
      this.musicShow = false;
    },
  },
};
</script>

<style scoped>
.nav {
  width: 100%;
  height: 25px;
  line-height: 25px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1999;
  padding-left: 10px;
  background: rgba(236, 236, 236, 0.722);
  box-shadow: 3px 3px 4px 1px #eee;
  -webkit-app-region: drag;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.nav .left {
  float: left;
}

.nav .right {
  float: right;
}

.nav li {
  float: left;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-align: center;
}

.nav .left li {
  margin-right: 15px;
}

.nav .right li {
  width: 33px;
}

.nav .right li:hover {
  background: rgba(124, 124, 124, 0.4);
}

.nav li a {
  width: 100%;
  display: inline-block;
  -webkit-app-region: no-drag;
}

.bgColor {
  background: none;
  box-shadow: 3px 3px 4px 1px rgba(238, 238, 238, 0);
}

.bgColor a {
  color: rgba(87, 85, 85, 0.613);
}

.bgColor a:hover {
  color: #fff;
}

/* .moreMenu:hover .subMenu{
    display: block;
} */
.subMenu {
  position: absolute;
  top: 26px;
}

.frame-btn span {
  font-size: 13px;
}

.zhiding-btn {
  font-size: 13px;
}

.nav li.window-close-btn:hover {
  background: rgb(255, 41, 41);
}

.nav li.window-close-btn:hover > a {
  color: #fff;
}

.xiugaimima {
  font-size: 13px;
}

.fabtn {
  position: relative;
}

.subbtns {
  position: absolute;
  left: -5px;
  top: 25px;
  background: rgb(247, 247, 247);
  padding: 5px 0;
  padding-left: 5px;
  border-radius: 5px;
  box-shadow: 1px 1px 3px rgb(202, 202, 202);
}

.subbtns li a:hover {
  color: rgb(37, 37, 37);
}

.music-item {
  position: relative;
}
.mp3 {
  margin-left: -28px;
  margin-top: 15px;
  width: 300px;
  height: 480px;
  background: rgb(241 243 244);
  border-radius: 15px;
}
#mp3 {
  outline: none;
}
.music-wrap {
  height: 395px;
  overflow: scroll;
}

.music-wrap li {
  width: 300px;
  padding: 0px 15px;
  padding-right: 4px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e1e1e3;
  cursor: pointer;
}
.music-wrap li:hover {
  background: #e1e1e3;
}
.music-wrap li.music-ready:hover > .song-oprate > .icon-bofang {
  display: inline-block;
}
/* .music-wrap li.music-playing:hover>.song-oprate>.xui-playing{
  display: inline-block;
} */
.song-name {
  float: left;
  width: 200px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.song-oprate {
  float: right;
  width: 40px;
  height: 40px;

  text-align: center;
}

.song-oprate .iconfont-set {
  color: red;
  font-size: 30px;
}

.song-oprate .icon-bofang {
  font-size: 20px;
  line-height: 41px;
  color: grey;
  display: none;
}

.song-oprate .icon-zantingtingzhi {
  font-size: 22px;
  color: grey;
  line-height: 40px;
}
.xui-playing {
  display: inline-block;
  vertical-align: top;
  text-align: justify;
  font-size: 10px;
  width: 20px;
  height: 16px;
  margin-top: 5px;
}

.xui-playing::after {
  content: "";
  display: inline-block;
  width: 100%;
  height: 0;
  overflow: hidden;
}

.xui-playing i {
  display: inline-block;
  width: 2px;
  height: 16px;
  border-radius: 6px;
  background: #f86442;
  -webkit-animation: is-playing 0.5s ease infinite alternate;
  animation: is-playing 0.5s ease infinite alternate;
  -webkit-transform-origin: bottom;
  -ms-transform-origin: bottom;
  transform-origin: bottom;
}

.xui-playing i:nth-child(1) {
  -webkit-animation-delay: 0.15s;
  animation-delay: 0.15s;
}

.xui-playing i:nth-child(2) {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.xui-playing i:nth-child(3) {
  -webkit-animation-delay: 0.45s;
  animation-delay: 0.45s;
}

.xui-playing i:nth-child(4) {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

@-webkit-keyframes is-playing {
  0% {
    -webkit-transform: scaleY(0.2);
    transform: scaleY(0.2);
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
}

@keyframes is-playing {
  0% {
    -webkit-transform: scaleY(0.2);
    transform: scaleY(0.2);
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
}

.nav-music {
  width: 38px;
}
</style>
