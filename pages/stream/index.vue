<template>
  <div>
    <router-link to="/"> home </router-link>

    <h2>{{ title }}</h2>

    <p>streams: {{ streams }}</p>

    sumValue: {{ sumValue }}

    <!--    <div v-if="streams">-->
    <!--      <div v-for="stream in streams" :key="stream.value">-->
    <!--        <div>{{ stream.value }}</div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue'
import { socketFactory } from '~/boot/socket'
import { checkAuthCookie } from '~/boot/auth'
import { getRequest } from '~/src/api/axios'
import { isSet } from 'util/types'

const { onListenMessage, setupSocketModule, checkSocketStatus } =
  socketFactory()

checkAuthCookie()

const streams: Ref<{ type: string; value: string }[]> = ref([])
const title = ref('Main title')
const sumValue = ref(0)

onMounted(async () => {
  const socketStatus = checkSocketStatus()
  //
  if (!socketStatus) {
    setupSocketModule()
  }
  //
  onListenMessage((data: { type: string; value: string }[]) => {
    // console.log('in component log, onListenMessage, data:', data)
    data.forEach((item) => {
      // console.log('forEach, item: ', item)
      sumValue.value += Number(item.value)
      // if (item.type === 'stream') {
      // streams.value.push(item)

      // }
    })
  })

  title.value = 'TEST TEST'

  //
  const streamList = await getRequest('/start-stream')

  console.log('streamList: ', streamList)
})
</script>
