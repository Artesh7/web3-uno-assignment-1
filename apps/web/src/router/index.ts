import { createRouter, createWebHistory } from "vue-router";
import SetupView from "../views/SetupView.vue";
import PlayView from "../views/PlayView.vue";
import GameOverView from "../views/GameOverView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "setup", component: SetupView },
    { path: "/play", name: "play", component: PlayView },
    { path: "/gameover", name: "gameover", component: GameOverView }
  ]
});

export default router;
