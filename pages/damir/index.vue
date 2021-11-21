<template>
  <div>
    <div v-if="rooms && rooms.length">
      <div v-for="room in rooms" :key="room.id" class="room">
        <div>{{ room.id }}</div>
        <div>members: {{ room.members }}</div>
        <div>свободно мест: {{ room.max - room.members.length }}</div>
        <div>
          <button v-if="!inRoom(room)" @click="enterRoom(room)">Войти</button>
          <button v-if="isUserCanStartGame(room)" @click="startGame(room)">
            Начать игру
          </button>
        </div>
      </div>
    </div>
    <div class="button-container">
      <button @click="onClickCreateRoom">Создать комнату</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { RoomItem } from '~/models'
const currentUser: Ref<string> = ref('')
// import { useRouter } from 'vue-router'

let headers = new Headers()

headers.append('Content-Type', 'application/json')
headers.append('Accept', 'application/json')
headers.append('Origin', 'http://192.168.1.68:3000')

const socket = ref(null)

const rooms: Ref<RoomItem[]> = ref([])

const inRoom = (room: RoomItem) => {
  return room.members.find((member) => member.id === currentUser.value)
}

const isUserCreator = (room: RoomItem) => {
  console.log('currentUser.value: ', currentUser.value)

  const isCurrentUserCreator = room.members.filter((member) => {
    return member.id === currentUser.value && member.creator
  })

  return !!isCurrentUserCreator.length
}

const isUserCanStartGame = (room: RoomItem) => {
  const isCreator = isUserCreator(room)

  return isCreator && room.members.length > 1
}

const startGame = (room: RoomItem) => {
  console.log(`star game at room ${room.id}`)
}

const auth = async () => {
  const oldAuth = localStorage.getItem('auth')

  if (oldAuth) {
    document.cookie = `user=${oldAuth}`

    currentUser.value = oldAuth

    return
  }

  try {
    const response = await fetch('http://192.168.1.68:8080/auth', {
      method: 'GET',
      credentials: 'include',
    })

    const data = await response.text()

    localStorage.setItem('auth', data)

    currentUser.value = data

    document.cookie = `user=${data}`
  } catch (e) {
    console.log(e)
  }
}

const enterRoom = async (room: RoomItem) => {
  try {
    await fetch('http://192.168.1.68:8080/enter', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({ id: room.id }),
    })
  } catch (e) {
    console.log(e)
  }
}

const onClickCreateRoom = async () => {
  try {
    await fetch('http://192.168.1.68:8080/newRoom', {
      credentials: 'include',
    })
  } catch (e) {
    console.log(e)
  }
}

const onClickGetRooms = async () => {
  try {
    const response = await fetch('http://192.168.1.68:8080/rooms', {
      credentials: 'include',
    })

    rooms.value = await response.json()
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  await auth()

  socket.value = new WebSocket('ws://192.168.1.68:8080')

  socket.value.addEventListener('open', function () {
    // socket.value.send('Hello Server!')
  })

  socket.value.addEventListener('message', function (event) {
    console.log('new message from WS')
    try {
      rooms.value = JSON.parse(event.data)
    } catch (e) {
      console.log('error = ', e)
    }

    // document.cookie = `user=${event.data}`
  })

  await onClickGetRooms()
})
</script>

<style scoped>
.room {
  border: 1px solid black;
  padding: 20px;
  margin: 10px;
}
.button-container {
  padding: 20px;
  margin: 10px;
}
</style>
