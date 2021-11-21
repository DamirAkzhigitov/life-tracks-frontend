<template>
  <div>
    <div v-if="rooms && rooms.length">
      <div v-for="room in rooms" :key="room.id">
        <div>{{ room.id }}</div>
        <div>members: {{ room.members }}</div>
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
// import { useRouter } from 'vue-router'

let headers = new Headers()

headers.append('Content-Type', 'application/json')
headers.append('Accept', 'application/json')
headers.append('Origin', 'http://localhost:3000')

const socket = ref(null)

// const router = useRouter()

const rooms = ref([])

const auth = async () => {
  try {
    const response = await fetch('http://localhost:8080/auth', {
      method: 'GET',
      credentials: 'include',
    })

    const data = await response.text()

    document.cookie = `user=${data}`
  } catch (e) {
    console.log(e)
  }

  // console.log('enterRoom after rooms.value: ', rooms.value)
}

const enterRoom = async (room) => {
  // console.log(`Вход в комнату: #${room.id} `)
  //
  // console.log('enterRoom before rooms.value: ', rooms.value)

  try {
    const response = await fetch('http://localhost:8080/enter', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ id: room.id }),
    })

    const data = await response.json()

    // console.log(data.text)
  } catch (e) {
    console.log(e)
  }

  console.log('enterRoom after rooms.value: ', rooms.value)
}

const onClickCreateRoom = async () => {
  try {
    const response = await fetch('http://localhost:8080/newRoom', {
      credentials: 'same-origin',
    })

    const data = await response.json()

    // rooms.value.push(data)
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

onMounted(async () => {
  await auth()

  socket.value = new WebSocket('ws://localhost:8080')

  socket.value.addEventListener('open', function (event) {
    // socket.value.send('Hello Server!')
  })

  socket.value.addEventListener('message', function (event) {
    console.log('new message from WS')
    try {
      const roomData = JSON.parse(event.data)

      console.log('message: ', roomData)

      rooms.value = roomData
    } catch (e) {
      console.log('error = ', e)
    }

    // document.cookie = `user=${event.data}`
  })

  await onClickGetRooms()
})
</script>
