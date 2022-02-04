<template>
  <div class="note-wrap">
    <div class="btnarea">
      <button v-on:click="writefn" class="btn">N O T E</button>
    </div>
    <div class="textarea-wrap">
      <textarea
        name=""
        id=""
        class="note-textarea"
        cols="30"
        rows="10"
        v-model="noteStr"
        v-bind:class="{ active: isActive }"
        ref="mytextarea"
      ></textarea>
    </div>
  </div>
</template>
<script>
export default {
  name: "note",
  data() {
    return {
      noteStr: ``,
      writeTimer: null,
      isActive: false,
    };
  },
  created() {
    this.$http
      .post("/request/readData", {
        path: "note",
      })
      .then((res) => {
        this.noteStr = res.data.data;
      });
  },
  mouted() {
    console.log("mouted");
  },
  activated() {
    console.log("activated");
    var year = new Date().getFullYear();
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    date = date < 10 ? "0" + date : date;
    month = month < 10 ? "0" + month : month;
    var newStr =
      "\n---------------------------------------------- " +
      year +
      " - " +
      month +
      " - " +
      date +
      " ----------------------------------------------\n\n";
    if (this.$refs.mytextarea.value.indexOf(newStr) == -1) {
      this.$refs.mytextarea.value = this.$refs.mytextarea.value += newStr;
      var newEvent = document.createEvent("HTMLEvents");
      newEvent.initEvent("input", true, true);
      this.$refs.mytextarea.dispatchEvent(newEvent);
    }
    var _this = this;
    setTimeout(() => {
      _this.$refs.mytextarea.scrollTop = _this.$refs.mytextarea.scrollHeight;
    }, 500);
  },
  watch: {
    noteStr(val, oldVal) {
      clearTimeout(this.writeTimer);
      var _this = this;
      // console.log("should be vue")
      // console.log(this)
      this.writeTimer = setTimeout(function() {
        _this.writefn();
        _this.isActive = true;
        setTimeout(function() {
          _this.isActive = false;
        }, 500);
      }, 1500);
    },
  },
  methods: {
    writefn() {
      this.$http.post("/request/writeData", {
        path: "note",
        content: {
          data: this.noteStr,
        },
      });
    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}

.active {
  color: #42ba88;
}

textarea {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  padding: 25px;
  font-size: 21px;
  background: #e1fff3;
  font-weight: 500;
  line-height: 28px;
  font-family: math;
}

.note-wrap {
  padding-top: 35px;
  height: 100%;
  background-color: rgb(255 255 255 / 43%);
}

.btn {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  cursor: pointer;
  border: 1px solid #42ba88;
  background: none;
  font-weight: 900;
}

.btn:active {
  color: yellowgreen;
}

.note-textarea::-webkit-scrollbar {
  display: block;
  width: 15px;
  height: 8px;
  background-color: #f7f7f7d1;
}
.note-textarea::-webkit-scrollbar-thumb {
  background: #8fe4f7;
  border-radius: 25px;
}
.textarea-wrap {
  height: 93%;
}
.textarea-wrap * {
  cursor: unset;
}
</style>
