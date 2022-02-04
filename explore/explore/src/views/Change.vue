<template>
  <div class="change">
    <Message> </Message>
    <div class="int-wrap psd-wrap">
      <h5>
        Change
      </h5>
      <div>
        <input ref="" class="int" type="password" v-model="username" placeholder="enter username" />
      </div>
      <div>
        <input ref="" class="int" type="password" v-model="oldPsd" placeholder="enter psd" />
      </div>

      <div>
        <input ref="" class="int" type="password" v-model="newPsd" placeholder="enter new psd" />
      </div>

      <div>
        <input ref="" class="int" type="password" v-model="confirmPsd" @keydown.enter="submit"
          placeholder="enter again" />
      </div>
    </div>
    <div class="int-wrap str-wrap">
      <div> <input ref="" class="int" type="text" v-model="key" placeholder="key" /></div>
      <div> <input ref="" class="int" type="text" v-model="str1" placeholder="str" /></div>

      <div class="btn-wrap">
        <button @click="setInformation">Set</button>   

        <button @click="changeInformation">Change</button>   
         <button @click="clearInformation">Clear</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import Message from "@/components/Message.vue";
  export default {
    name: 'Change',



    data() {
      return {
        username: "",
        oldPsd: '',
        newPsd: "",
        confirmPsd: "",
        key: "",
        str1: "",

      };
    },

    components: {

      Message,
    },

    mounted() {

    },

    methods: {
      setInformation(){
        this.$http
          .post("/request/setInformation", {
            username: this.username,
            oldPsd: this.oldPsd,
            key: this.key,
            str1: this.str1
           
          }).then(res => {
            if (res.data.status == 0) {
              this.$store.commit("addWarningMessage", "err code")
            } else if (res.data.status == 2){
              this.$store.commit("addWarningMessage", "Key already exists,please change")
            }else {
              this.$store.commit("addMessage", "operate success")
              this.username = ""
              this.oldPsd = ''
              this.key = ""
              this.str1 = ""
           
            }
          })
      },
      clearInformation(){

        this.$http
          .post("/request/clearInformation", {
            username: this.username,
            oldPsd: this.oldPsd,
           
          }).then(res => {
            if (res.data.status == 0) {
              this.$store.commit("addWarningMessage", "err code")
            } else {
              this.$store.commit("addMessage", "operate success")
              this.username = ""
              this.oldPsd = ''
           
            }
          })

      },
      changeInformation() {

        this.$http
          .post("/request/changeInformation", {
            username: this.username,
            oldPsd: this.oldPsd,
            key: this.key,
            str1: this.str1
          }).then(res => {
            if (res.data.status == 0) {
              this.$store.commit("addWarningMessage", "err code")
            } else if(res.data.status == 2){
              this.$store.commit("addWarningMessage", "please set the key first")
            } else {
              this.$store.commit("addMessage", "operate success")
              this.username = ""
              this.oldPsd = ''
              this.key = ""
              this.str1 = ""
            }
          })
      },
      submit() {

        if (this.confirmPsd != this.newPsd) {
          this.$store.commit("addWarningMessage", "Inconsistent")
          return;
        }
        this.$http
          .post("/request/setUsers", {
            username: this.username,
            oldPsd: this.oldPsd,
            newPsd: this.newPsd,
          }).then(res => {

            if (res.data.status == 0) {
              this.$store.commit("addWarningMessage", "err code")
            } else {
              this.$store.commit("addMessage", "change success")
              this.username = ""
              this.oldPsd = ''
              this.newPsd = ""
              this.confirmPsd = ""

            }
          })
      }
    },
  };
</script>

<style scoped>
  .int-wrap {
    width: 300px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: absolute;
    top: 12%;
    left: 22%;
    transform: translate(-50%, -50%);
  }

  .int-wrap>div {
    margin-bottom: 40px;
  }

  .int-wrap input {
    border: none;
    outline: none;
    border-bottom: 1px grey solid;
    text-align: left;
    color: orange;
    background: none;
    padding: 5px;
    width: 180px;
    padding-left: 10px;
  }

  .int-wrap input:focus {
    border-bottom: 1px orange solid;
  }

  h5 {
    margin-left: -300px;
    margin-bottom: 20px;
  }

  .str-wrap {
    height: 300px;
    width: 200px;

    position: absolute;
    left: 65%;
    top: 44%;
  }

  .psd-wrap {

    float: left;
  }

  .btn-wrap button {
    padding:5px 11px;
    margin-right: 5px;
    border-radius: 3px;
    cursor: pointer;
  }

  .btn-wrap button:hover {
    background: orange;
    color: #fff;
  }
</style>