import fireApp from '@/plugins/firebase'

export const state = () => ({
  groups: []
})

export const mutations = {
  loadGroups (state, payload) {
    state.grops.push(payload)
  }
}

export const actions = {
  createGroup ({commit}, payload) {
    commit('setBusy', true, {root: true})
    commit('clearError', null, {root: true})
    fireApp.database().ref('groups').push(payload)
    .then(() => {
      commit('setBusy', false, {root: true})
      commit('setJobDone', true, {root: true})
    })
    .catch((e) => {
      commit('setBusy', false, {root: true})
      commit('setError', e, {root: true})
    })
  }
}

export const getters = {
  groups (state) {
    return state.groups
  }
}
