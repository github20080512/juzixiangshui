import Vue from "vue";
import Vuex from "vuex";
import dayjs from "dayjs";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    messageTimer: null,
    TheVersion: 251214,
    user: {},
    lifeData: {},
    recordData: {},
    message: [],
    warningMessage: [],
    importantMessage: [],
    handlingMessage: [],
    navButtonShow: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    logout(state) {
      state.user = {};
    },
    setLifeData(state, payload) {
      state.lifeData = payload;
    },
    readRecordData(state, payload) {
      state.recordData = payload;
    },
    setRecordData(state, { temobj, objstr }) {
      let year = dayjs().format("YYYY");
      let month = dayjs().format("MM");
      if (!state.recordData[objstr][year]) {
        state.recordData[objstr][year] = {};
      }
      if (state.recordData[objstr][year][month]) {
        state.recordData[objstr][year][month].push(temobj);
      } else {
        state.recordData[objstr][year][month] = [temobj];
      }
    },
    addData(state, { arr, obj }) {
      var tem = state;
      arr.forEach((item) => {
        tem = tem[item];
      });
      tem.push(obj);
    },
    editData(state, { index, arr, obj }) {
      var tem = state;

      arr.forEach((item) => {
        tem = tem[item];
      });
      tem.splice(index, 1, obj);
    },
    deleteData(state, { index, arr }) {
      var tem = state;

      arr.forEach((item) => {
        tem = tem[item];
      });
      tem.splice(index, 1);
    },
    //crud obj
    addObjAttr(state, { arr, attr, obj }) {
      var tem = state;
      arr.forEach((item) => {
        tem = tem[item];
      });
      if (tem[attr]) {
        return;
      }

      Vue.set(tem, attr, obj);
    },
    deleteObjAttr(state, { arr, attr, obj }) {
      var tem = state;
      arr.forEach((item) => {
        tem = tem[item];
      });

      Vue.delete(tem, attr);
    },

    editObjAttr(state, { arr, newattr, oldattr, obj }) {
      var tem = state;
      arr.forEach((item) => {
        tem = tem[item];
      });
      Vue.delete(tem, oldattr);
      Vue.set(tem, newattr, obj);
    },
    //message
    addMessage(state, payload) {
      if (!state.message.includes(payload)) {
        state.message.push(payload);
      }

      clearTimeout(state.messageTimer);
      state.messageTimer = setTimeout(() => {
        state.warningMessage = [];
        state.message = [];
      }, 3000);
    },
    addWarningMessage(state, payload) {
      if (!state.warningMessage.includes(payload)) {
        state.warningMessage.push(payload);
      }

      clearTimeout(state.messageTimer);
      state.messageTimer = setTimeout(() => {
        state.warningMessage = [];
        state.message = [];
      }, 3000);
    },
    addImportantMessage(state, payload) {
      if (!state.importantMessage.includes(payload)) {
        state.importantMessage.push(payload);
      }
    },

    addHandlingMessage(state, payload) {
      if (!state.handlingMessage.includes(payload)) {
        state.handlingMessage.push(payload);
      }
    },
    closeHandlingMessage(state, payload) {
      state.handlingMessage = [];
    },

    closeMessage(state, payload) {
      clearTimeout(state.messageTimer);
      state.message = [];
      state.handlingMessage = [];
      state.warningMessage = [];
      state.importantMessage = [];
    },
    setNavButtonShow(state, payload) {
      state.navButtonShow = payload;
    },
  },
  actions: {
    actionSetUer(context, payload) {
      context.commit("setUser", payload);
    },
    addDataAction(context, payload) {
      context.commit("addData", payload);
    },
    editDataAction(context, payload) {
      context.commit("editData", payload);
    },
    deleteDataAction(context, payload) {
      context.commit("deleteData", payload);
    },
    setRecordData(context, payload) {
      context.commit("setRecordData", payload);
    },

    deleteObjAttr(context, payload) {
      context.commit("deleteObjAttr", payload);
    },
    editObjAttr(context, payload) {
      context.commit("editObjAttr", payload);
    },
  },
  getters: {},
  modules: {},
});
