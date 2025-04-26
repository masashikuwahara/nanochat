import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue'; // メンバー選択画面
import ChatRoom from '../components/ChatRoom.vue'; // チャット画面

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/chat/:memberId',
    name: 'ChatRoom',
    component: ChatRoom
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;