import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';
import Home from '../views/Home.vue'
import Tasks from '../views/Tasks.vue'
import Task from '../views/Task.vue'
import Account from '../views/Account.vue'
import Redirect from '../views/Redirect.vue'

Vue.use(VueRouter)

/**
 * Creates generic redirect middleware for accessing
 * online pages in offline state
 * Allows chaining methods
 * 
 * @param {String} redirectName 
 */
function onOfflineEnter(redirectName) {
  return function (to, from, next, chain = false) {
    if (!store.state.online) return next({ name: redirectName })
    if (chain) return;
    next()
  }
}

/**
 * Creates generic redirect middleware for accessing
 * offline pages in online state
 * Allows chaining methods
 * 
 * @param {String} redirectName 
 */
function onOnlineEnter(redirectName) {
  return function (to, from, next, chain = false) {
    if (store.state.online) return next({ name: redirectName })
    if (chain) return;
    next()
  }
}


const routes = [
  // redirect path
  {
    path: '/redirect',
    name: 'Redirect',
    component: Redirect,
  },

  // Offline paths
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: onOnlineEnter('Tasks'),
  },


  // Online paths
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    beforeEnter: async function (to, from, next) {
      onOfflineEnter('Home')(to, from, next, true);
      await store.dispatch("loadAllUsers");
      await store.dispatch("loadAllTasks");
      await store.dispatch("loadUserGroupTasks");
      next();
    }
  },
  {
    path: '/task',
    name: 'Task',
    component: Task,
    beforeEnter: async function (to, from, next) {
      onOfflineEnter('Home')(to, from, next, true);
      await store.dispatch("loadAllUsers");
      await store.dispatch('loadTask', store.state.task._id);
      next();
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter: async function (to, from, next) {
      onOfflineEnter('Home')(to, from, next, true);
      await store.dispatch("loadAllUsers");
      await store.dispatch("loadAccount");
      next();
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: function (to, from, next) {
      next();
    }
  },
  {
    path: '*',
    beforeEnter: function (to, from, next) {
      next({ name: 'Home' });
    }
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from) => {
  if (from.name && to.path === '/redirect') return router.push(from.path);
  document.body.scrollTop = 0;
})

export default router
