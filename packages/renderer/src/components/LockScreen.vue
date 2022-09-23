<template>
    <div>
        <el-button @click="lockScreen">Lock Keyboard</el-button>
        <el-button id="lock-mouse" @click="lockMouse">Lock Mouse</el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Window } from '../interface';

export default defineComponent({
    name: 'LockScreen',
    setup() {
        const locked = ref(false)
        const lockedMouse = ref(false)
        return {
            locked,
            lockedMouse
        }
    },
    methods: {
        lockScreen() {
            this.locked = !this.locked;
            (window as Window).electronAPI.lockKeyboard(this.locked)
        },
        lockMouse() {  
            this.lockedMouse = !this.lockedMouse;
            (window as Window).electronAPI.lockMouse(this.lockedMouse)
        }
    }
})
</script>