<template>
  <Modal
    :title="title"
    :value="value"
    @input="(v) => $emit('input', v)"
    :onConfirm="send"
    :confirmCancel="true"
    :onClose="onClose"
  >
    <template v-slot:content>
      <slot></slot>
    </template>
    <template v-slot:submodal>
      <Modal v-model="failModal" :title="failTitle" :msg="failMsg" />
    </template>
  </Modal>
</template>

<script>
import api_cmd from "../../api_cmd";
import Modal from "./Modal";
import ModalMixin from "../../mixins/ModalMixin";
import util from "../../util";
export default {
  mixins: [ModalMixin],
  components: {
    Modal,
  },
  props: {
    onSuccess: {
      type: Function,
      default: () => {},
    },
    reqData: {
      type: Array,
      default: () => [],
    },
    reqPath: {
      type: Object,
      default: api_cmd.user.login,
    },
    preConfirm: {
      type: Function,
      default: () => true,
    },
  },
  methods: {
    async send() {
      if (!this.preConfirm()) return;
      let resData = await api_cmd.api_call(this.reqPath, this.reqData);
      if (!resData) return false;
      let handleRes = util.handleDbError(this.$store, resData);
      if (!handleRes) return false;
      this.onSuccess(resData);
      return true;
    },
  },
  data() {
    return {
      failModal: false,
      failTitle: "",
      failMsg: "",
    };
  },
};
</script>

<style>
</style>