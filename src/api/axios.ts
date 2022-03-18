import axios from 'axios'
import { BASE_URL } from '~/constants'

export const API = axios.create({ baseURL: BASE_URL })

export const setAuthToken = (token: string): void => {
  if (token) {
    //applying token
    API.defaults.headers.common['Authorization'] = token
  } else {
    //deleting the token from header
    delete API.defaults.headers.common['Authorization']
  }
}

export const getRequest = async <Type>(url: string): Promise<Type | null> => {
  try {
    const response = await API.get(url)

    return response.data

  } catch (e) {

    return null
  }
}
