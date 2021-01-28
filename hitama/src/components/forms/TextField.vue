<template>
  <v-card :light="light" :dark="dark" class="ma-0 pa-0">
    <v-text-field
      :ref="name"
      hide-details
      dense
      outlined
      :placeholder="`${name}...`"
      :value="value"
      @input="(v) => $emit('input', v)"
      :type="_type"
      :append-icon="passwordIcon"
      @click:append="showPw = !showPw"
      :disabled="disabled"
    ></v-text-field>
  </v-card>
</template>

<script>
import lightDarkMixin from "../../mixins/lightDarkMixin";
export default {
  mixins: [lightDarkMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
  },
  computed: {
    _type() {
      if (this.type === "password") return this.showPw ? "text" : "password";
      return "text";
    },
    passwordIcon() {
      if (this.type === "password")
        return this.showPw ? "mdi-eye" : "mdi-eye-off";
      return undefined;
    },
  },
  data() {
    return {
      showPw: false,
    };
  },
};
</script>

<style>
</style>