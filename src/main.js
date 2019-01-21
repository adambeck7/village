import Vue from 'vue';
import './plugins/vuetify';
import './registerServiceWorker';
// import './plugins/vuetify';
import App from './App.vue';
import router from './router';
// import store from './store';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
// import 'mdi/font';
// import 'roboto-fontface/css/roboto/roboto-fontface.css';

Vue.config.productionTip = false;

// new Vue({
//   router,
//   // store,
//   render: h => h(App)
// }).$mount('#app');
let app = '';
// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDcxyKhZYNSAEcxNEA7azM8Gx4oigo6gHI',
  authDomain: 'village-messaging.firebaseapp.com',
  databaseURL: 'https://village-messaging.firebaseio.com',
  projectId: 'village-messaging',
  storageBucket: 'village-messaging.appspot.com',
  messagingSenderId: '1054601568102'
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});
