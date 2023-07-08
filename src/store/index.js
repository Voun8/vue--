import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  getters: {
  },
  mutations: {
    updateToken (state, value) {
      state.token = value
      console.log(state.token)
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})

// vuex默认保存在内存中，所以刷新所有的值会回归初始化（无法做到持久存储）
// 借助npm i --legacy-peer-deps vuex-persistedstate@3.2.1这个包可以让vuex做持久化存储
