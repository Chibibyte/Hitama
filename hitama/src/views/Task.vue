<template>
  <div class="view-wrapper task">
    <h1>{{ task.title }}</h1>

    <!-- ############################   SAVE/EDIT   ############################-->

    <EditSaveCombo
      v-if="$store.getters.canEdit"
      v-model="edit"
      :changed="changed"
      :onToggleEditOff="refresh"
      :save="save"
      :remove="remove"
    />

    <!-- ############################   TITLE   ############################-->
    <DocEntry dark title="Title" :color="editColor">
      <TextField
        name="Title"
        :light="edit"
        :value="task.title"
        @input="(v) => setData('title', v, task)"
        :disabled="!edit"
      />
    </DocEntry>

    <!-- ############################   DESCRIPTION   ############################-->
    <DocEntry dark title="Description" :color="editColor">
      <TextArea
        :light="edit"
        :disabled="!edit"
        :value="task.description"
        @input="(v) => setData('description', v, task)"
        name="Description..."
      />
    </DocEntry>

    <DocEntry>
      <v-row width="100%">
        <v-col cols="3" height="100%">
          <DocEntry dark height="100%" spaceBetween>
            <!-- ############################   ICON   ############################-->
            <DocEntry title="Icon" row centerTitle :color="editColor">
              <IconUpdateField
                updateMode
                :value="newIcon"
                @change="(v) => setData('newIcon', v)"
                :edit="edit"
                :iconPath="task.icon"
              />
            </DocEntry>
            <!-- ############################   PUBLIC   ############################-->
            <DocEntry title="Public" row centerTitle :color="editColor">
              <v-checkbox
                :disabled="!edit"
                v-model="task.public"
                @change="(v) => setData('public', v, task, true)"
                color="red"
              ></v-checkbox>
            </DocEntry>
            <DocEntry title="Complete" row centerTitle :color="editColor">
              <v-checkbox
                :disabled="!edit"
                v-model="task.complete"
                @change="(v) => setCompletion(v)"
                color="red"
              ></v-checkbox>
            </DocEntry>
          </DocEntry>
        </v-col>

        <v-col v-if="!edit"></v-col>

        <v-col :cols="edit ? '6' : '3'">
          <!-- ############################   GROUP   ############################-->
          <DocEntry dark height="100%">
            <DocEntry title="Group" v-if="!edit">
              <UserTable :items="users" />
            </DocEntry>
            <DocEntry title="Group" v-if="edit" :color="editColor">
              <DoubleUserTable
                :itemsAll="allUserIds"
                v-model="task.group"
                @input="(v) => setData('group', v, task, true)"
              />
            </DocEntry>
          </DocEntry>
        </v-col>

        <v-col v-if="!edit"></v-col>

        <v-col cols="3">
          <DocEntry dark height="100%" spaceBetween>
            <!-- ############################   OWNER   ############################-->
            <DocEntry
              title="Owner"
              row
              spaceBetween
              :color="editColor"
              @click.native="
                () => {
                  if (edit) {
                    newOwner = task.owner;
                    editOwner = true;
                  }
                }
              "
            >
              <User light :userId="task.owner" />
            </DocEntry>
            <!-- ############################   DATES   ############################-->
            <DocEntry title="Creation" row spaceBetween>
              <DateBlock v-model="task.createdAt" />
            </DocEntry>
            <DocEntry title="Last Update" row spaceBetween>
              <DateBlock v-model="task.updatedAt" />
            </DocEntry>
          </DocEntry>
        </v-col>
      </v-row>
    </DocEntry>

    <!-- ############################   TASKS   ############################-->

    <DocEntry title="Tasks">
      <TaskTable :items="tasks" inTask :addButton="canCreateTask()" />
    </DocEntry>

    <EditSaveCombo
      v-if="$store.getters.canEdit"
      v-model="edit"
      :changed="changed"
      :onToggleEditOff="refresh"
      :save="save"
      :remove="remove"
    />

    <Modal
      title="Change owner"
      v-model="editOwner"
      :onConfirm="
        () => {
          setData('owner', newOwner, task, true);
          return true;
        }
      "
      confirmCancel
    >
      <template v-slot:content>
        <User light :userId="newOwner" height="3.5rem" />
        <v-card class="ma-0 pa-0" height="80%">
          <UserTable
            :items="allOtherUserIds"
            v-model="newOwner"
            :createItem="createItem"
          />
        </v-card>
      </template>
    </Modal>
  </div>
</template>


<script>
import Modal from "../components/modals/Modal";
import DateBlock from "../components/DateBlock";
import DoubleUserTable from "../components/tables/DoubleUserTable";
import IconUpdateField from "../components/forms/IconUpdateField";
import util from "../util";
import EditSaveCombo from "../components/forms/EditSaveCombo";
import TaskTable from "../components/tables/TaskTable";
import UserTable from "../components/tables/UserTable";
import User from "../components/User";
import updateMixin from "../mixins/updateMixin";
import api_cmd from "../api_cmd";
import TextField from "../components/forms/TextField";
import TextArea from "../components/forms/TextArea";
import DocEntry from "../components/DocEntry";
export default {
  mixins: [updateMixin],
  components: {
    TaskTable,
    UserTable,
    User,
    IconUpdateField,
    EditSaveCombo,
    TextField,
    TextArea,
    DocEntry,
    DoubleUserTable,
    DateBlock,
    Modal,
  },
  methods: {
    createItem(_id) {
      let clItem = { _id };
      clItem.onclick = () => (this.newOwner = _id);
      return clItem;
    },
    setCompletion(v) {
      setTimeout(() => {
        if (this.task.complete && this.task.tasks.length > 0) {
          // check subs
          let completion = true;
          let subtasks = this.$store.state.subtasks;

          subtasks.forEach((sub) => {
            if (!sub.complete) completion = false;
          });
          if (!completion) {
            this.$store.dispatch("showWarning", {
              title: "Incomplete subtasks",
              text: "Task can only be completed if all subtasks are complete!",
            });

            this.task.complete = false;

            return;
          }
        }
        this.setData("complete", this.task.complete, this.task, true);
      }, 100);
    },
    canCreateTask() {
      let { task, user } = this.$store.state;
      return this.$store.getters.canEdit || this.task.group.includes(user._id);
    },
    async remove() {
      this.$store.dispatch("deleteTask", [
        { name: "_id", value: this.task._id },
        { name: "title", value: this.task.title },
      ]);
    },
    async save() {
      let data = await this.$store.dispatch(
        this.isSubtask() ? "updateSubtask" : "updateTask",
        this.reqData
      );
      if (!data) return;
      this.edit = false;
      this.refresh();
    },
    prepItems(statePath, itemOnClickCreator) {
      let items = [];
      this.$store.state[statePath].forEach((data) => {
        let item = {};
        util.copyObj(item, data);
        item.onclick = itemOnClickCreator(item);
        items.push(item);
      });
      return items;
    },
    isSubtask() {
      return this.$store.state.task.parent;
    },
  },
  computed: {
    allOtherUserItems() {
      let items = this.allOtherUserIds.map((user) => {
        let clItem = { _id: user };
        clItem.onclick = () => this.$store.dispatch("user clicked", user);
        return clItem;
      });
      return items;
    },
    allOtherUserIds() {
      let allOtherUsers = [...this.allUserIds];
      let userIndex = this.allUserIds.indexOf(this.$store.state.user._id);
      allOtherUsers.splice(userIndex, 1);
      return allOtherUsers;
    },
    allUserIds() {
      let allIds = this.$store.state.allUsers.map((user) => user._id);
      return allIds.filter((_id) => _id != this.task.owner);
    },
    reqData() {
      return util.reqData(
        { name: "_id", value: this.$store.state.task._id },
        { name: "title", value: this.task.title },
        { name: "description", value: this.task.description },
        { name: "icon", value: this.newIcon },
        { name: "public", value: this.task.public },
        { name: "group", value: this.task.group },
        { name: "complete", value: this.task.complete },
        { name: "owner", value: this.task.owner }
      );
    },
    tasks() {
      return this.prepItems("subtasks", (item) => {
        return () => {};
      });
    },
    users() {
      return this.task.group;
    },
  },
  data() {
    return {
      util,
      newOwner: undefined,
      editOwner: false,
      task: {
        title: "t_title",
        description: "t_description",
        icon:
          "http://images3.wikia.nocookie.net/__cb20090925183818/zelda/images/9/91/Ganon_%28Four_Swords_Adventures%29.png",
        public: false,
        tasks: [],
        parent: "t_parent",
        owner: "t_owner",
        group: [],
        createdAt: "t_createdAt",
        updatedAt: "t_updatedAt",
        complete: false,
        _id: this.$store.state.task._id,
      },
      newIcon: undefined,

      isOwner: this.$store.getters.isOwner,
    };
  },
  async mounted() {
    util.copyObj(this.task, this.$store.state.task);
  },
};
</script>

<style>
</style>


