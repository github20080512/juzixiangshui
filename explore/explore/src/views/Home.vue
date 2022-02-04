<template>
  <div class="home">
    <div class="bg" v-bind:style="styleObject">
      <div v-show="isMask || isShowOneword" class="container"></div>

      <p ref="oneword" v-show="isShowOneword" v-bind:class="classObject"
        v-bind:style="{ color: wordColor, 'font-family': font }" class="oneword">
        {{ onetext }}
      </p>
      <div class="inf">
        <div @mouseenter="enterDiv" @mouseleave="leaveDiv">
          <button @click="nextPic" class="right-button">
            <span class="iconfont icon-arrow-right"></span>
          </button>
          <button @click="prevPic">
            <span class="iconfont icon-arrow-left"></span>
          </button>
          <button @click="likePic">
            <span class="iconfont icon-xihuan"></span>
          </button>

          <div v-show="isDisCopyright" class="text">
            <p>{{ copyrightText }}</p>
            <p>{{ copyrightAuthor }}</p>
            <p v-show="!isMask">{{ loveSong }}</p>
          </div>
        </div>
        <button v-if="!isMask" @click="disOneword">
          <span class="iconfont icon-yijuhuamaidian"></span>
        </button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "Home",
    // components: { ComponentName },

    data() {
      return {
        picIndex: 0,
        picArr: [],
        copyrightReg: /(.*)([\(\（].*[\)|\）])/,
        disTimer: null,
        isDisCopyright: false,
        isMask: true,
        isEsc: false,
        onetext: "",
        isShowOneword: false,
        isAnimateActive: false,
        randomIndex: 0,
        showTypeTimer: null,
        wordColor: "",
        loveSong: "",
        colorArr: [
          "rgb(110 0 255)",
          "rgb(255 0 59)",
          "rgb(251 0 255)",
          "rgb(0 31 255)",
          "rgb(255 94 0)",
          "rgb(255 0 0)",
          "rgb(0 255 149)",
          "rgb(255 153 0)",
          "rgb(0 0 0)",
          "rgb(82 82 82)",
        ],
        font: "",
        fontFamily: [
          "cursive",
          "fantasy",
          "emoji",
          "fangsong",
          "monospace",
          "serif",
        ],
      };
    },

    mounted() {
      this.$http
        .get("http://bing.getlove.cn/latelyBingImageStory")
        .then((response) => {
          this.picArr = response.data;
        });

      this.$refs.oneword.addEventListener(
        "transitionend",
        () => {
          if (!this.isAnimateActive) {
            this.isShowOneword = false;
          }
        },
        false
      );
    },

    computed: {
      styleObject: function () {
        if (this.picArr[this.picIndex]) {
          var picurl = this.picArr[this.picIndex]["url"];

          return {
            background:
              "url(https://www.bing.com" +
              picurl +
              ") center center / cover no-repeat",
          };
        }
      },
      copyrightText() {
        if (this.picArr[this.picIndex]) {
          let str = this.picArr[this.picIndex].copyright;
          return str.match(this.copyrightReg)[1];
        }
      },
      copyrightAuthor() {
        if (this.picArr[this.picIndex]) {
          let str = this.picArr[this.picIndex].copyright;
          return str.match(this.copyrightReg)[2];
        }
      },

      classObject() {
        return {
          [`animate` + this.randomIndex]: true,
          ["animate-active" + this.randomIndex]: this.isAnimateActive,
        };
      },
    },

    created() {
      var g = this;
      document.onkeydown = function (ev) {
        if (ev.key == "Escape") {
          if (g.isEsc) {
            return;
          }

          g.$store.commit("setNavButtonShow", true);
          g.isEsc = true;
        }
      };

      document.onkeyup = function (ev) {
        if (ev.key == "Escape") {
          g.isEsc = false;
          g.$store.commit("setNavButtonShow", false);
        }
      };
    },
    methods: {
      keyupfn() {
        this.isEsc = false;
      },
      prevPic() {
        if (this.picIndex < 29) {
          this.picIndex++;
        }
      },
      nextPic() {
        if (this.picIndex > 0) {
          this.picIndex--;
        }
      },
      enterDiv() {
        clearTimeout(this.disTimer);

        if (this.picArr.length != 0 || (this.loveSong && !this.isMask)) {
          this.isDisCopyright = true;
        }
      },
      leaveDiv() {
        clearTimeout(this.disTimer);
        this.disTimer = setTimeout(() => {
          this.isDisCopyright = false;
        }, 1000);
      },
      likePic() {
        if (!this.$store.state.user.time) {
          return;
        }

        if (this.$store.state.navButtonShow) {
          this.isMask = !this.isMask;
          this.isDisCopyright = false;
          if (!this.loveSong) {
            var songArr = this.$store.state.lifeData.likeSongs;
            var songIndex = Math.floor(Math.random() * songArr.length);
            this.loveSong = songArr[songIndex].name;
          }

          return;
        }

        if (!this.picArr[this.picIndex]) {
          return;
        }
        let obj = this.picArr[this.picIndex];

        let judge = false;
        this.$store.state.lifeData.like.map((item) => {
          if (item.url == obj.url) {
            judge = true;
          }
        });
        if (judge) {
          this.$store.commit("addWarningMessage", "loved before");
        } else {
          this.$store
            .dispatch("addDataAction", {
              arr: ["lifeData", "like"],
              obj: {
                url: obj.url,
                copyright: obj.copyright,
              },
            })
            .then(() => {
              this.$http
                .post("/request/writeLifeData", this.$store.state.lifeData)
                .then((res) => {
                  if (res.data.status) {
                    this.$store.commit("addMessage", "love success");
                  } else {
                    this.$store.commit("addImportantMessage", "love fail");
                  }
                });
            });
        }
      },
      disOneword() {
        if (this.isShowOneword != true) {
          this.isShowOneword = true;

          var colorIndex = Math.floor(Math.random() * this.colorArr.length);
          this.wordColor = this.colorArr[colorIndex];

          var fontIndex = Math.floor(Math.random() * this.fontFamily.length);
          this.font = this.fontFamily[fontIndex];

          this.randomIndex = Math.floor(Math.random() * 6 + 1);
          var oneWordArr = this.$store.state.lifeData.oneWord;
          var oneWordIndex = Math.floor(Math.random() * oneWordArr.length);
          var str = oneWordArr[oneWordIndex].content;
          if (this.randomIndex == 6) {
            var arr = str.split("");
            this.onetext = "";
            clearInterval(this.showTypeTimer);
            this.showTypeTimer = setInterval(() => {
              if (arr.length != 0) {
                this.onetext += arr.shift();
              } else {
                if (this.onetext.indexOf(" |") > -1) {
                  this.onetext = this.onetext.replace(" |", "");
                } else {
                  this.onetext += " |";
                }
              }
            }, 180);
          } else {
            this.onetext = str;
            setTimeout(() => {
              this.isAnimateActive = !this.isAnimateActive;
            }, 10);
          }
        } else {
          if (this.randomIndex == 6) {
            clearInterval(this.showTypeTimer);
            this.isShowOneword = false;
            this.onetext = "";
          } else {
            this.isAnimateActive = !this.isAnimateActive;
          }
        }
      },
    },
  };
</script>

<style>
  .home {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .bg {
    width: 100%;
    height: 100%;
    position: relative;
    background: url(../assets/img/bg.jpg) center center / cover no-repeat;
  }

  .inf {
    height: 25px;
    width: 180px;
    position: absolute;
    bottom: 15px;
    right: 15px;
    z-index: 999;
  }

  .inf button {
    background: none;
    color: #fff;
    border: 1px solid #fff;
    outline: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    margin-right: 20px;
    cursor: pointer;
    float: right;
  }

  .inf button:hover {
    border: 1px solid orange;
    color: orange;
  }

  .inf .right-button {
    margin-right: 0;
  }

  .inf .text {
    width: 200px;
    padding: 10px;
    position: absolute;
    right: 0px;
    bottom: 40px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
  }

  .text p:first-child {
    font-size: 14px;
  }

  .text p:last-child {
    font-size: 14px;
    margin-top: 5px;
    word-break: break-word;
  }

  .container {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.613);
    transition: all 1s ease;
  }

  .oneword {
    width: 90%;
    color: rgb(0, 0, 0);
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 24px;
    white-space: nowrap;
  }

  .animate1 {
    left: -100%;
    transition: all 1s ease;
  }

  .animate-active1 {
    left: 50%;
  }

  .animate2 {
    left: 150%;

    transition: all 1s ease;
  }

  .animate-active2 {
    left: 50%;
  }

  .animate3 {
    transform: translate(-50%, -50%) scale(0);
    transition: all 0.3s ease;
  }

  .animate-active3 {
    font-size: 24px;
    transform: translate(-50%, -50%) scale(1);
  }

  .animate4 {
    transform: translate(-50%, -50%) scale(3);
    transition: all 0.3s ease-in;

    opacity: 0;
  }

  .animate-active4 {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  .animate5 {
    opacity: 0;
    transition: all 1s ease;
  }

  .animate-active5 {
    opacity: 1;
  }

  .animate6 {
    text-align: left;
    color: black !important;
  }
</style>