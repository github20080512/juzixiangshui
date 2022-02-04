<template>
  <div class="login">
    <Message></Message>
    <div class="int-wrap">
      <input
        ref="int"
        class="int"
        type="password"
        v-model="psd"
        @keydown.enter="eventInt"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Message from "@/components/Message.vue";
export default {
  name: "Login",
  data() {
    return {
      psd: "",
    };
  },
  mounted() {
    this.$refs.int.focus();
  },
  components: {
    Message,
  },
  methods: {
    eventInt() {
      this.$http
        .post("/request/userlogin", {
          name: "orange",
          psd: this.psd,
        })
        .then((response) => {
          let answer = response.data;
          if (answer.needSet) {
            this.$store.commit("addWarningMessage", "please init.");
            return;
          }
          if (answer.isAuth) {
            let user = {
              name: "orange",
              time: answer.time,
              log: answer.log,
            };

            this.$store.dispatch("actionSetUer", user);
            this.$store.commit("setLifeData", answer.info);
            this.psd = "";
            this.$router.push("/index");
            if (answer.needInformation) {
              this.$store.commit(
                "addWarningMessage",
                "please complete information."
              );
            }
            let arrPa = answer.info["pa"];
            for (let i = 0; i < arrPa.length; i++) {
              const item = arrPa[i];
              let obj = {
                serverUrl: item.name,
                serverPath: item.content,
                method: "text",
                other: item.shortcut,
              };
              this.$http.post("/request/excutePa", obj).then((n) => {
                let res = n.data;

                let condition = res.other.split("<")[1];
                let result = res.answer;
                item.result = result[0];
                this.$store.dispatch("editDataAction", {
                  i,
                  arr: ["lifeData", "pa"],
                  obj: item,
                });
                let mess = result + " ==== " + res.other;
                if (parseInt(result[0]) < condition * 1) {
                  this.$store.commit("addImportantMessage", mess);
                }
              });
            }
          } else {
            this.$store.commit("addWarningMessage", "welcome...");
          }
        });
    },
    //  ...mapMutations( { mySetUser: "setUser" }),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.int-wrap {
  width: 300px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  position: absolute;
  top: 22%;
  left: 10%;
  transform: translate(-50%, -50%);
}

.int-wrap input {
  border: none;
  outline: none;

  text-align: left;
  color: red;
  background: #ffffff8c;
  padding: 7px;
  width: 128px;
  padding-left: 10px;
  border-radius: 15px;
  text-align: center;
}

.int-wrap input:focus {
  border-bottom: 1px orange solid;
}
</style>
