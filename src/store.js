import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    information: null,
  },
  mutations: {
    setUser (state, uid) {
      state.user = uid;
    },
    setUserInformation (state, information) {
      state.information = information;
    }
  },
  actions: {

  }
});
