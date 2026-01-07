import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Home from '@views/public/Home.vue';
import Pricing from '@views/public/Pricing.vue';
import SubscriptionConfirmation from '@views/public/SubscriptionConfirmation.vue';
import UIKit from '@views/public/UIKit.vue';
import Auth from '@views/auth/Auth.vue';
import ChangePassword from '@views/auth/ChangePassword.vue';
import ForgotPassword from '@views/auth/ForgotPassword.vue';
import Register from '@views/auth/Register.vue';
import ClassesList from '@views/classes/ClassesList.vue';
import ClassView from '@views/classes/ClassView.vue';
import SubjectsList from '@views/subjects/SubjectsList.vue';
import SubjectCreate from '@views/subjects/SubjectCreate.vue';
import Dashboard from '@views/dashboard/Dashboard.vue';
import FormView from '@views/forms/FormView.vue';
import Profile from '@views/profile/Profile.vue';
import { useAuthStore } from '@stores/auth';

const routes: Array<RouteRecordRaw> = [
  /* Public Routes */
  { path: '/', name: 'home', component: Home },
  { path: '/pricing', name: 'pricing', component: Pricing },
  { path: '/pricing/confirm', name: 'subscription-confirmation', component: SubscriptionConfirmation },
  { path: '/ui-kit', name: 'ui-kit', component: UIKit },

  /* Auth Routes */
  { path: '/auth', name: 'login', component: Auth },
  { path: '/register', name: 'register', component: Register }, // Invitation registration
  { path: '/auth/change-password', name: 'change-password', component: ChangePassword },
  { path: '/auth/forgot-password', name: 'forgot-password', component: ForgotPassword },

  /* Classes Routes */
  { path: '/classes', name: 'classes-list', component: ClassesList },
  { path: '/classes/:id', name: 'class-view', component: ClassView },

  /* Subjects Routes */
  { path: '/classes/:id/subjects', name: 'subject-list', component: SubjectsList },
  { path: '/classes/:id/subjects/new', name: 'subject-create', component: SubjectCreate },

  /* Dashboard Routes */
  { path: '/dashboard', name: 'dashboard', component: Dashboard },

  /* Form Routes */
  { path: '/form/:id', name: 'form', component: FormView },

  /* Profile Routes */
  { path: '/profile', name: 'profile', component: Profile },
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
