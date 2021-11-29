<template>
    <div>test {{ x }}</div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
    setup() {
        const x = ref("test");
        return { x };
    },
};
</script>
