import { ref, Ref } from 'vue'

const socketFactory = () => {
  const socket: Ref<WebSocket | null> = ref(null)

  const setupSocketModule = () => {
    socket.value = new WebSocket('ws://localhost:8080')
    socket.value.addEventListener('open', function () {
      // socket.value.send('Hello Server!')
    })
  }

  const checkSocketStatus = () => {
    return !!socket.value
  }

  const onListenMessage = <T>(callBackFunction: (a: T) => void) => {
    // console.log('onListenMessage')
    if (!socket.value) return

    socket.value.addEventListener('message', function (event) {
      // console.log('event.data:' , event.data)
      try {
        const data = JSON.parse(event.data)
        // console.log('message, data: ', data)

        callBackFunction(data)
      } catch (e) {
        console.log('error = ', e)
      }
    })
  }

  return {
    socket,
    checkSocketStatus,
    setupSocketModule,
    onListenMessage,
  }
}

export { socketFactory }
