<template>
  <div class="stream-container">
    <h3>Input Room Name</h3>
    <div class="input-room">
      <el-input v-model="roomId" />
      <el-button
        v-if="!isJoin"
        @click="clickCreateBtn"
        >Create</el-button
      >
      <el-button
        v-if="!isCreate"
        @click="clickJoinBtn"
        >Join</el-button
      >
      <el-button
        v-if="isCreate"
        @click="clickBtn"
        >Select source</el-button
      >
    </div>
    <div
      class="media-container"
      v-if="isCreate"
    >
      <video
        id="screen-sharing"
        class="screen"
      ></video>
      <video
        id="camera"
        class="webcam"
      ></video>
    </div>
    <div
      class="media-container"
      v-if="isJoin"
    >
      <video
        id="watch-stream"
        class="screen"
      ></video>
      <video
        id="watch-streamer"
        class="webcam"
      ></video>
    </div>
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
    const isCreate = ref(false);
    const isJoin = ref(false);
    return {
      screen,
      roomId,
      isCreate,
      isJoin,
    };
  },
  methods: {
    async clickBtn() {
      await (window as Window)?.electronAPI!.getOptions();
    },
    clickCreateBtn() {
      this.isCreate = !this.isCreate;
      (window as Window)?.electronAPI!.joinCamera();
    },
    clickJoinBtn() {
      this.isJoin = !this.isJoin;
      console.log('join');
      (window as Window)?.electronAPI!.joinStream();
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
.media-container {
  display: flex;
  justify-content: space-between;
}
.media-container > .screen {
  max-width: 70%;
}
.media-container > .webcam {
  max-width: 20%;
}
</style>
