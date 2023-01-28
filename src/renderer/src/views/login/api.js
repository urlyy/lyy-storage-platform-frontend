import { requests } from '@/requests'

const loginReq = async (data) => {
  let url = 'login'
  let res = await requests.postBody(url, data)
  return res.data
}

export { loginReq }
