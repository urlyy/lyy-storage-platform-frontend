import { requests } from '@/requests'

const registerReq = async (data) => {
  let url = 'register'
  let res = await requests.postBody(url, data)
  return res.data
}

export { registerReq }
