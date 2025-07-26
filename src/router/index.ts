import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/pumpMain.vue";
import PumpDetails from "../components/pumpDetails.vue";
import SignInPage from "../auth/SignInPage.vue";
import SignUpPage from "../auth/SignUpPage.vue";
import { useClerk } from "@clerk/vue";
import { watch } from "vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/pump-page/:id",
    name: "pump-page",
    component: PumpDetails,
    meta: { requiresAuth: true },
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignInPage,
  },
  {
    path: "/sign-in/sso-callback",
    name: "sso-callback",
    component: SignInPage,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUpPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const clerk = useClerk();
  const checkAuth = () => {
    return new Promise((resolve) => {
      if (clerk?.value?.loaded) {
        resolve(clerk.value.user !== null);
      } else {
        const unwatch = watch(
          () => clerk?.value?.loaded,
          (loaded) => {
            if (loaded) {
              unwatch();
              resolve(clerk?.value?.user !== null);
            }
          }
        );
      }
    });
  };
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (!requiresAuth) {
    return next();
  }
  const isSignedIn = await checkAuth();
  if (requiresAuth && !isSignedIn) {
    return next({ path: "/sign-in", query: { redirect: to.fullPath } });
  }
  next();
});

export default router;
