<template>
  <div>
    <div class="box">Current user {{ currentUser }}</div>

    <div v-if="rooms && rooms.length">
      <div v-for="room in rooms" :key="room.id" class="room box">
        <div>{{ room.id }}</div>
        <div class="card-container">
          <div v-for="member in room.members" :key="member.id" class="card">
            <div>
              {{ member.id }}
            </div>
            <div>Создатель: {{ member.creator ? 'Да' : 'Нет' }}</div>
          </div>
        </div>
        <div>
          свободно мест: {{ room.max - room.members.length }} из {{ room.max }}
        </div>
        <div>
          <button v-if="!inRoom(room)" @click="enterRoom(room)">Войти</button>
          <button v-if="isUserCanStartGame(room)" @click="startGame(room)">
            Начать игру
          </button>
        </div>
      </div>
    </div>
    <div class="box">
      <button @click="onClickCreateRoom">Создать комнату</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import { RoomItem } from '~/models'
import { BASE_URL } from '~/constants'
import { useRouter } from 'vue-router'

const currentUser: Ref<string> = ref('')

const router = useRouter()

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

const startGame = async (room: RoomItem) => {
  try {
    const payload = JSON.stringify({
      id: room.id,
    })

    await fetch(`${BASE_URL}/startGame`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: payload,
      headers: {
        Authorization: localStorage.getItem('auth') || '',
      },
    })

    await router.push(`/damir/${room.id}`)
  } catch (e) {
    console.log('startGame ', e)
  }
}

const auth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: localStorage.getItem('auth') || '',
      },
    })

    const data = await response.text()

    localStorage.setItem('auth', data)

    currentUser.value = data

    // if (!oldAuth) document.cookie = `user=${data}`
  } catch (e) {
    console.log(e)
  }
}

const enterRoom = async (room: RoomItem) => {
  try {
    await fetch(`${BASE_URL}/enter`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        Authorization: localStorage.getItem('auth') || '',
      },
      body: JSON.stringify({ id: room.id }),
    })
  } catch (e) {
    console.log(e)
  }
}

const onClickCreateRoom = async () => {
  try {
    await fetch(`${BASE_URL}/newRoom`, {
      credentials: 'include',
      headers: {
        Authorization: localStorage.getItem('auth') || '',
      },
    })
  } catch (e) {
    console.log(e)
  }
}

const onClickGetRooms = async () => {
  try {
    const response = await fetch(`${BASE_URL}/rooms`, {
      credentials: 'include',
      headers: {
        Authorization: localStorage.getItem('auth') || '',
      },
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
    try {
      rooms.value = JSON.parse(event.data)
    } catch (e) {
      console.log('error = ', e)
    }
  })

  await onClickGetRooms()
})
</script>

<style scoped>
.box {
  padding: 20px;
  margin: 10px;
}

.card-container {
  display: flex;
  flex-flow: row wrap;
}

.card {
  border: 1px solid black;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.card:not(:first-child) {
  margin-left: 10px;
  margin-right: 10px;
}

.room {
  border: 1px solid black;
}

.room > * {
  margin-bottom: 10px;
}
</style>
