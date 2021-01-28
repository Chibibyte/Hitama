<template>
  <InputTable
    :headers="headers"
    :items="users"
    :orderItems="orderItems"
    :filterItems="filterItems"
    :title="title"
    :searchFilter="_searchFilter"
  >
  </InputTable>
</template>

<script>
import InputTable from "./InputTable";
export default {
  components: {
    InputTable,
  },
  computed: {
    users() {
      return this.items.map((_id) => {
        if (this.createItem) return this.createItem(_id);
        else return { _id };
      });
    },
  },
  methods: {
    _searchFilter(items, value) {
      // get users from store for names
      let allUsers = this.$store.state.allUsers;
      // filter out users not in items
      let listUsers = allUsers.filter((user) => this.items.includes(user._id));
      // filter by value
      let filtered = listUsers.filter((user) => user.name.includes(value));
      // map to ids
      let filterIds = filtered.map((user) => user._id);
      // filter from items
      return items.filter((user) => filterIds.includes(user._id));
    },
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    userData: {
      type: Object,
      default: undefined,
    },
    inTask: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    createItem: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      headers: [{ name: "_id", value: "User", type: "user" }],
      orderItems: [0],
      filterItems: [],
    };
  },
};
</script>

<style>
</style>