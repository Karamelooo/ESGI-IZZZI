import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Home from '@views/public/Home.vue';
import UIKit from '@views/utils/UIKit.vue';
import PageComponents from '@views/utils/PageComponents.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  { path: '/ui-kit', name: 'ui-kit', component: UIKit },
  { path: '/page-components', name: 'page-components', component: PageComponents },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
