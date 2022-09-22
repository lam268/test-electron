<template>
  <div class="stream-container">
    <h3>Input Room Name</h3>
    <div class="input-room">
      <el-input v-model="roomId" />
      <el-button @click="clickShareScreen">Create or join</el-button>
      <el-button
        v-if="shareScreen"
        @click="clickBtn"
        >Select source</el-button
      >
    </div>
    <video></video>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {generateRandomString} from '../utils';
import {Window} from '../interface';

export default defineComponent({
  name: 'ShareScreen',
  async setup() {
    const screen = ref('');
    const roomId = ref(generateRandomString(7));
    const shareScreen = ref(false);
    return {
      screen,
      roomId,
      shareScreen,
    };
  },
  methods: {
    async clickBtn() {
      await (window as Window)?.electronAPI!.getOptions();
    },
    clickShareScreen() {
      this.shareScreen = !this.shareScreen;
    },
  },
});
</script>

<style lang="css" scoped>
.el-select {
  margin-right: 15px;
}
.input-room > .el-button {
  margin-top: 10px;
}
.input-room {
  margin-bottom: 15px;
}
</style>
