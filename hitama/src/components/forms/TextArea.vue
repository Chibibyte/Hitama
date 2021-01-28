<template>
  <v-card :light="light" :dark="dark" class="ma-0 pa-0">
    <v-textarea
      :disabled="disabled"
      hide-details
      dense
      outlined
      :value="value"
      @input="(v) => $emit('input', v)"
      :hint="`${name}...`"
      :placeholder="`${name}...`"
    ></v-textarea>
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
  },
};
</script>

<style>
</style>