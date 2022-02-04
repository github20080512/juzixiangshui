import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);
//NavigationDuplicated: Avoided redundant navigation to current location
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

import Home from "@/views/Home.vue";
import Login from "@/components/Login.vue";
import Index from "@/views/child/index.vue";
import Set from "@/views/Set.vue";
import Todo from "@/views/Todo.vue";
import Change from "@/views/Change.vue";
import Search from "@/views/Search.vue";
import Serve from "@/views/Serve.vue";
import Note from "@/views/Note.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/index",

    component: Home,
    children: [
      {
        path: "login",
        name: "Login",
        component: Login,
      },
      {
        path: "index",
        name: "Index",
        component: Index,
      },
      {
        path: "change",
        name: "Change",
        component: Change,
      },
    ],
  },
  {
    path: "/set",
    name: "Set",
    component: Set,
  },
  {
    path: "/todo",
    name: "Todo",
    component: Todo,
  },
  {
    path: "/note",
    name: "Note",
    component: Note,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/serve",
    name: "Serve",
    component: Serve,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let isLogin = store.state.user.time;
  if (isLogin) {
    //如果用户信息存在则往下执行。
    next();
  } else {
    //如果用户token不存在则跳转到login页面
    if (to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
