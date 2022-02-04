<template>
  <div class="message" v-show="messageLength">
    <div class="wrap">
      <button class="close" @click="closeMessage">
        <span class="iconfont icon-guanbi"></span>
      </button>
      <p class="normalMessage" v-for="item in getMessage">{{ item }}</p>
      <p class="warningMessage" v-for="item in getWarningMessage">{{ item }}</p>
      <p class="importantMessage" v-for="item in getImportantMessage">
        {{ item }}
      </p>
      <p class="handlingMessage" v-for="item in getHandlingMessage">
        {{ item }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",

  data() {
    return {};
  },

  computed: {
    getHandlingMessage() {
      return this.$store.state.handlingMessage;
    },
    getMessage() {
      return this.$store.state.message;
    },
    getWarningMessage() {
      return this.$store.state.warningMessage;
    },
    getImportantMessage() {
      return this.$store.state.importantMessage;
    },
    messageLength() {
      return (
        this.getMessage.length +
        this.getWarningMessage.length +
        this.getImportantMessage.length +
        this.getHandlingMessage.length
      );
    },
  },

  mounted() {},

  methods: {
    closeMessage() {
      if (this.$store.state.importantMessage.includes("To do time")) {
        this.$root.$children[0].$refs.ring.pause();
        this.$root.$children[0].$refs.ring.currentTime = 0.0;
      }
      this.$store.commit("closeMessage");
    },
  },
};
</script>

<style scoped>
.message {
  width: 300px;

  border-radius: 10px;

  position: fixed;
  top: 15px;
  left: 50%;
  margin-left: -150px;
  z-index: 3000;
}

.message .wrap {
  text-align: center;
  line-height: 40px;
  min-height: 40px;
}

.wrap p {
  width: 264px;
  text-align: center;
}

.close {
  width: 20px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  border: 1px solid red;
  border-radius: 50%;
  background: none;
  position: absolute;
  right: 0px;
  top: 10px;
  color: red;
}

.wrap p {
  margin-bottom: 5px;
  border-radius: 5px;
}

.normalMessage {
  background: rgb(209 255 133);
}

.importantMessage {
  background: red;
  font-weight: bold;
  color: #fff;
}

.warningMessage {
  background: rgb(250, 136, 111);
  color: #fff;
}
.handlingMessage {
  background: greenyellow;
  color: #fff;
}
</style>
