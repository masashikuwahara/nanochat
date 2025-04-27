<template>
  <div class="flex flex-col h-screen bg-[#7cc7e8]">
    <header class="bg-pink-400 text-white text-lg font-bold p-4 shadow flex justify-between items-center">
      <span>{{ member?.name }}とのチャット</span>
      <button @click="clearChat" class="text-sm bg-white text-pink-500 px-3 py-1 rounded-full shadow hover:bg-gray-100">
        履歴を削除
      </button>
    </header>

    <main class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-for="(msg, index) in chatHistory" :key="index" class="flex flex-col space-y-2">
        <div class="self-end">
          <div class="balloon-user">{{ msg.user }}</div>
        </div>
        <div class="self-start">
          <div class="balloon-member">{{ msg.reply }}</div>
        </div>
      </div>
    </main>

    <footer class="p-4 bg-white border-t flex items-center">
      <input
        v-model="input"
        @keyup.enter="sendMessage"
        placeholder="メッセージを入力..."
        class="flex-1 p-2 border rounded-full mr-2 shadow"
      />
      <button @click="sendMessage" class="bg-pink-400 text-white px-4 py-2 rounded-full shadow">
        送信
      </button>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { members } from '../data/members';
import { replyPatterns } from '../data/replyPatterns';

export default {
  setup() {
    const route = useRoute();
    const memberId = route.params.memberId;
    const member = members.find((m) => m.id === memberId);

    const input = ref('');
    const chatHistory = ref([]);

    onMounted(() => {
      const saved = localStorage.getItem(`chat_${memberId}`);
      if (saved) chatHistory.value = JSON.parse(saved);
    });

    const sendMessage = () => {
      if (!input.value) return;
      const userMsg = input.value;
      const patterns = replyPatterns[memberId] || [];
      let reply = 'うんうん〜';
      for (const p of patterns) {
        if (userMsg.includes(p.keyword)) {
          reply = p.replies[Math.floor(Math.random() * p.replies.length)];
          break;
        }
      }
      chatHistory.value.push({ user: userMsg, reply });
      localStorage.setItem(`chat_${memberId}`, JSON.stringify(chatHistory.value));
      input.value = '';
    };

    const clearChat = () => {
      if (confirm('このメンバーとのチャット履歴を削除しますか？')) {
        chatHistory.value = [];
        localStorage.removeItem(`chat_${memberId}`);
      }
    };

    return { member, input, chatHistory, sendMessage, clearChat };
  }
};
</script>

<style scoped>
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 共通設定 */
.balloon-user,
.balloon-member {
  display: flex;
  align-items: center;
  position: relative;
  margin: 8px;
  padding: 0.8em 1.2em;
  border-radius: 24px;
  word-break: break-word;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.4s ease;
}

/* 自分側 */
.balloon-user {
  background-color: #ffccf9;
  color: #333;
  margin-left: auto;
  margin-right: 15px;
}
.balloon-user::after {
  content: '';
  position: absolute;
  right: 18px;
  bottom: -6px;
  width: 14px;
  height: 14px;
  background: #ffccf9;
  transform: rotate(45deg);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

/* 相手側 */
.balloon-member {
  background-color: #ffffff;
  border: 1px solid #f8bbd0;
  color: #333;
  margin-right: auto;
  margin-left: 15px;
}
.balloon-member::after {
  content: '';
  position: absolute;
  left: 18px;
  bottom: -6px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-left: 1px solid #f8bbd0;
  border-bottom: 1px solid #f8bbd0;
  transform: rotate(45deg);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
}

/* 吹き出しの幅をデバイスごとに調整 */
@media (min-width: 640px) {
  /* スマホ以上（タブレット・PC） */
  .balloon-user,
  .balloon-member {
    max-width: 75%;
  }
}

@media (max-width: 639px) {
  /* スマホサイズ */
  .balloon-user,
  .balloon-member {
    max-width: 85%;
  }
}
</style>
