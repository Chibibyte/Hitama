<template>
  <v-container class="d-flex flex-row justify-center">
    <Icon v-if="updateMode" :src="iconPath" />
    <Icon v-if="edit" :src="newIconPath" />
    <ImageField
      v-if="edit"
      :light="light"
      :dark="dark"
      name="Upload Icon"
      :value="value"
      @change="(v) => imageChanged(v)"
    />
  </v-container>
</template>

<script>
import lightDarkMixin from "../../mixins/lightDarkMixin";
import Icon from "../Icon";
import ImageField from "../forms/ImageField";
export default {
  mixins: [lightDarkMixin],
  components: {
    Icon,
    ImageField,
  },
  props: {
    updateMode: {
      type: Boolean,
      default: false,
    },
    value: {
      type: File,
      default: undefined,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    iconPath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      newIconPath: "",
    };
  },
  methods: {
    imageChanged(file) {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          this.newIconPath = reader.result;
          this.$emit("change", file);
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style>
</style>