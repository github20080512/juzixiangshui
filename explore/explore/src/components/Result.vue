<template>
  <div class="other">
    <div class="fn-area clearFix">
      <button v-if="isBack == 'detailMode'" class="inf-back" @click="fnBack">
        <span class="iconfont icon-arrow-left"></span>
      </button>
      <button class="inf-close" @click="fnClose">
        <span class="iconfont icon-guanbi"></span>
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Result",
  props: {
    isBack: String,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    fnBack() {
      this.$emit("my-event");
    },
    fnClose() {
      this.$emit("my-close");
    },
  },
};
</script>

<style scoped>
.other {
  padding-left: 8px;
  margin-top: 20px;
  border-radius: 5px;
  background: #fff;
  height: 350px;
}
.fn-area {
  margin-bottom: 20px;
}
.inf-back {
  float: lfet;
  cursor: pointer;
  background: none;
  font-size: 25px;
}
.inf-close {
  float: right;
  margin-right: 15px;
  cursor: pointer;
  background: none;
  font-size: 25px;
}
.inf-back:hover {
  color: red;
}
.inf-close:hover {
  color: red;
}
</style>
