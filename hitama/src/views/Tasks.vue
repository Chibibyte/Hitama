<template>
  <div class="view-wrapper tasks">
    <h1>Tasks</h1>
    <DocEntry title="Icon">
      <TaskTable
        rootGroupMode
        :rootItems="rootTasks"
        :groupItems="groupTasks"
        addButton
      />
    </DocEntry>
  </div>
</template>

<script>
import DocEntry from "../components/DocEntry";
import TaskTable from "../components/tables/TaskTable";
import util from "../util";
export default {
  components: {
    TaskTable,
    DocEntry,
  },
  data() {
    return {
      rootgroupselector: "all",
    };
  },
  methods: {
    taskPrep(task) {
      let item = {};
      util.copyObj(item, task);
      item.onclick = () => this.$store.dispatch("openTask", item._id);
      return item;
    },
  },
  computed: {
    rootTasks() {
      return Object.values(this.$store.state.allTasks).map((task) =>
        this.taskPrep(task)
      );
    },
    groupTasks() {
      return Object.values(this.$store.state.userGroupTasks).map((task) =>
        this.taskPrep(task)
      );
    },
    // tasks() {
    //   if (this.$store.state.testmode) {
    //     return [];
    //   }
    //   // get roottasks and userGroupTasks
    //   let { allTasks, userGroupTasks } = this.$store.state;

    //   let items = [];
    //   Object.values(combinedObj).forEach((task) => {
    //     let item = {};
    //     util.copyObj(item, task);
    //     item.onclick = () => this.$store.dispatch("openTask", item._id);
    //     items.push(item);
    //   });
    //   return items;
    // },
  },
};
</script>

<style>
</style>
