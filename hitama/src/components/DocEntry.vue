<template>
  <v-card
    :light="light"
    :dark="dark"
    width="100%"
    :height="height"
    :class="styleClasses"
    :color="color"
  >
    <h3 :class="titleClasses">{{ title }}</h3>
    <slot></slot>
  </v-card>
</template>

<script>
import lightDarkMixin from "../mixins/lightDarkMixin";
export default {
  mixins: [lightDarkMixin],
  props: {
    color: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    row: {
      type: Boolean,
      default: false,
    },

    spaceBetween: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
    centerTitle: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "",
    },
  },
  computed: {
    styleClasses() {
      let cls = "pa-0 ma-0 py-1 px-1  secondary text-left";
      if (this.row) cls += " d-inline-flex";
      if (this.center) {
        if (this.row) cls += " justify-center align-center";
        else cls += " d-flex flex-column justify-center align-center";
      }
      if (this.spaceBetween) cls += " justify-space-between";
      return cls;
    },
    titleClasses() {
      let cls = "text-left text-no-wrap";
      if (this.row) cls += " mr-2";
      if (this.centerTitle) cls += " align-self-center";
      return cls;
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>