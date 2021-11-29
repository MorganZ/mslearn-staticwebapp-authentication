<template>
    <div>test</div>
    <component :is="layout">
        <router-view />
    </component>
    <hello></hello>
</template>
<script lang="ts">
import { computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import defaultlayout from "./pages/layouts/default-layout.vue";
import nolayout from "./pages/layouts/no-layout.vue";
import hello from "./components/ _template.vue";

export default {
    components: {
        "default-layout": defaultlayout,
        "no-layout": nolayout,
        hello
    },
    setup() {
        const route = useRoute();
        let layout = computed(() => {
            return (route.meta.layout || "default") + "-layout";
        });
        return { layout };
    },
};
</script>
