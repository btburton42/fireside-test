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
      .then(({
        user
      }) => {
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
          .then(snapShot => {
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
  },
  loginUser({
    commit
  }, payload) {
    commit('setBusy', true)
    commit('clearError')
    fireApp.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(({user}) => {
        console.log(user)
        const authUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName
        }
        return fireApp.database().ref('groups').orderByChild('name').equalTo('Administrator').once('value')
          .then(snapShot => {
            const groupKey = Object.keys(snapShot.val())[0]
            return fireApp.database().ref(`userGroups/${groupKey}`).child(`${authUser.id}`).once('value')
              .then(ugroupSnap => {
                if (ugroupSnap.exists()) {
                  authUser.role = 'admin'
                } else {
                  authUser.role = 'customer'
                }
                commit('setUser', authUser)
                commit('setBusy', false)
                commit('setJobDone', true)
              })
          })
      })
      .catch(e => {
        commit('setBusy', false)
        commit('setError', e)
      })
  }
}

export const getters = {
  user(state) {
    return state.user
  },
  loginStatus(state) {
    return state.user !== null && state.user !== undefined
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
