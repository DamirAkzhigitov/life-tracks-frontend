<template>
  <div>
    <div v-if="rooms && rooms.length">
      <div v-for="room in rooms" :key="room.id">
        <div>{{ room.id }}</div>
        <div>
          <button @click="enterRoom(room)">Войти</button>
        </div>
      </div>
    </div>

    <button @click="onClickCreateRoom">Создать комнату</button>
    <button @click="onClickGetRooms">Поиск комнат</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

let headers = new Headers()

headers.append('Content-Type', 'application/json')
headers.append('Accept', 'application/json')
headers.append('Origin', 'http://localhost:3000')

const socket = ref(null)

const router = useRouter()

const rooms = ref(null)

onMounted(() => {
  socket.value = new WebSocket('ws://localhost:8080')

  socket.value.addEventListener('open', function (event) {
    socket.value.send('Hello Server!')
  })

  socket.value.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)

    document.cookie = `user=${event.data}`
  })

  onClickGetRooms()
})

const enterRoom = async (room) => {
  console.log(`Вход в комнату: #${room.id} `)

  try {
    const response = await fetch('http://localhost:8080/enter', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ id: room.id }),
    })

    rooms.value = await response.json()

    await router.push(`/damir/${room.id}`)
  } catch (e) {
    console.log(e)
  }
}

const onClickCreateRoom = async () => {
  try {
    const response = await fetch('http://localhost:8080/newRoom', {
      credentials: 'same-origin',
    })

    const data = await response.json()

    rooms.value.push(data)
  } catch (e) {
    console.log(e)
  }
}

const onClickGetRooms = async () => {
  try {
    const response = await fetch('http://localhost:8080/rooms', {
      credentials: 'include',
    })

    rooms.value = await response.json()
  } catch (e) {
    console.log(e)
  }
}
</script>
