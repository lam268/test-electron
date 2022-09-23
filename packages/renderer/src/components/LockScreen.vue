<template>
    <div>
        <el-button @click="lockScreen">Lock Screen</el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Window } from '../interface';

export default defineComponent({
    name: 'LockScreen',
    setup() {
        const locked = ref(false)
        return {
            locked
        }
    },
    methods: {
        lockScreen() {
            this.locked = !this.locked;
            (window as Window).electronAPI.lockKeyboard(this.locked)
        }
    }
})
</script>