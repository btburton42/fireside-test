export const state = () => ({
  user: null,
  counter: 0
})

export const mutations = {
  setCounter (state, payload) {
    state.counter = state.counter + payload
  }
}

export const actions = {
  increment ({commit}, payload) {
    commit('setCounter', payload)
  }
}

export const getters = {
  counter (state) {
    return state.counter
  }
}
