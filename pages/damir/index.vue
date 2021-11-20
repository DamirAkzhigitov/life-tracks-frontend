<template>
  <div>
    <div v-for="room in rooms" :key="room.id">
      <div>{{ room.name }}</div>
      <div>
        <button @click="enterRoom(room)">Войти</button>
      </div>
    </div>

    <button @click="fetchSomething">fetch</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const socket = ref(null)

const rooms = ref([
  {
    name: 'Комната 1',
    id: 1,
  },
  {
    name: 'Комната 1',
    id: 2,
  },
])

onMounted(() => {
  socket.value = new WebSocket('ws://localhost:8080')

  socket.value.addEventListener('open', function (event) {
    socket.value.send('Hello Server!')
    socket.value.send('Hello Server2!')
  })

  socket.value.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
  })
})

const enterRoom = (room) => {
  console.log(`Вход в комнату: #${room.id} `)
}

const fetchSomething = async () => {
  socket.value.send('Hello Server!')

  console.log('socket.value: ', socket.value)
  // await fetch('http://localhost:8080/damir', {
  //   headers: {
  //     Accept:
  //       'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  //     'Accept-Language': 'en-US,ru-RU;q=0.8,ru;q=0.5,en;q=0.3',
  //     'Upgrade-Insecure-Requests': '1',
  //     'Sec-Fetch-Dest': 'document',
  //     'Sec-Fetch-Mode': 'navigate',
  //     'Sec-Fetch-Site': 'none',
  //     'Sec-Fetch-User': '?1',
  //     'Cache-Control': 'max-age=0',
  //   },
  //   method: 'GET',
  //   mode: 'no-cors',
  // })
}
</script>

<style scoped></style>
