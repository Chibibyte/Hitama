<template>
  <RequestModal
    title="Register"
    :value="value"
    @input="(v) => $emit('input', v)"
    :onSuccess="_onSuccess"
    :reqData="reqData"
    :reqPath="reqPath"
    :preConfirm="validate"
    :onClose="onClose"
  >
    <v-container>
      <TextField name="Name" v-model="name" />
      <TextField name="Email" v-model="email" />
      <TextField name="Password" v-model="password" type="password" />
      <TextField name="Repeat Password" v-model="password2" type="password" />
      <IconUpdateField
        :value="newIcon"
        @change="(v) => setData('newIcon', v)"
        :edit="true"
        :iconPath="icon"
      />
    </v-container>
  </RequestModal>
</template>

<script>
import util from "../../util";
import IconUpdateField from "../forms/IconUpdateField";
import testdata from "../../testdata/testdata";
import TextField from "../forms/TextField";
import RequestModal from "./RequestModal";
import api_cmd from "../../api_cmd";
export default {
  components: {
    RequestModal,
    TextField,
    IconUpdateField,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    onSuccess: {
      type: Function,
      default: () => {},
    },
    defaultData: {
      type: Object,
      default: undefined,
    },
  },
  watch: {
    defaultData() {
      if (this.defaultData) {
        let { name, email, password, password2 } = this.defaultData;
        if (name) this.name = name;
        if (email) this.email = email;
        if (password) this.password = password;
        if (password2) this.password2 = password2;
      }
    },
  },
  computed: {
    reqData() {
      if (this.value) {
        return util.reqData(
          { name: "name", value: this.name },
          { name: "email", value: this.email },
          { name: "icon", value: this.newIcon },
          { name: "password", value: this.password }
        );
      }
      return [];
    },
  },
  methods: {
    onClose() {
      this.name = "";
      this.email = "";
      this.password = "";
      this.password2 = "";
      this.icon = undefined;

      if (global.hitama.testmodes.logintest) {
        let { name, email, password, icon } = testdata.loginRegister;
        this.name = name;
        this.email = email;
        this.password = password;
        this.password2 = password;
        this.icon = icon;
      }
    },
    validate() {
      let title = undefined;
      let text = undefined;
      // equal passwords
      if (this.password != this.password2) {
        title = "ValidatorError";
        text = "Passwords need to be equal";
      }

      if (title || text) {
        this.$store.dispatch("showError", { title, text });
        return false;
      }

      return true;
    },
    setData(name, val) {
      if (this[name] == val) return;
      this[name] = val;
    },
    _onSuccess() {
      let { name, email, password, password2 } = this;
      this.onSuccess({ name, email, password, password2 });
    },
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      password2: "",
      reqPath: api_cmd.user.register,
      icon: undefined,

      newIcon: undefined,
    };
  },
  mounted() {
    this.onClose();
  },
};
</script>

<style>
</style>