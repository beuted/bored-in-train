import Vue from "vue";
import Toasted from "vue-toasted";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

Vue.use<any>(<any>Toasted, {
  position: "top-right",
  duration: 5000,
});
