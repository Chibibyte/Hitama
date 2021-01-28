<template>
  <RequestModal
    title="Create Task"
    :value="value"
    @input="(v) => $emit('input', v)"
    :onSuccess="onSuccess"
    :reqData="reqData"
    :reqPath="reqPath"
    :onClose="onClose"
  >
    <v-container>
      <TextField name="Title" v-model="task.title" />
      <TextArea name="Description" v-model="task.description" />
      <ImageField
        name="Icon"
        :value="task.icon"
        @change="(v) => (task.icon = v)"
      />
      <v-checkbox v-model="task.public" color="red" label="Public"></v-checkbox>
    </v-container>
  </RequestModal>
</template>

<script>
import TextField from "../forms/TextField";
import TextArea from "../forms/TextArea";
import ImageField from "../forms/ImageField";
import RequestModal from "./RequestModal";
import api_cmd from "../../api_cmd";
import util from "../../util";
export default {
  components: {
    RequestModal,
    TextField,
    TextArea,
    ImageField,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    subtask: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    reqPath() {
      return this.subtask ? api_cmd.task.createSubtask : api_cmd.task.create;
    },
    reqData() {
      if (this.value) {
        return util.reqData(
          { name: "_id", value: this.$store.state.task._id },
          { name: "title", value: this.task.title },
          { name: "description", value: this.task.description },
          { name: "icon", value: this.task.icon },
          { name: "public", value: this.task.public }
        );
      }
      return [];
    },
  },
  watch: {
    defaultData() {
      if (this.defaultData) {
        let { name, password } = this.defaultData;
        if (name) this.name = name;
        if (password) this.password = password;
      }
    },
  },
  methods: {
    onSuccess(data) {
      this.$store.dispatch("openTask", data._id);
    },
    onClose() {
      this.task.title = "";
      this.task.description = "";
      this.task.icon = undefined;
      this.task.public = true;
    },
  },
  data() {
    return {
      task: {
        title: "",
        description: "",
        icon: undefined,
        public: true,
      },
    };
  },
};
</script>

<style>
</style>