import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser (state, uid) {
      state.user = uid;
    }
  },
  actions: {

  }
});
