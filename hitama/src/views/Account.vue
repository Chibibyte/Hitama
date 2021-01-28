<template>
  <div class="view-wrapper account">
    <h1>Account</h1>
    <EditSaveCombo
      v-model="edit"
      :changed="changed"
      :onToggleEditOff="refresh"
      :save="save"
      :remove="remove"
    />

    <!-- ############################### ICON ############################### -->
    <DocEntry title="Icon" :color="editColor">
      <IconUpdateField
        updateMode
        :value="newIcon"
        @change="(v) => setData('newIcon', v)"
        :edit="edit"
        :iconPath="icon"
      />
    </DocEntry>
    <v-spacer></v-spacer>
    <!-- ############################### NAME ############################### -->
    <DocEntry title="Name" :color="editColor">
      <TextField
        name="Name"
        :value="name"
        @input="(v) => setData('name', v)"
        :disabled="!edit"
      />
    </DocEntry>
    <v-spacer></v-spacer>
    <!-- ############################### EMAIL ############################### -->
    <DocEntry title="Email" :color="editColor">
      <TextField
        name="Email"
        :value="email"
        @input="(v) => setData('email', v)"
        :disabled="!edit"
      />
      <TextField
        v-if="edit"
        name="Confirm Email"
        :value="email2"
        @input="(v) => setData('email2', v)"
        :disabled="!edit"
      />
    </DocEntry>
    <v-spacer></v-spacer>
    <!-- ############################### PASSWORD ############################### -->
    <DocEntry title="Password" :color="editColor">
      <TextField
        v-if="edit"
        name="Old Password"
        :value="oldPassword"
        @input="(v) => setData('oldPassword', v)"
        :disabled="!edit"
        type="password"
      />
      <TextField
        v-if="!edit"
        name="Password"
        value="XXXX"
        @input="(v) => setData('password', v)"
        :disabled="!edit"
        type="password"
      />
      <TextField
        v-if="edit"
        name="Password"
        :value="password"
        @input="(v) => setData('password', v)"
        :disabled="!edit"
        type="password"
      />
      <TextField
        v-if="edit"
        name="Confirm Password"
        :value="password2"
        @input="(v) => setData('password2', v)"
        :disabled="!edit"
        type="password"
      />
    </DocEntry>

    <EditSaveCombo
      v-model="edit"
      :changed="changed"
      :onToggleEditOff="refresh"
      :save="save"
      :remove="remove"
    />
  </div>
</template>

<script>
import DocEntry from "../components/DocEntry";
import util from "../util";
import EditSaveCombo from "../components/forms/EditSaveCombo";
import TextField from "../components/forms/TextField";
import IconUpdateField from "../components/forms/IconUpdateField";
import updateMixin from "../mixins/updateMixin";
export default {
  mixins: [updateMixin],
  components: {
    TextField,
    IconUpdateField,
    EditSaveCombo,
    DocEntry,
  },
  computed: {
    reqData() {
      return util.reqData(
        { name: "name", value: this.name },
        { name: "email", value: this.email },
        { name: "icon", value: this.newIcon },
        { name: "password", value: this.password }
      );
    },
  },
  methods: {
    async remove() {
      this.$store.dispatch("deleteAccount");
    },
    async save() {
      let data = await this.$store.dispatch("updateAccount", this.reqData);
      if (!data) return;
      this.edit = false;
      this.refresh();
    },
  },
  data() {
    return {
      showOldPw: false,
      showPw: false,
      showPw2: false,
      newIcon: null,

      name: "",
      email: "",
      email2: "",
      oldPassword: "",
      password: "",
      password2: "",
      // icon: require("@/assets/logo.png"),
      icon: undefined,
    };
  },
  mounted() {
    let user = this.$store.state.user;
    this.name = user.name;
    this.email = user.email;
    this._id = user._id;
    this.icon = user.icon;
  },
};
</script>
