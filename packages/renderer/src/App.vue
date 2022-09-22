<script lang="ts" setup>
import ShareScreen from '/@/components/ShareScreen.vue';
</script>

<template>
  <Suspense>
    <fieldset>
      <legend>Test share screen</legend>
      <share-screen />
    </fieldset>
  </Suspense>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
