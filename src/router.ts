import Vue from "vue";
import Router from "vue-router";
import ProductionPage from "./views/ProductionPage.vue";
import ResearchPage from "./views/ResearchPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "production",
      component: ProductionPage,
    },
    {
      path: "/research",
      name: "research",
      component: ResearchPage,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
    },
  ],
});
