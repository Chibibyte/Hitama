<template>
  <v-card>
    <v-row class="ma-0 pa-0" width="100%">
      <v-col class="ma-0 pa-0" cols="6">
        <UserTable
          :items="itemsLeft"
          title="GroupList"
          :createItem="createItemLeft"
        />
      </v-col>
      <v-col class="ma-0 pa-0">
        <UserTable
          :items="_itemsAll"
          title="UserList"
          :createItem="createItemAll"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import util from "../../util";
import UserTable from "./UserTable";
export default {
  components: {
    UserTable,
  },
  computed: {
    itemsLeft() {
      return this.value;
    },
    _itemsAll() {
      let out = this.itemsAll.filter((item, index) => {
        return !this.itemsLeft.includes(item);
      });
      return out;
    },
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    itemsAll: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    createItemLeft(_id) {
      let item = { _id };
      item.onclick = () => {
        let index = this.itemsLeft.indexOf(_id);
        let out = [...this.itemsLeft];
        out.splice(index, 1);
        this.$emit("input", out);
      };
      return item;
    },
    createItemAll(_id) {
      let item = { _id };
      item.onclick = () => {
        this.$emit("input", [...this.itemsLeft, _id]);
      };
      return item;
    },
  },
};
</script>

<style>
</style>