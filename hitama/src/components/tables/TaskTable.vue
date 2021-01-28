<template>
  <InputTable
    :title="title"
    :headers="headers"
    :items="_items"
    :orderItems="orderItems"
    :filterItems="filterItems"
    useFilter
    :addFunction="() => (showCreateTask = true)"
    :addButton="addButton"
    :searchFilter="_searchFilter"
  >
    <template v-if="rootGroupMode" v-slot:searchbar>
      <v-card dark class="ma-0 pa-0">
        <v-radio-group
          class="ma-0 pa-0"
          v-model="rootgroupselector"
          row
          hide-details
        >
          <v-radio label="All" value="all" dense></v-radio>
          <v-radio label="Root" value="root" dense></v-radio>
          <v-radio label="Group" value="group" dense></v-radio>
        </v-radio-group>
      </v-card>
    </template>
    <template v-slot:other>
      <CreateTaskModal
        :defaultData="taskData"
        v-model="showCreateTask"
        :subtask="inTask"
      />
    </template>
  </InputTable>
</template>

<script>
import util from "../../util";
import InputTable from "./InputTable";
import CreateTaskModal from "../modals/CreateTaskModal";
export default {
  components: {
    InputTable,
    CreateTaskModal,
  },
  computed: {
    _items() {
      let items = this.items;
      if (this.rootGroupMode) {
        let combinedObj = {};
        // no filter required, just override existing in combinedObj
        if (this.rootgroupselector !== "group") {
          this.rootItems.forEach((task) => (combinedObj[task._id] = task));
        }
        if (this.rootgroupselector !== "root") {
          this.groupItems.forEach((task) => (combinedObj[task._id] = task));
        }
        items = Object.values(combinedObj);
      }
      let clickItems = items.map((item) => {
        let clItem = {};
        util.copyObj(clItem, item);
        clItem.onclick = () => this.$store.dispatch("openTask", item._id);
        return clItem;
      });
      return clickItems;
    },
  },
  methods: {
    _searchFilter(items, value) {
      return items.filter((item) => item.title.includes(value));
    },
  },
  props: {
    addButton: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    taskData: {
      type: Object,
      default: undefined,
    },
    inTask: {
      type: Boolean,
      default: false,
    },
    rootItems: {
      type: Array,
      default: () => [],
    },
    groupItems: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    rootGroupMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rootgroupselector: "all",
      showCreateTask: false,
      headers: [
        { name: "icon", value: "Icon", type: "img" },
        { name: "title", value: "Title" },
        { name: "public", value: "Public", type: "bool" },
        { name: "owner", value: "Owner", type: "user" },
        { name: "createdAt", value: "Creation", type: "date" },
        { name: "updatedAt", value: "Changed", type: "date" },
        { name: "complete", value: "Complete", type: "bool" },
      ],
      orderItems: [1, 3, 4, 5],
      filterItems: [
        { name: "all", value: () => true, text: "All" },
        { name: "complete", value: true, text: "Complete" },
        { name: "complete", value: false, text: "Incomplete" },
        { name: "public", value: true, text: "Public" },
        { name: "public", value: false, text: "Private" },
        {
          name: "owner",
          value: (_id) => _id === this.$store.state.user._id,
          text: "Owner",
        },
        {
          name: "group",
          value: (group) => group.includes(this.$store.state.user._id),
          text: "Group",
        },
        {
          name: "owner",
          value: (_id) => _id !== this.$store.state.user._id,
          text: "Other",
        },
      ],
    };
  },
};
</script>

<style>
</style>