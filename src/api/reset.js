import http from '../common/js/http'

export default {
  /**
   * 修改企业名称
   * @param data
   * @returns {*}
   */
  resetName (data) {
    let url = 'api/merchant/reset-name'
    return http.post(url, data)
  },
  /**
   * 修改企业名称
   * @param data
   * @returns {*}
   */
  resetPassword (data) {
    let url = 'api/merchant/reset-password'
    return http.post(url, data)
  },
  /**
   * 账户中心
   * @param data
   * @returns {*}
   */
  merchantData () {
    let url = 'api/merchant/merchant-data'
    return http.get(url)
  }
}