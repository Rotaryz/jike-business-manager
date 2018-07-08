/**
 * Created by user on 2018/1/24.
 */
import http from '../common/js/http'
// admin 开头
export default {
  /**
   * 登陆
   * @param params
   * @returns {*}
   */
  adminLogin (params) {
    const url = '/api/jwt/login'
    return http.post(url, params)
  }
}
