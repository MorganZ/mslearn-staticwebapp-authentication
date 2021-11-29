
import { RouteRecordRaw } from 'vue-router';
import home from "./pages/home.vue";

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'App', component: home, },
];

export default routes;