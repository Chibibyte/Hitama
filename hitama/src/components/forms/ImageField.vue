<template>
  <v-file-input
    :light="light"
    :dark="dark"
    :value="value"
    @change="(v) => $emit('change', v)"
    accept="image/*"
    :label="name"
    prepend-icon="mdi-camera"
    outlined
    width="100px"
  ></v-file-input>
</template>

<script>
import lightDarkMixin from "../../mixins/lightDarkMixin";
export default {
  mixins: [lightDarkMixin],
  props: {
    value: {
      type: File,
      default: undefined,
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