<template>
  <div>
    <router-link to='/stream'>to stram</router-link>
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
import { checkAuthCookie } from '~/boot/auth'
import {
  callCreateRoomApi,
  getAllRooms,
  auth,
  callEnterRoomApi,
} from '~/src/api'
import { socketFactory } from '~~/boot/socket'

const { onListenMessage, setupSocketModule } = socketFactory()

checkAuthCookie()
onBeforeMount(() => {
  setupSocketModule()

  onListenMessage((data: { type: string, value: RoomItem[]}[]) => {
    data.forEach((item) => {
      if (item.type && item.type === 'rooms') {
        rooms.value = item.value
      }
    })

  })
})
//


const currentUser: Ref<string> = ref('')

const router = useRouter()


const rooms: Ref<RoomItem[]> = ref([])

const inRoom = (room: RoomItem) => {
  return room.members.find((member) => member.id === currentUser.value)
}

const isUserCreator = (room: RoomItem) => {
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

    await router.push(`/game/${room.id}`)
  } catch (e) {
    console.log('startGame ', e)
  }
}

const onClickCreateRoom = async () => {
  await callCreateRoomApi()
}

const enterRoom = async (room: RoomItem) => {
  const result = await callEnterRoomApi(room.id)

  console.log('result: ', result)
}

const onClickGetRooms = async () => {
  const response = await getAllRooms()

  if (response) rooms.value = response
}



onMounted(async () => {
  currentUser.value = await auth()

  setupSocketModule()

  await onClickGetRooms()
})
</script>

<style lang="scss" scoped>
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
