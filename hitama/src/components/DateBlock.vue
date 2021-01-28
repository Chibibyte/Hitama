<template>
  <div class="text-center">
    <h3 class="text-center">
      {{ date }}
    </h3>
    <h3 class="text-center">
      {{ time }}
    </h3>
  </div>
</template>

<script>
import util from "../util";
export default {
  computed: {
    dateTime() {
      return util.formatDate(this.value);
    },
    date() {
      return this.dateTime.date;
    },
    time() {
      return this.dateTime.time;
    },
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
</style>