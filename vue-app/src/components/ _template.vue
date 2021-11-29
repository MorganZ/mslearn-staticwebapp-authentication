<template>
    <h1>{{ msg }}</h1>
    <button @click="count++">count is: {{ count }}</button>
    <p>
        Edit <code>components/HelloWorld.vue</code> to test hot module
        replacement.
    </p>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";

export default {
    name: "HelloWorld",
    conponents: {},
    props: {
        msg: String,
    },
    setup() {
        let count= ref(0);
        return {
            count,
        };
    },
};
</script>
