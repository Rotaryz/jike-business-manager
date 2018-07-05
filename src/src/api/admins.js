/**
 * Created by user on 2018/1/24.
 */
import http from '../common/js/http'

// export function login(params) {
//   const url = `/api/admins/login`
//   return axios.post(url, params).then((res) => {
//     if (res.data.error === ERR_OK) {
//       return Promise.resolve(res.data.data)
//     } else {
//       return Promise.resolve(res.data)
//     }
//   })
// }
export default {
  login(params) {
    const url = '/api/admins/login'
    return http.post(url, params)
  }
}
