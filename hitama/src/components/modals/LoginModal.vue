<template>
  <RequestModal
    title="Login"
    :value="value"
    @input="(v) => $emit('input', v)"
    :onSuccess="onSuccess"
    :reqData="reqData"
    :reqPath="reqPath"
    :onClose="onClose"
  >
    <v-container>
      <TextField name="Name" v-model="name" />
      <TextField name="Password" v-model="password" type="password" />
    </v-container>
  </RequestModal>
</template>

<script>
import testdata from "../../testdata/testdata";
import TextField from "../forms/TextField";
import RequestModal from "./RequestModal";
import api_cmd from "../../api_cmd";
import util from "../../util";
export default {
  components: {
    RequestModal,
    TextField,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    reqData() {
      if (this.value) {
        return util.reqData(
          { name: "name", value: this.name },
          { name: "password", value: this.password }
        );
      }
      return [];
    },
  },
  watch: {
    defaultData() {
      if (this.defaultData) {
        let { name, password } = this.defaultData;
        if (name) this.name = name;
        if (password) this.password = password;
      }
    },
  },
  methods: {
    onClose() {
      this.name = "";
      this.password = "";

      if (global.hitama.testmodes.logintest) {
        let { name, password } = testdata.loginRegister;
        this.name = name;
        this.password = password;
      }
    },
    async onSuccess(data) {
      this.$store.commit("setOnline", !this.$store.state.online);
      this.$store.commit("setAccount", data);
      util.routerPush(this.$router, "/tasks");
    },
  },
  data() {
    return {
      name: "",
      password: "",
      reqPath: api_cmd.user.login,
    };
  },
  mounted() {
    this.onClose();
  },
};
</script>

<style>
</style>