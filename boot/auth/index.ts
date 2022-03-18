import { getRequest, setAuthToken } from '~/src/api/axios'

const checkAuthCookie = async () => {
  if (process.client && window.document) {
    const docCookie = document.cookie

    console.log('cookie: ', docCookie)

    if (!docCookie) {
      console.log('user not login')
      const user = await getRequest<string>('/auth')

      if (!user) return

      setAuthToken(user)

      console.log('user: ', user)
    }

  }
}

export { checkAuthCookie }
