<template>
  <v-sheet
    :light="light"
    :dark="dark"
    rounded
    :height="height"
    class="d-inline-flex flex-row align-center px-3 py-1 accent"
  >
    <Icon :src="user.icon" />
    <h3 class="pl-2">{{ user.name }}</h3>
  </v-sheet>
</template>

<script>
import Icon from "./Icon";
import lightDarkMixin from "../mixins/lightDarkMixin";
export default {
  mixins: [lightDarkMixin],
  components: {
    Icon,
  },
  computed: {
    user() {
      let user = {};
      user.name = "noname";
      user.icon = "noicon";
      if (this.userId) {
        let allUsers = this.$store.state.allUsers;
        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i]._id === this.userId) {
            user.name = allUsers[i].name;
            user.icon = allUsers[i].icon;
            return user;
          }
        }
      }
      return user;
    },
  },
  methods: {},
  data() {
    return {
      // user: {
      //   name: "user name",
      //   icon: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
      // },
    };
  },
  props: {
    userId: {
      type: String,
      default: undefined,
    },
    height: {
      type: String,
      default: "90%",
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
</style>