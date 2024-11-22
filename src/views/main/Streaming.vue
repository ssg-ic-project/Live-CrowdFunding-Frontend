<!-- src/views/main/Streaming.vue -->
<template>
    <div class="streaming-page">
      <h2>스트리밍 페이지</h2>
      <div v-if="stream">
        <h3>{{ stream.title }}</h3>
        <img :src="stream.thumbnail" :alt="stream.title" class="stream-thumbnail" />
        <p>방송자: {{ stream.company }}</p>
        <p>일정: {{ stream.schedule || stream.date }}</p>
        <p>{{ stream.description }}</p>
        <div class="player-placeholder">
          스트리밍 플레이어가 여기에 표시됩니다.
        </div>
        <button @click="goBack">뒤로가기</button>
      </div>
      <div v-else>
        <p>스트리밍 정보를 불러오는 중입니다...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Streaming',
    data() {
      return {
        stream: null,
      };
    },
    created() {
      this.fetchStreamData();
    },
    methods: {
      fetchStreamData() {
        const streamId = this.$route.params.streamId;
        const allStreams = [
          {
            id: 1,
            title: '실시간 스트리밍 방송 1',
            thumbnail: 'https://via.placeholder.com/600x400?text=Streaming+1',
            company: '회사A',
            schedule: '2024-12-01 14:00',
            description: '이것은 실시간 스트리밍 방송 1의 설명입니다.',
          },
          {
            id: 2,
            title: '실시간 스트리밍 방송 2',
            thumbnail: 'https://via.placeholder.com/600x400?text=Streaming+2',
            company: '회사B',
            schedule: '2024-12-01 15:00',
            description: '이것은 실시간 스트리밍 방송 2의 설명입니다.',
          },
          {
            id: 3,
            title: '실시간 스트리밍 방송 3',
            thumbnail: 'https://via.placeholder.com/600x400?text=Streaming+3',
            company: '회사C',
            schedule: '2024-12-01 16:00',
            description: '이것은 실시간 스트리밍 방송 3의 설명입니다.',
          },
   
          {
            id: 101,
            title: 'VOD 스트리밍 방송 1',
            thumbnail: 'https://via.placeholder.com/600x400?text=Streaming+VOD+1',
            company: '회사F',
            date: '2024-11-25',
            description: '이것은 VOD 스트리밍 방송 1의 설명입니다.',
          },
          {
            id: 102,
            title: 'VOD 스트리밍 방송 2',
            thumbnail: 'https://via.placeholder.com/600x400?text=Streaming+VOD+2',
            company: '회사G',
            date: '2024-11-20',
            description: '이것은 VOD 스트리밍 방송 2의 설명입니다.',
          },
         
        ];
  
        const foundStream = allStreams.find(s => s.id === parseInt(streamId));
  
        if (foundStream) {
          this.stream = foundStream;
        } else {s
          alert('스트리밍 정보를 찾을 수 없습니다.');
          this.$router.push({ name: 'Home' });
        }
      },
      goBack() {
        this.$router.back();
      },
    },
  };
  </script>
  
  <style scoped>
  .streaming-page {
    padding: 2rem;
    text-align: center;
  }
  
  .stream-thumbnail {
    width: 80%;
    max-width: 600px;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  .player-placeholder {
    width: 80%;
    max-width: 800px;
    height: 450px;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem auto;
    border-radius: 8px;
    color: #555;
    font-size: 1.25rem;
  }
  
  button {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background-color: #6c757d;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #5a6268;
  }
  </style>
  