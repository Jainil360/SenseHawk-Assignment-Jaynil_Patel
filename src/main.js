import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import firebase from "firebase/compat/app"


import "firebase/compat/analytics";
import VueSweetalert2 from 'vue-sweetalert2'; 
import VueConfetti from 'vue-confetti'

import VueTyperPlugin from 'vue-typer'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'

import 'tiptap-vuetify/dist/main.css'
import 'sweetalert2/dist/sweetalert2.min.css';
require('@/assets/styles/neu.css')
import { getMessaging,getToken } from "firebase/messaging";







var firebaseConfig = {
  apiKey: "AIzaSyCsTDI5rpfB3PE5AXogpCXqeMXehOsBKF0",
  authDomain: "syncbits-90baf.firebaseapp.com",
  projectId: "syncbits-90baf",
  storageBucket: "syncbits-90baf.appspot.com",
  messagingSenderId: "761234310258",
  appId: "1:761234310258:web:f62ef76637fec0fb796eeb",
  measurementId: "G-8FV0PMM4HW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(firebase.initializeApp(firebaseConfig));
getToken(messaging, { vapidKey: 'BJ_OoGsF3bguBoR1jdH6PfwFKrEpZpRB5i3TGHJYDxqmnakwT4m4KnZ1N-rfLD0pSuU_LF_XlyyS9Seu9r7E66M' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});


Vue.config.productionTip = false
Vue.prototype.$analytics = firebase.analytics();


firebase.auth().onAuthStateChanged(function(user) {
  store.dispatch("fetchUser", user);

  // if(user){
  //   firebase.firestore().collection("users-tch").where("uid","==",user.uid) 
  // .get().then(function(doc) {
    
  //   if (doc.docs.length > 0) {
  //     store.dispatch("fetchUser", doc.docs[0].data());
  //   } else {

  //   }
  // }).catch(function(error) {
  //   console.log("Error getting document:", error);
  // });
  // }
  // else

  // {
  //   store.dispatch("fetchUser", user);
  // }

  
  console.log("chnaging state",user);
  new Vue({ 
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app')
//test
  Vue.use(VueSweetalert2);
  Vue.use(VueTyperPlugin);
  Vue.use(VueConfetti);
  Vue.use(TiptapVuetifyPlugin, {
    // the next line is important! You need to provide the Vuetify Object to this place.
    vuetify, // same as "vuetify: vuetify"
    // optional, default to 'md' (default vuetify icons before v2.0.0)
    iconsGroup: 'mdi'
  })
 
  
});


// new Vue({
//   router,
//   store,
//   vuetify,
//   render: h => h(App),
// }).$mount('#app')
