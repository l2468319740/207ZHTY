import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/simulation",
    },
    {
      path: "/simulation",
      name: "simulation",
      component: () => import("@/views/simulation/index.vue"),
      meta: {
        title: "红蓝博弈推演系统",
      },
    },
  ],
});

// 路由切换后更新页面标题
router.afterEach((to) => {
  document.title = `${to.meta.title ?? "207zhty"}`;
});

export default router;
