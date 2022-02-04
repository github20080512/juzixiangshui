import Vue from "vue";

import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// Vue.filter('changethestr', function (value) {
//   console.log(value)
//   return value.replace("*","")
// })

new Vue({
  router,
  store,

  render: (h) => h(App),
}).$mount("#app");
