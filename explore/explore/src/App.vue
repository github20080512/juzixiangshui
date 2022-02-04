<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <Nav></Nav>
    <keep-alive exclude="Todo,Set">
      <router-view />
    </keep-alive>
    <div>
      <audio ref="ring" src="./assets/ring/ring.mp3"></audio>
    </div>
  </div>
</template>
<script>
  import Nav from "@/components/nav/Nav.vue";
  export default {
    name: "App",
    components: {
      Nav
    },
    computed: {

    },
    created() {
      var _this = this
      document.addEventListener("visibilitychange", function () {
        if (_this.$store.state.user.time) {
          _this.$http
            .post("/request/checkLoginTimeout", {
              name: _this.$store.state.TheVersion,
              value: _this.$store.state.user.time,
            })
            .then((res) => {
              let answer = res.data;
              if (answer.isLoginTimeout) {
                _this.$store.dispatch("actionSetUer", {})
                _this.$router.push("/login")
              }else if(answer.isNote){
                _this.$router.push("/note")
              }
            });
        }


      });

   
    }
  }
</script>
<style src="./assets/iconfont/iconfont.css"></style>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #app {
    width: 100%;
    height: 100%;
    font-size: 14px;
    min-width: 1000px;
  }

  #app {
    position: relative;
  }

  li {
    list-style: none;

  }

  a {
    text-decoration: none;
    color: rgb(70, 70, 70);
    font-size: 14px;
  }

  a:hover {
    color: black;
  }

  input,
  button {
    border: none;
    outline: none;
  }

  .clearFix:after {
    display: block;
    content: "";
    clear: both;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>