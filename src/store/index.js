import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      uid: null,
      name: null,
      email: null
    }
  },
  getters: {
    getUser: state => {
      return state.user;
    }
  },
  mutations: {
    setUser(state, userInfo) {
      state.user.uid = userInfo.uid;
      state.user.name = userInfo.name;
      state.user.email = userInfo.email;
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      getState: (key) => Cookies.getJSON(key),
      setState: (key, state) => Cookies.set(key, state, { expires: 3, secure: true })
    })
  ]
})