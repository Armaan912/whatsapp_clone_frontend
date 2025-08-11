import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Chat from "../views/Chat.vue";
import Profile from "../views/Profile.vue";

const routes = [
  { path: "/", redirect: "/chat" },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/chat", component: Chat, meta: { requiresAuth: true } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Auth guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  
  if (to.meta.requiresAuth && !token) {
    // User needs auth but doesn't have token
    next("/login");
  } else if (token && (to.path === "/login" || to.path === "/signup")) {
    // User has token but trying to access auth pages
    next("/chat");
  } else {
    next();
  }
});

export default router;
