import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/pumpMain.vue";
import PumpDetails from "../components/pumpDetails.vue";
import SignInPage from "../auth/SignInPage.vue";
import SignUpPage from "../auth/SignUpPage.vue";
import { useClerk } from "@clerk/vue";

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
    meta: { requiresAuth: true },
    component: PumpDetails,
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

router.beforeEach(async (to, from, next) => {
  const clerk = useClerk();
  if (to.meta.requiresAuth && !clerk.value) {
    return next("/sign-in");
  }
  next();
});

export default router;
