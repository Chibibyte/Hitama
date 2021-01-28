<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <div
        style="display: inline-block"
        v-bind="attrs"
        v-on="tooltip ? on : {}"
      >
        <v-btn
          fab
          :width="buttonWidth"
          :height="buttonHeight"
          :disabled="disabled"
          :color="color"
          :class="'custom-button ' + `${textColor}--text`"
          @click="onclick"
          >{{ text }}
          <Icon v-if="img" :src="img"></Icon>
          <v-icon v-else-if="icon">{{ icon }}</v-icon>
        </v-btn>
      </div>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
import Icon from "../Icon";
export default {
  components: {
    Icon,
  },
  computed: {
    buttonWidth() {
      return this.text ? "80px" : this.iconSize;
    },
    buttonHeight() {
      return this.text ? "40px" : this.iconSize;
    },
  },
  data() {
    return {
      iconSize: this.size ? this.size : "50px",
    };
  },
  props: {
    img: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "white",
    },
    textColor: {
      type: String,
      default: "black",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
    onclick: {
      type: Function,
      default: () => {},
    },
    tooltip: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
</style>