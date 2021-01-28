<template>
  <v-overlay
    class="ma-0 pa-0 d-flex justify-center align-center"
    :value="value"
    @input="(v) => $emit('input', v)"
    height="100vh"
    width="100vw"
  >
    <v-card
      dark
      :class="'ma-0 d-flex flex-column ' + bgColor"
      max-width="100vw"
    >
      <v-card-title v-if="title">{{ title }}</v-card-title>
      <v-card-subtitle class="d-flex justify-start" v-if="msg"
        ><h3>{{ msg }}</h3></v-card-subtitle
      >
      <v-card-text class="d-flex justify-start" v-if="msg2"
        ><h3>{{ msg2 }}</h3></v-card-text
      >

      <v-container class="modal-content" height="60vh">
        <slot name="content"></slot>
      </v-container>
      <v-card-actions class="">
        <v-container class="d-flex justify-space-between">
          <CustomButton
            v-if="!confirmCancel"
            :onclick="close"
            tooltip="Ok"
            icon="mdi-check"
          ></CustomButton>
          <CustomButton
            v-if="confirmCancel"
            :onclick="cancel"
            tooltip="Cancel"
            icon="mdi-close"
          ></CustomButton>
          <CustomButton
            v-if="confirmCancel"
            :onclick="confirm"
            tooltip="Confirm"
            icon="mdi-check"
          ></CustomButton>
        </v-container>
      </v-card-actions>
    </v-card>
    <slot name="submodal"></slot>
  </v-overlay>
</template>

<script>
import CustomButton from "../forms/CustomButton";
import ModalMixin from "../../mixins/ModalMixin";
export default {
  mixins: [ModalMixin],
  components: {
    CustomButton,
  },
  props: {
    confirmCancel: {
      type: Boolean,
      default: false,
    },
    onConfirm: {
      type: Function,
      default: () => true,
    },
    onConfirmFail: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => true,
    },
    onCancelFail: {
      type: Function,
      default: () => {},
    },
    bgColor: {
      type: String,
      default: "",
    },
  },
  methods: {
    close() {
      this.onClose();
      this.$emit("input", false);
    },
    async confirm() {
      if (await this.onConfirm()) this.close();
      else await this.onConfirmFail();
    },
    async cancel() {
      if (await this.onCancel()) this.close();
      else await this.onCancelFail();
    },
  },
  beforeUpdate() {
    if (this.value) document.body.classList.add("noscroll");
    else document.body.classList.remove("noscroll");
  },
};
</script>

<style>
.noscroll {
  overflow: hidden;
}

.modal-content {
  max-height: 50vh;
  overflow: auto;
}
</style>