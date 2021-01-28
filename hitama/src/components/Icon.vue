<template>
  <img class="_icon" width="50" height="50" :src="src" alt="icon" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
    },
  },
};
</script>

<style>
._icon {
  border-radius: 50% !important;
}
</style>