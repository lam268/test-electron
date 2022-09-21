<template>
  <div class="homepage-contaner">
    <h3>Homepage</h3>
    <el-input v-model="roomName" />
    <el-button @click="createRoom">Create room</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Homepage',
  setup() {
    const roomName = ref('')

    return {
      roomName
    }
  },
  methods: {
    createRoom() {
      if (this.roomName) {
        this.$router.push(`/stream?code=${this.roomName}`)
      }
    }
  }
})
</script>

<style lang="less" scoped>
.el-input {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
