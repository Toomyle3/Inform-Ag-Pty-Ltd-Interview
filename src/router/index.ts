import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "../components/pumpMain.vue";
import SignInPage from "../auth/SignInPage.vue";
import SignUpPage from "../auth/SignUpPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HelloWorld,
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

export default router;
