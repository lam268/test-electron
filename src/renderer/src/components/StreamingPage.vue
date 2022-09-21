<template>
  <div class="streaming-page">
    <h3>Streaming Page</h3>
    <el-button @click="backtoHomepage"> Back to Homepage </el-button>
    <el-button @click="shareScreen"> Share screen </el-button>
    <video></video>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { desktopCapturer } from 'electron'

export default defineComponent({
  name: 'StreamingPage',
  setup() {
    const route = useRoute()
    const { code } = route?.query || {}
    const inputSources = ref([])
    console.log(code)
    return {
      code,
      inputSources
    }
  },
  methods: {
    backtoHomepage() {
      this.$router.replace(`/`)
    },
    async shareScreen() {
      console.log(desktopCapturer)
      const res = await desktopCapturer.getSources({
        types: ['window', 'screen']
      })
      console.log(res)
    }
  }
})
</script>

<style lang="less" scoped>
.el-button {
  margin-top: 15px;
  margin-bottom: 15px;
}
video {
  display: block;
}
</style>
