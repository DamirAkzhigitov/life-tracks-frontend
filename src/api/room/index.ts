import { API } from '~/src/api/axios'
import { RoomItem } from '~/models'

export const getAllRooms = async (): Promise<null | RoomItem[]> => {
  try {
    const response = await API.get(`rooms`)

    return response.data
  } catch (e) {
    return null
  }
}

export const callCreateRoomApi = async () => {
  try {
    const response = await API.get(`newRoom`)

    return response.data
  } catch (e) {
    return null
  }
}

export const callEnterRoomApi = async (id: string) => {
  try {
    const response = await API.post('enter', { id })

    return response.data
  } catch (e) {
    return null
  }
}
