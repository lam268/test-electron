<script lang="ts">
import {computed, ref, defineComponent} from 'vue';
import {sha256sum} from '#preload';

export default defineComponent({
  name: 'ReactiveHash',
  setup() {
    const rawString = ref('Hello World');
/**
 * window.nodeCrypto was exposed from {@link module:preload}
 */
const hashedString = computed(() => sha256sum(rawString.value));
return {
  rawString,
  hashedString
}
  }
})
</script>

<template>
  <label>
    Raw value
    <input
      v-model="rawString"
      type="text"
    />
  </label>
  <br />
  <label>
    Hashed by node:crypto
    <input
      v-model="hashedString"
      readonly
      type="text"
    />
  </label>
  <br /><br />
  <code>packages/renderer/src/components/ReactiveHash.vue</code>
</template>
