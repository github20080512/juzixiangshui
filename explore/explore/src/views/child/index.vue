<template>
  <div class="index" v-show="getMask">
    <Message></Message>

    <timer />

    <div class="input-area">
      <div class="prompts">
        <div v-if="promptShow == 1">
          <ul class="clearFix">
            <li v-for="(item, index) in getprompts">
              <span class="prompts-num">{{ index }}.</span
              ><span class="prompts-text" @click="promptsHandle(item)">{{
                item
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="input-wrap">
        <span class="input-close">
          <span class="iconfont icon-guanbi" @click="clearInput"></span>
        </span>
        <div v-show="inputMode == 'main'" class="main-border">
          <input
            class="main-input"
            ref="inputMain"
            v-show="1"
            @input="checkInput"
            @keydown.enter="keydownFn"
            @keydown.enter.shift="shiftKeydownFn"
            v-model="inputValue"
            type="text"
          />
        </div>

        <div
          v-show="inputMode == 'bill' || inputMode == 'behavior'"
          class="search-border"
        >
          <div class="extra-input">
            <input
              ref="input1"
              v-model="billForm.number"
              class="other-input"
              type="text"
              @keydown.enter.ctrl="submitBill"
            />
            <input
              v-model="billForm.name"
              class="other-input"
              type="text"
              :placeholder="billPlaceHold"
              @keydown.enter.ctrl="submitBill"
              @keydown.enter="qucikType"
              @focus="promptShowFn"
              @blur="promptHideFn"
            />
            <input
              v-model="billForm.remark"
              class="other-input"
              type="text"
              placeholder="remark"
              @keydown.enter.ctrl="submitBill"
            />
          </div>
        </div>
        <div v-if="inputMode == 'record'" class="search-border">
          <div class="extra-input">
            <input
              class="other-input"
              type="text"
              @keydown.enter.ctrl="submitRecord"
              v-model="recordForm.subject"
              @keydown.enter="qucikTypeSubject"
              @focus="promptShowFn"
              @blur="promptHideFn"
              tabindex="1"
              placeholder="remarks"
            />
            <input
              class="other-input other-input-title"
              type="text"
              placeholder="title"
              v-model="recordForm.title"
              @keydown.enter.ctrl="submitRecord"
              tabindex="2"
            />
          </div>
        </div>
        <button class="go-btn" @click="goSubmit">G O</button>
        <textarea
          class="other-textarea"
          v-if="inputMode == 'record'"
          v-model="recordForm.content"
          @keydown.enter.ctrl="submitRecord"
          ref="textarea"
          name=""
          id=""
          cols="30"
          rows="10"
          tabindex="3"
        ></textarea>
      </div>
      <result
        :isBack="renderMode"
        v-if="renderMode != ''"
        @my-event="wordFnBack"
        @my-close="wordFnClose"
      >
        <div
          v-if="renderMode == 'strMode' || renderMode == 'detailMode'"
          class="result-div"
        >
          <h5>{{ resultStr.title }}:</h5>
          <div class="result-content">
            <p v-for="item in resultStr.content">{{ item }}</p>
          </div>
        </div>
        <div v-else="renderMode == 'wordMode'" class="result-div">
          <h5>{{ resultStr.title }}:</h5>
          <div class="result-content">
            <p
              class="word-title"
              v-for="item in resultStr.content"
              @click="showDetail(item)"
            >
              {{ item }}
            </p>
          </div>
        </div>
      </result>
    </div>
  </div>
</template>

<script>
import Result from "@/components/Result.vue";
import Message from "@/components/Message.vue";
import Timer from "@/components/time/timer.vue";

import dayjs from "dayjs"; // ES 2015
export default {
  name: "XiangshuiIndex",

  components: {
    Result,
    Message,
    Timer,
  },

  data() {
    return {
      resultTimer: null,
      todoCheckTimer: null,
      promptShowTimer: null,
      regNumber: /^[0-9]+$/g,
      regBeavior: /^\*[1-9]+/g,
      regBill: /^[\+|\-][0-9]+(\.[0-9]*)?$/g,
      regCalculate: /^([(]?[0-9]+[.]?[0-9]*)([\+|\-|\*|\/])([0-9]+[.]?[0-9]*[)]?)/g,
      regWords: /^\@[a-zA-Z]+/g,
      promptShow: 0,
      inputValue: "",
      renderMode: "",
      inputMode: "main",
      billPlaceHold: "",
      billForm: {
        date: "",
        name: "",
        number: "",
        remark: "",
        writeTime: "",
      },
      recordForm: {
        date: "",
        subject: "",
        title: "",
        content: "",
        writeTime: "",
      },
      resultStr: {
        title: "",
        content: [],
      },
    };
  },
  computed: {
    getprompts() {
      if (this.inputMode == "main") return [];
      return this.$store.state.recordData[this.inputMode].subjects;
    },
    getTodoArr() {
      let arr = JSON.parse(JSON.stringify(this.$store.state.lifeData.todo));
      arr.forEach((item) => {
        if (item.everyday) {
          item.fulltime = dayjs(
            dayjs().format("YYYY-MM-DD") + " " + item.time
          ).valueOf();
        } else {
          item.fulltime = dayjs(item.date + " " + item.time).valueOf();
        }
      });

      return arr;
    },
    getMask() {
      return this.$parent.isMask;
    },
  },
  mounted() {
    this.$refs.inputMain.focus();
    let arr = this.$store.state.user.log.split("<br>");
    this.setMode("strMode", "LOG", true, arr);
    setTimeout(() => {
      this.renderMode = "";
      this.resultStr.content = [];
    }, 15000);
    //start todo

    clearInterval(this.todoCheckTimer);
    this.todoCheckTimer = setInterval(() => {
      this.getTodoArr.forEach((item) => {
        if (item.remind && item.fulltime) {
          let nowtime = dayjs().valueOf();
          let targettime = item.fulltime;
          let result = targettime - nowtime;

          if (result >= 0 && result <= 1000) {
            this.$root.$children[0].$refs.ring.play();
            this.$store.commit("addImportantMessage", "To do time");
            setTimeout(() => {
              this.$root.$children[0].$refs.ring.pause();
            }, 30000);
          }
        }
      });
    }, 1000);
  },
  activated() {
    this.$refs.inputMain.focus();
  },
  methods: {
    hideResult() {
      clearTimeout(this.resultTimer);
      this.resultTimer = setTimeout(() => {
        this.renderMode = "";
        this.resultStr.content = [];
        this.inputValue = "";
      }, 60000 * 10);
    },
    requestRecord() {
      if (this.$store.state.recordData.record) {
        return;
      }
      this.$http
        .post("/request/readData", {
          path: "record",
        })
        .then((res) => {
          this.$store.commit("readRecordData", res.data);
        });
    },
    requestSaveRecord() {
      this.$http
        .post("/request/writeData", {
          path: "record",
          content: this.$store.state.recordData,
        })
        .then((res) => {
          if (res.data.status) {
            this.$store.commit("addMessage", "Save success");
          } else {
            this.$store.commit("addImportantMessage", "Save fail");
          }
        });
    },
    checkInput() {
      if (this.inputValue.match(this.regBill)) {
        this.requestRecord();
        this.inputMode = "bill";
        this.billForm.number = this.inputValue;
        if (this.inputValue.substring(0, 1) == "+") {
          this.billPlaceHold = "salary";
        } else {
          this.billPlaceHold = "food";
        }
        setTimeout(() => {
          this.$refs.input1.focus();
        }, 10);
        this.inputValue = "";
      }
      if (this.inputValue.match(this.regBeavior)) {
        this.requestRecord();
        this.inputMode = "behavior";
        this.billForm.number = this.inputValue;
        this.billPlaceHold = "fantacy";
        setTimeout(() => {
          this.$refs.input1.focus();
        }, 10);
        this.inputValue = "";
      }
    },
    submitBill() {
      this.billForm.date = dayjs().format("DD");
      this.billForm.writeTime = dayjs().valueOf();
      if (!this.billForm.name) {
        this.billForm.name = this.billPlaceHold;
      }
      if (!this.getprompts.includes(this.billForm.name)) {
        this.$store.commit("addWarningMessage", "not such a subject");
        return;
      }

      this.billForm.number = this.billForm.number.replace("*", "");

      this.$store
        .dispatch("setRecordData", {
          temobj: this.billForm,
          objstr: this.inputMode,
        })
        .then(() => {
          this.requestSaveRecord();
        });
      this.billForm = {
        date: "",
        name: "",
        number: "",
        remark: "",
        writeTime: "",
      };
      this.inputMode = "main";
      setTimeout(() => {
        this.$refs.inputMain.focus();
      }, 10);
    },
    submitRecord() {
      if (!this.recordForm.title && !this.recordForm.content) {
        this.$store.commit("addWarningMessage", "Not filled in");
        return;
      }

      if (!this.recordForm.subject) {
        this.recordForm.subject = "remarks";
      }

      if (!this.getprompts.includes(this.recordForm.subject)) {
        this.$store.commit("addWarningMessage", "not such a subject");
        return;
      }
      this.recordForm.date = dayjs().format("DD");
      this.recordForm.writeTime = dayjs().valueOf();

      this.$store
        .dispatch("setRecordData", {
          temobj: this.recordForm,
          objstr: "record",
        })
        .then(() => {
          this.requestSaveRecord();
        });
      this.recordForm = {
        date: "",
        subject: "",
        title: "",
        content: "",
        writeTime: "",
      };
      this.inputMode = "main";
      setTimeout(() => {
        this.$refs.inputMain.focus();
      }, 10);
    },
    setMode(mode, title, deconstruction, params) {
      this.renderMode = mode;
      this.resultStr.title = title;
      if (!deconstruction) {
        this.resultStr.content = [params];
      } else {
        this.resultStr.content = [...params];
      }
    },
    keydownFn() {
      if (this.inputValue.match(this.regCalculate)) {
        let cal = this.inputValue + " = " + eval(this.inputValue);
        this.setMode("strMode", "Calculate", false, cal);
        this.hideResult();
      }
      if (this.inputValue.match(this.regWords)) {
        let val = this.inputValue.replace("@", "");
        if (val == "all") {
          this.showAll();
        } else {
          this.showDetail(val);
        }
      }
    },
    shiftKeydownFn() {
      this.requestRecord();
      this.inputMode = "record";
      setTimeout(() => {
        this.$refs.textarea.focus();
      }, 10);
    },
    showDetail(item) {
      let tem = this.$store.state.lifeData.myWords[item].split("\n");
      this.setMode("detailMode", "Words", true, tem);
      this.hideResult();
    },
    showAll() {
      let tem = [];
      for (let i in this.$store.state.lifeData.myWords) {
        tem.push(i);
      }
      this.setMode("wordMode", "Words", true, tem);
      this.hideResult();
    },
    wordFnBack() {
      this.showAll();
    },
    wordFnClose() {
      this.renderMode = "";
      this.resultStr.content = [];
      this.inputValue = "";
    },
    promptsHandle(str) {
      if (this.inputMode == "bill" || this.inputMode == "behavior") {
        this.billForm.name = str;
      }
      if (this.inputMode == "record") {
        this.recordForm.subject = str;
      }
    },
    qucikType() {
      let number = this.billForm.name;
      if (number.match(this.regNumber) && number * 1 < this.getprompts.length) {
        this.billForm.name = this.getprompts[number];
      }
    },
    qucikTypeSubject() {
      let number = this.recordForm.subject;
      if (number.match(this.regNumber) && number * 1 < this.getprompts.length) {
        this.recordForm.subject = this.getprompts[number];
      }
    },
    goSubmit() {
      if (this.inputMode == "record") {
        this.submitRecord();
        return;
      }
      if (this.inputMode == "bill" || this.inputMode == "behavior") {
        this.submitBill();
        return;
      }
      var httpReg = /^http/;
      var htmlReg = /html$/;
      if (this.inputValue.match(httpReg) || this.inputValue.match(htmlReg)) {
        this.$http.post("/request/excuteNewWidow", { url: this.inputValue });
        this.inputValue = "";
        return;
      }
      let baiduStr = this.inputValue;
      baiduStr = baiduStr.replace("%", "%25");
      baiduStr = baiduStr.replace("+", "%2B");
      baiduStr = baiduStr.replace(" ", "+");
      baiduStr = baiduStr.replace("/", "%2F");
      baiduStr = baiduStr.replace("?", "%3F");
      baiduStr = baiduStr.replace("=", "%3D");
      baiduStr = baiduStr.replace("#", "%23");
      baiduStr = baiduStr.replace(" ", "+");
      baiduStr =
        "http://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=" +
        baiduStr;
      this.$http.post("/request/excuteNewWidow", { url: baiduStr });
      this.inputValue = "";
      return;
    },
    promptShowFn() {
      clearTimeout(this.promptShowTimer);
      this.promptShow = 1;
    },
    promptHideFn() {
      clearTimeout(this.promptShowTimer);

      this.promptShowTimer = setTimeout(() => {
        this.promptShow = 0;
      }, 2000);
    },
    clearInput() {
      this.inputMode = "main";
      this.inputValue = "";
      setTimeout(() => {
        this.$refs.inputMain.focus();
      }, 10);
    },
  },

  watch: {
    // '$store.state.user.log'(newval,oldval){
    // }
  },
  filters: {
    // changestr:function(value){
    // }
  },
};
</script>

<style scoped>
.index {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.input-area {
  margin-left: 50px;
  margin-top: 50px;
  width: 480px;
}

.prompts {
  cursor: default;
  padding: 0 8px;
  height: 42px;
  margin-bottom: 10px;
  overflow: auto;
}

.prompts li {
  float: left;
  margin-right: 10px;
}

.prompts-num {
  margin-right: 5px;
  color: rgb(131, 129, 129);
}

.prompts-text {
  color: rgb(131, 129, 129);
}

.prompts-text:hover {
  color: black;
}

.input-wrap {
  position: relative;
}

.input-wrap input {
  width: 402px;
  height: 40px;
  padding: 1px 15px;
  border: 1px solid rgb(100, 100, 100);
}

.input-wrap .main-input:focus {
  border: 1px solid black;
}

.go-btn {
  width: 60px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid rgb(100, 100, 100);
  border-radius: 5px;
  margin-left: 15px;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.go-btn:focus {
  border: 1px solid orange;
}

.go-btn:hover {
  border: 1px solid orange;
  background: orange;
  color: #fff;
}

.quick-wrap > div {
  margin-bottom: 15px;
}

.quick-wrap li {
  float: left;
  margin-right: 15px;
}

.main-border {
  border-bottom: none;
  display: inline-block;
  height: 40px;
  font-size: 0;
}

.search-border {
  border: 1px solid black;
  border-bottom: none;
  display: inline-block;
  height: 40px;
  font-size: 0;
}

.input-wrap .other-input {
  border: none;
  border-bottom: 1px solid BLACK;
  width: 133.3px;
  height: 40px;
  outline: none;
  padding: 0px 10px;
}

.input-wrap .other-input::-webkit-input-placeholder {
  color: rgb(192, 188, 188);
}

.input-wrap .other-input:focus {
  border-bottom: 1px solid red;
}

.input-wrap .other-input:focus::-webkit-input-placeholder {
  color: rgba(255, 0, 0, 0.674);
}

.input-wrap .other-input-title {
  width: 266.66px;
  text-align: center;
}

.other-textarea {
  width: 479px;
  margin-top: 6px;
  height: 270px;
  outline: none;
  padding: 15px;
}

.other-textarea:focus {
  border: 1px solid orange;
}

.result-div {
  line-height: 28px;
}

.result-content {
  max-height: 245px;
  overflow: auto;
}

.result-div h5 {
  font-size: 20px;
  font-weight: normal;
  margin-bottom: 10px;
  color: #ffffff;
  background: orange;
  display: inline-block;
  border-radius: 15px;
  padding: 0px 8px;
}

.result-div p {
  text-indent: 2em;
}

.input-close {
  display: block;
  width: 30px;
  height: 30px;

  line-height: 30px;
  text-align: center;
  position: absolute;
  top: 5px;
  right: 80px;
  z-index: 999;
}

.input-close > span {
  display: none;
  font-size: 25px;
  margin-top: 2px;
}

.input-close:hover > span {
  background: #fff;
  display: inline-block;
  width: 30px;
  cursor: pointer;
  color: red;
}

.word-title {
  cursor: pointer;
}

.word-title:hover {
  color: #e1402b;
}
</style>
