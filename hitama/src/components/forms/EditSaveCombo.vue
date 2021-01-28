<template>
  <DocEntry row center>
    <v-spacer></v-spacer>

    <CustomButton
      v-if="value"
      :onclick="save"
      tooltip="Update"
      :disabled="!changed"
      icon="mdi-cloud-upload"
      color="green"
      key="0"
    ></CustomButton>

    <v-spacer></v-spacer>

    <CustomButton
      v-if="!value"
      :onclick="toggleEdit"
      :tooltip="value ? 'Cancel' : 'Edit'"
      :icon="value ? 'mdi-close-circle-outline' : 'mdi-file-document-edit'"
      color="info"
      key="1"
    ></CustomButton>

    <CustomButton
      v-if="value"
      :onclick="toggleEdit"
      :tooltip="value ? 'Cancel' : 'Edit'"
      :icon="value ? 'mdi-close-circle-outline' : 'mdi-file-document-edit'"
      color="info"
      key="4"
    ></CustomButton>

    <v-spacer></v-spacer>

    <CustomButton
      v-if="value"
      :onclick="remove"
      tooltip="Delete"
      :disabled="!value"
      color="danger"
      icon="mdi-delete-forever"
      key="2"
    ></CustomButton>

    <v-spacer></v-spacer>
  </DocEntry>
</template>

<script>
import DocEntry from "../DocEntry";
import CustomButton from "./CustomButton";
export default {
  components: {
    CustomButton,
    DocEntry,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    changed: {
      type: Boolean,
      default: false,
    },
    onToggleEditOn: {
      type: Function,
      default: () => {},
    },
    onToggleEditOff: {
      type: Function,
      default: () => {},
    },
    save: {
      type: Function,
      default: () => {},
    },
    remove: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    toggleEdit() {
      let wasOn = this.value;
      this.$emit("input", !this.value);
      setTimeout(() => {
        if (wasOn) this.onToggleEditOff();
        else this.onToggleEditOn();
      }, 100);
    },
  },
};
</script>

<style>
</style>