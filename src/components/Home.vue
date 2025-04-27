<template>
  <div class="min-h-screen bg-[#7cc7e8] p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-white text-center mb-8 drop-shadow">
        HINACHAT(テスト版)
      </h1>
      <h2 class="text-2xl font-bold text-white text-center mb-8 drop-shadow">
        これはテスト版です
      </h2>

      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="member in members"
          :key="member.id"
          @click="goToChat(member.id)"
          class="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center"
        >
          <img
            :src="member.image"
            :alt="member.name"
            class="rounded-full w-24 h-24 object-cover mb-4"
          />
          <p class="text-center font-semibold text-gray-700">{{ member.name }}</p>
        </div>
      </div>
    </div>
    <div class="text-center mt-3 text-white">
      -更新履歴-
      <div v-for="history in histories" :key="history.date" class="text-white">
        {{ history.date }} {{ history.content }}
      </div>
      <div class="mt-4 text-white">
        1.0.0-alpha.2
      </div>
    </div>
  </div>
</template>

<script>
import { members } from '../data/members';
import { useRouter } from 'vue-router';
import { ref } from 'vue'

export default {
  setup() {
    const histories = ref([
      { date: '2025.04.26', content: 'アルファ版' }
    ]);

    const router = useRouter();
    const goToChat = (id) => {
      router.push(`/chat/${id}`);
    };
    return { members, histories, goToChat };
  }
};
</script>
