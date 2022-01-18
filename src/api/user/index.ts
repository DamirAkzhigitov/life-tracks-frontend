import { setAuthToken, API } from '~/src/api/axios'

export const auth = async () => {
  try {
    const response = await API.get(`auth`)

    const data = response.data

    setAuthToken(data)

    localStorage.setItem('auth', data)

    return data
  } catch (e) {
    console.log(e)
  }
}
