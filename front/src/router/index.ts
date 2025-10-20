import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Home from '@views/public/Home.vue';
import Login from '@views/public/Login.vue';
import UIKit from '@views/utils/UIKit.vue';
import PageComponents from '@views/utils/PageComponents.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/ui-kit', name: 'ui-kit', component: UIKit },
  { path: '/page-components', name: 'page-components', component: PageComponents },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
