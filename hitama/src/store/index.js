import Vue from 'vue'
import Vuex from 'vuex'
import util from '../util';
import api_cmd from '../api_cmd';
import router from '@/router';


Vue.use(Vuex)

/**
 * Handler for api-requests, the corresponding db-errors, and next processing step. 
 * 
 * @param {*} context 
 * @param {Object} apiPath Path object from @createApiPath in @api_cmd
 * @param {Array} apiInput Api request input data, array of objects, see @api_cmd
 * @param {String} storeSetMethod Store method, for setting values after an update
 * @param {Boolean} hideError If set, doesn't show InfoModal containing error data
 * 
 * @returns {Boolean} true on success, else false
 */
async function handleApiCallAction(context, apiPath, apiInput, storeSetMethod, hideError = false) {
  let data = await api_cmd.api_call(apiPath, apiInput);
  if (!util.handleDbError(context, data, hideError)) return false;
  if (storeSetMethod) context.commit(storeSetMethod, data);
  return true;
}

/**
 * Handles storing array data
 * 
 * @param {*} state 
 * @param {String} arrPath key of array in store state object
 * @param {Array} data Data to store in array
 */
function handleSetArray(state, arrPath, data) {
  while (state[arrPath].length > 0) state[arrPath].pop();

  try {
    if (data) state[arrPath].push(...data);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Opens InfoModal, placed in @App (App.vue) with data
 * from @param1
 * 
 * @param {*} context 
 * @param {Object} param1 Input data for InfoModal
 * @param {String} type Type of Info (info, warning, danger, success)
 */
function showInfo(context, { title, text, ...rest }, type = 'info') {
  context.commit('setShowInfo', { title, text, type, value: true, ...rest });
}

/**
 * @ShowInfo
 */
function showWarning(context, data) {
  showInfo(context, data, 'warning');
}

/**
 * @ShowInfo
 */
function showError(context, data) {
  showInfo(context, data, 'danger');
}

/**
 * @ShowInfo
 */
function showSuccess(context, data) {
  showInfo(context, data, 'success');
}

/**
 * Opens InfoModal for deletion requests
 * 
 * @param {*} context 
 * @param {Object} api_cmd_deletePath @api_cmd
 * @param {Object} api_input @api_cmd
 * @param {String} storeSetMethod @handleApiCallAction
 * @param {Function} onSuccess Optional method after successful deletion
 * @param {String} successText Displayed in InfoModal on success, after warning
 * @param {String} warningTitle 
 * @param {String} warningText 
 */
function deleteWithWarning(context, api_cmd_deletePath, api_input, storeSetMethod, onSuccess, successText = 'Deletion complete!', warningTitle = 'Deletion-Warning!', warningText = 'Are you sure?') {
  context.dispatch('showWarning', {
    title: warningTitle,
    text: warningText,
    confirmCancel: true,
    onConfirm: async () => {
      let delAccRes = await handleApiCallAction(context, api_cmd_deletePath, api_input, storeSetMethod);
      if (delAccRes) {
        showSuccess(context, { title: 'Success', text: successText });
        if (onSuccess) onSuccess(context);
      }
    }
  })
}

/**
 * Slightly shorter than util.replaceFalsy
 */
function replShort(a, b) {
  return util.replaceFalsy(a, b);
}

/**
 * Default @task for store
 */
let taskDefault = {
  title: "store_title",
  description: "store_description",
  icon: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
  public: true,
  tasks: [],
  parent: undefined,
  owner: "store_owner",
  group: [],
  createdAt: "store_createdAt",
  updatedAt: "store_updatedAt",
  _id: undefined,
  complete: false,
  access: { read: false, write: false }
}

export default new Vuex.Store({
  state: {
    online: false,
    showInfo: false,
    infoConfirmCancel: false,
    infoOnConfirm: () => { },
    infoColor: '',
    infoTitle: undefined,
    infoText: undefined,
    infoText2: undefined,
    task: util.copyObj({}, taskDefault),
    subtasks: [],
    userGroupTasks: [],
    allTasks: [],
    user: {
      _id: 'store_user_id',
    },
    allUsers: []
  },
  getters: {
    /**
     * Check if owner of current state
     * 
     * @param {*} state 
     */
    isOwner(state) {
      return state.task.owner === state.user._id;
    },
    isInGroup(state) {
      return state.task.group.includes(state.user._id);
    },
    canEdit(state) {
      return (state.task.access && state.task.access.write);
    }
  },
  mutations: {
    // Set to show online or offline data
    setOnline(state, val) {
      state.online = val;
    },
    // Set task to default
    clearTask(state) {
      util.copyObj(state.task, taskDefault);
    },
    // Override store task with @task
    setTask(state, task) {
      util.copyObj(state.task, task);
    },
    // Override store allTasks with @tasks
    setAllTasks(state, tasks) {
      handleSetArray(state, 'allTasks', tasks);
    },
    // Override store allUsers with @users
    setAllUsers(state, users) {
      handleSetArray(state, 'allUsers', users);
    },
    // Override store subtasks with @tasks
    setSubtasks(state, tasks) {
      handleSetArray(state, 'subtasks', tasks);
    },
    // Override store subtasks with @tasks
    setUserGroupTasks(state, tasks) {
      handleSetArray(state, 'userGroupTasks', tasks);
    },

    // Clear store data and set to offline
    clearAll(state) {
      handleSetArray(state, 'allTasks', []);
      handleSetArray(state, 'allUsers', []);
      handleSetArray(state, 'subtasks', []);
      handleSetArray(state, 'userGroupTasks', []);
      util.copyObj(state.task, taskDefault);
      state.user = {};
      state.online = false;
    },
    // Override store user with @user
    setAccount(state, user) {
      state.user._id = user._id;
      state.user.name = user.name;
      state.user.email = user.email;
      state.user.icon = user.icon;
    },


    // set data for InfoModal
    setShowInfo(state, data) {
      let { title, text, text2, value, type, confirmCancel, onConfirm } = data;
      if (value) {
        state.infoTitle = replShort(title, '');
        state.infoText = replShort(text, '');
        state.infoText2 = replShort(text2, '');
        state.infoConfirmCancel = replShort(confirmCancel, false);
        state.infoOnConfirm = replShort(onConfirm, () => { });
      }
      state.showInfo = value;
      state.infoColor = type;
    },

  },
  actions: {
    showInfo(context, data) {
      showInfo(context, data);
    },
    showWarning(context, data) {
      showWarning(context, data);
    },
    showError(context, data) {
      showError(context, data);
    },
    showSuccess(context, data) {
      showSuccess(context, data);
    },
    async logout(context) {
      let data = await handleApiCallAction(context, api_cmd.user.logout, undefined, 'clearAll');
      if (data) util.routerPush(router, "/");
    },
    async deleteAccount(context) {
      deleteWithWarning(context, api_cmd.user.deleteAccount, undefined, undefined,
        async () => await context.dispatch('logout'), 'Deletion complete!', `You are about to delete your account!`);
    },
    async loadAccount(context, hideError = false) {
      return await handleApiCallAction(context, api_cmd.user.readAccount, undefined, 'setAccount', hideError);
    },
    async updateAccount(context, user) {
      return await handleApiCallAction(context, api_cmd.user.updateAccount, user, 'setAccount');
    },
    async deleteTask(context, task) {
      let title = "";
      task.forEach(({ name, value }) => {
        if (name === 'title') title = value;
      })
      deleteWithWarning(context, api_cmd.task.delete, task, undefined,
        () => {
          context.commit('clearTask');
          util.routerPush(router, "/tasks");
        },
        'Deletion complete!', `You are about to delete task "${title}"!`);
    },
    async updateTask(context, task) {
      return await handleApiCallAction(context, api_cmd.task.update, task, 'setTask');
    },
    async updateSubtask(context, task) {
      return await handleApiCallAction(context, api_cmd.task.updateSubtask, task, 'setTask');
    },
    // Load task from @taskId and set store task
    async loadTask(context, taskId) {
      // try owner/group
      let taskSet = await handleApiCallAction(context, api_cmd.task.read, [{ name: '_id', value: taskId }], 'setTask', true);

      // try public
      if (!taskSet) taskSet = await handleApiCallAction(context, api_cmd.task.readPublic, [{ name: '_id', value: taskId }], 'setTask');
      if (taskSet) return context.dispatch('loadSubtasks', taskId);
      return false;
    },
    // Load,Set task with @taskId and Show in '/task' page
    async openTask(context, taskId) {
      let taskData = await context.dispatch("loadTask", taskId); // reload taskdata
      if (!taskData) return false;
      util.routerPush(router, "/task");
      return true;
    },
    async loadAllTasks(context) {
      return await handleApiCallAction(context, api_cmd.task.readAllTasks, undefined, 'setAllTasks');
    },
    async loadAllUsers(context) {
      return await handleApiCallAction(context, api_cmd.user.readAllUsers, undefined, 'setAllUsers');
    },
    async loadSubtasks(context, taskId) {
      return await handleApiCallAction(context, api_cmd.task.readSubtasksData, [{ name: '_id', value: taskId }], 'setSubtasks');
    },
    async loadUserGroupTasks(context, taskId) {
      return await handleApiCallAction(context, api_cmd.task.readSelfGroupTaskData, undefined, 'setUserGroupTasks');
    }
  },
  modules: {
  }
})
