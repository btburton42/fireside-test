import fireApp from '@/plugins/firebase'

export const state = () => ({
  user: null,
  error: null,
  busy: false,
  jobDone: false
})

export const mutations = {
  setUser(state, payload) {
    state.user = payload
  },
  setError(state, payload) {
    state.error = payload
  },
  clearError(state) {
    state.error = null
  },
  setBusy(state, payload) {
    state.busy = payload
  },
  setJobDone(state, payload) {
    state.jobDone = payload
  }
}

export const actions = {
  signUpUser({
    commit
  }, payload) {
    commit('setBusy', true)
    commit('clearError')
    let newUser = null
    fireApp.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(({user}) => {
        newUser = user;
        return user.updateProfile({
          displayName: payload.fullName
        })
          .then(() => {
            const currentUser = {
              id: user.uid,
              email: payload.email,
              name: payload.fullName,
              role: 'consumer'
            }
            commit('setUser', currentUser)
          })
      })
      .then(() => {
        const userData = {
          email: payload.email,
          fullName: payload.fullName,
          createdAt: new Date().toISOString()
        }
        return fireApp.database().ref(`users/${newUser.uid}`).set(userData)
      })
      .then(() => {
        return fireApp.database().ref('groups').orderByChild('name').equalTo('Customer').once('value')
          .then( snapShot => {
            const groupKey = Object.keys(snapShot.val())[0]
            let groupedUser = {}
            groupedUser[newUser.uid] = payload.fullName
            return fireApp.database().ref(`userGroups/${groupKey}`).set(groupedUser)
          })
      })
      .then(() => {
        commit('setBusy', false)
      })
      .catch(err => {
        commit('setBusy', false)
        commit('setError', err)
      })
    commit('setJobDone', true)
    commit('setBusy', false)
  }
}

export const getters = {
  user(state) {
    return state.user
  },
  error(state) {
    return state.error
  },
  busy(state) {
    return state.busy
  },
  jobDone(state) {
    return state.jobDone
  }
}
