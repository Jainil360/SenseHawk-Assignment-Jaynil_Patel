import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase/compat/app";
import 'firebase/compat'
import "firebase/compat/auth";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'my-blogs',
  },
  {
    path: '/my-blogs',
    name: 'my-blogs',
    meta: {
      layout: 'blank',
    },
    meta: { requiresAuth: true },

    component: () => import('@/views/pages/MyBlogs.vue'),
   
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
    path: '/highlightedWords',
    name: 'highlightedWords',
    component: () => import('@/views/pages/HighlightedWords.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/blog/:id',
    name: 'blog',
    component: () => import('@/views/pages/BlogPage.vue'),
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
