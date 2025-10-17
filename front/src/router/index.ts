import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Home from '@views/Home.vue';
import UIKit from '@views/UIKit.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  { path: '/ui-kit', name: 'ui-kit', component: UIKit },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
