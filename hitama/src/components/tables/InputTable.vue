<template>
  <SearchTable
    :title="title"
    :headers="headers"
    :items="items"
    :orderItems="orderItems"
    :filterItems="filterItems"
    :useFilter="useFilter"
    :searchFilter="searchFilter"
  >
    <template v-slot:other>
      <slot name="other"></slot>
    </template>
    <template v-slot:searchbar>
      <slot name="searchbar"></slot>
      <CustomButton
        v-if="addButton"
        :onclick="addFunction"
        icon="mdi-plus"
        tooltip="Add"
        size="35px"
      ></CustomButton> </template
  ></SearchTable>
</template>

<script>
import CustomButton from "../forms/CustomButton";
import SearchTable from "./SearchTable";
import SearchTableMixin from "../../mixins/SearchTableMixin";
export default {
  mixins: [SearchTableMixin],
  components: {
    SearchTable,
    CustomButton,
  },
  props: {
    addFunction: {
      type: Function,
      default: () => {},
    },
    addButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
</style>