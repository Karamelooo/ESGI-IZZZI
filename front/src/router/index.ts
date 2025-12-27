import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Home from '@views/public/Home.vue';
import Pricing from '@views/public/Pricing.vue';
import UIKit from '@views/public/UIKit.vue';
import Survey from '@views/public/Survey.vue';
import Auth from '@views/auth/Auth.vue';
import ChangePassword from '@views/auth/ChangePassword.vue';
import ForgotPassword from '@views/auth/ForgotPassword.vue';
import ClassesList from '@views/classes/ClassesList.vue';
import ClassCreate from '@views/classes/ClassCreate.vue';
import ClassView from '@views/classes/ClassView.vue';
import ClassEdit from '@views/classes/ClassEdit.vue';
import Dashboard from '@views/dashboard/Dashboard.vue';
import { useAuthStore } from '@stores/auth';

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
  { path: '/classes/new', name: 'class-create', component: ClassCreate },
  { path: '/classes/:id', name: 'class-view', component: ClassView },
  { path: '/classes/:id/edit', name: 'class-edit', component: ClassEdit },

  /* Dashboard Routes */
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.fetchMe();
  }

  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    next('/classes');
    return;
  }

  next();
});

export default router;
