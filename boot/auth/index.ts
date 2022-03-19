import { getRequest, setAuthToken } from '~/src/api/axios'

const checkAuthCookie = async () => {
  if (process.client && window.document) {
    const docCookie = document.cookie

    console.log('cookie: ', docCookie)

    if (docCookie) {
      setAuthToken(docCookie)
    }

    if (!docCookie) {
      const user = await getRequest<string>('/auth')

      console.log('user not login')

      if (!user) return

      setAuthToken(user)

      document.cookie = user

      console.log('user: ', user)
    } else {

    }

  }
}

export { checkAuthCookie }
