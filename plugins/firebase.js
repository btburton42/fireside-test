import firebase from 'firebase'
const {fireConfig} = require('../config')()

let fireApp

if (!fireApp && !firebase.apps.length) {
  fireApp = firebase.initializeApp(fireConfig);
} else {
  fireApp = firebase.app();
}

export default fireApp
