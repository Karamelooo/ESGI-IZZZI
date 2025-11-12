import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Home from '@views/public/Home.vue';
import Pricing from '@views/public/Pricing.vue';
import UIKit from '@views/public/UIKit.vue';
import Auth from '@views/auth/Auth.vue';
import ChangePassword from '@views/auth/ChangePassword.vue';
import ForgotPassword from '@views/auth/ForgotPassword.vue';
import ClassesList from '@views/classes/ClassesList.vue';
import Survey from '@views/public/Survey.vue';

const routes: Array<RouteRecordRaw> = [
  /* Public Routes */
  { path: '/', name: 'home', component: Home },
  { path: '/pricing', name: 'pricing', component: Pricing },
  { path: '/ui-kit', name: 'ui-kit', component: UIKit },
  { path: '/survey', name: 'survey', component: Survey },

  /* Auth Routes */
  { path: '/auth', name: 'login', component: Auth },
  { path: '/auth/change-password', name: 'change-password', component: ChangePassword },
  { path: '/auth/forgot-password', name: 'forgot-password', component: ForgotPassword },

  /* Classes Routes */
  { path: '/classes', name: 'classes-list', component: ClassesList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
