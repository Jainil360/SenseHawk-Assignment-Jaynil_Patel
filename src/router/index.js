import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase/compat/app";
import 'firebase/compat'
import "firebase/compat/auth";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'my-threads',
  },
  {
    path: '/my-threads',
    name: 'my-threads',
    meta: {
      layout: 'blank',
    },
    meta: { requiresAuth: true },

    component: () => import('@/views/pages/MyThreads.vue'),
   
  },
  
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/pages/signup.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/pages/Login1.vue'),
    meta: {
      layout: 'blank',
    },

  },
  // {
  //   path: '/register',
  //   name: 'register',
  //   component: () => import('@/views/pages/Register.vue'),
  //   meta: {
  //     layout: 'blank',
  //   },
  // },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/Error.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '',
  routes,
})


router.beforeEach((to, from, next) => {
  const authenticatedUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if ( requiresAuth && ! authenticatedUser ) {
      next("login");
  }
  else {
    // firebase.analytics().logEvent('page_view', { type: 'internal' });

      next();
  }
});

export default router
