<template>
  <div id="app">
    <v-app>
      <v-app-bar dark v-if="online" light app>
        <v-container fluid class="d-flex flex-row justify-space-between">
          <CustomButton
            :color="buttonColor('/tasks')"
            :onclick="() => nav('/tasks')"
            icon="mdi-clipboard-list-outline"
            tooltip="Tasks"
          ></CustomButton>
          <CustomButton
            :color="buttonColor('/task')"
            :onclick="() => nav('/task')"
            tooltip="Active Task"
            :disabled="!taskId"
            icon="mdi-file-document"
          ></CustomButton>
          <CustomButton
            :color="buttonColor()"
            :onclick="() => this.$store.dispatch('openTask', parentId)"
            tooltip="Parent Task"
            :disabled="!parentId"
            icon="mdi-file-document-multiple"
          ></CustomButton>
          <CustomButton
            :color="buttonColor('/account')"
            :onclick="() => nav('/account')"
            tooltip="Account"
            icon="mdi-account-circle"
            :img="$store.state.user.icon"
          ></CustomButton>
          <CustomButton
            :color="buttonColor('/logout')"
            :onclick="() => $store.dispatch('logout')"
            tooltip="Logout"
            icon="mdi-logout"
          ></CustomButton>
        </v-container>
      </v-app-bar>
      <v-main>
        <v-card height="100%" dark fluid class="ma-0 px-3 py-1">
          <button v-if="$store.state.testmode" @click="toggleOnline">
            ToggleOnline
          </button>
          <router-view />
          <Modal
            :confirmCancel="$store.state.infoConfirmCancel"
            :onConfirm="$store.state.infoOnConfirm"
            :value="$store.state.showInfo"
            :title="$store.state.infoTitle"
            :bgColor="$store.state.infoColor"
            :msg="$store.state.infoText"
            :msg2="$store.state.infoText2"
            @input="(v) => $store.commit('setShowInfo', { value: false })"
          />
        </v-card>
      </v-main>
    </v-app>
  </div>
</template>

<script>
// @ is an alias to /src
import util from "./util";
import Modal from "./components/modals/Modal";
import CustomButton from "./components/forms/CustomButton";
export default {
  name: "App",
  components: { Modal, CustomButton },
  computed: {
    parentId() {
      return this.$store.state.task.parent;
    },
    taskId() {
      return this.$store.state.task._id;
    },
    online() {
      return this.$store.state.online;
    },
  },
  methods: {
    toggleOnline() {
      this.$store.commit("setOnline", !this.$store.state.online);
    },
    nav(path) {
      util.routerPush(this.$router, path);
    },
    isCurrentPath(path) {
      return this.$router.currentRoute.path === path;
    },
    buttonColor(path) {
      if (!path) return "info";
      return this.isCurrentPath(path) ? "success" : "info";
    },
  },
  data() {
    return {
      util,
    };
  },
  async mounted() {
    // request user data
    let acc = await this.$store.dispatch("loadAccount", true);
    if (acc) {
      this.$store.commit("setOnline", true);
      this.nav("/tasks");
    }
  },
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.view-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-wrapper > * {
  margin-bottom: 2rem !important;
}

.custom-button {
  font-family: monospace;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>