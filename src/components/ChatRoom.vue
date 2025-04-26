<template>
  <div class="flex flex-col h-[80vh] bg-[#e0f7fa]">
    <header class="bg-pink-400 text-white text-lg font-bold p-4 shadow flex justify-between items-center rounded-b-3xl">
      {{ member?.name }}とのチャット
      <button @click="clearChat" class="text-sm bg-white text-pink-400 px-3 py-1 rounded-full shadow hover:bg-gray-100">
        履歴を削除
      </button>
    </header>

    <main class="flex-1 overflow-y-auto p-4">
      <div v-for="(msg, index) in chatHistory" :key="index" class="mb-6">
        <!-- ユーザーの吹き出し -->
        <div class="flex justify-end mb-2">
          <div class="balloon-user">
            {{ msg.user }}
          </div>
        </div>

        <!-- メンバーの吹き出し -->
        <div class="flex justify-start">
          <div class="balloon-member">
            {{ msg.reply }}
          </div>
        </div>
      </div>
    </main>

    <footer class="p-4 bg-white border-t flex items-center rounded-t-3xl">
      <input
        v-model="input"
        @keyup.enter="sendMessage"
        placeholder="メッセージを入力..."
        class="flex-1 p-2 border-2 border-pink-300 rounded-full mr-2 shadow-sm focus:ring-2 focus:ring-pink-300"
      />
      <button @click="sendMessage" class="bg-pink-400 text-pink-400 px-5 py-2 rounded-full shadow hover:bg-pink-300 transition">
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
      if (!input.value.trim()) return;
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
.balloon-user {
  display: flex;
  align-items: center;
  position: relative;
  max-width: 70%;
  margin-right: 15px;
  padding: 0.8em 1.2em;
  border-radius: 20px;
  background-color: #ffccf9;
  color: #333;
  word-break: break-word;
}
.balloon-user::after {
  content: '';
  position: absolute;
  right: 10px; /* ちょっと内側に矢印をつける */
  bottom: -8px; /* 吹き出しのすぐ下に矢印 */
  width: 12px;
  height: 12px;
  background: #ffccf9;
  transform: rotate(45deg);
}

.balloon-member {
  display: flex;
  align-items: center;
  position: relative;
  max-width: 70%;
  margin-left: 15px;
  padding: 0.8em 1.2em;
  border-radius: 20px;
  background-color: #ffffff;
  border: 1px solid #f8bbd0;
  color: #333;
  word-break: break-word;
}
.balloon-member::after {
  content: '';
  position: absolute;
  left: 10px; /* こっちも内側に矢印 */
  bottom: -8px;
  width: 12px;
  height: 12px;
  background: #ffffff;
  border-left: 1px solid #f8bbd0;
  border-bottom: 1px solid #f8bbd0;
  transform: rotate(45deg);
}
</style>
