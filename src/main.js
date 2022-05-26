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
 //your firebase config
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


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
