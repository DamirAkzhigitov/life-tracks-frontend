import axios from 'axios'
import { BASE_URL } from '~/constants'

export const API = axios.create({ baseURL: BASE_URL })

export const setAuthToken = (token: string) => {
  console.log('setAuthToken, token : ', token)
  if (token) {
    //applying token
    API.defaults.headers.common['Authorization'] = token
  } else {
    //deleting the token from header
    delete API.defaults.headers.common['Authorization']
  }
}
