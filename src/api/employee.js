import http from '../common/js/http'

export default {
  /**
   * 获取员工列表
   * @param data
   * @returns {*}
   */
  userList(data) {
    let url = 'api/merchant/user-list'
    return http.get(url, data)
  },
  /**
   * 获取员工列表
   * @param data
   * @returns {*}
   */
  syncUser() {
    let url = 'api/merchant/sync-user'
    return http.get(url)
  },
  /**
   * 获取员工列表
   * @param data
   * @returns {*}
   */
  createcUser(data) {
    let url = 'api/merchant/create-user'
    return http.post(url, data)
  },
  /**
   * 获取员工列表
   * @param data
   * @returns {*}
   */
  getUser(data) {
    let url = 'api/merchant/get-user'
    return http.get(url, data)
  },
  /**
   * 获取员工列表
   * @param data
   * @returns {*}
   */
  updateUser(data) {
    let url = 'api/merchant/update-user'
    return http.put(url, data)
  },
  /**
   * 删除员工
   * @param data
   * @returns {*}
   */
  deleteUser(data) {
    let url = 'api/merchant/delete-user'
    return http.delete(url, data)
  },
  /**
   * AI雷达开关
   * @param data
   * @returns {*}
   */
  aiRadarChange(data) {
    let url = 'api/merchant/ai-radar-change'
    return http.get(url, data)
  },
  /**
   * AI雷达开关
   * @param data
   * @returns {*}
   */
  bossRadarChange(data) {
    let url = 'api/merchant/boss-radar-change'
    return http.get(url, data)
  },
  /**
   * 获取员工二维码
   * @param data
   * @returns {*}
   */
  getEmployeeQrcode(data) {
    let url = 'api/merchant/get-employee-qrcode'
    return http.get(url, data)
  },
  /**
   * 名片信息列表
   * @param data
   * @returns {*}
   */
  businessCard(data) {
    let url = 'api/merchant/business-card'
    return http.get(url, data)
  },
  /**
   * 设置默认名片
   * @param data
   * @returns {*}
   */
  setDefaultCard(data) {
    let url = 'api/merchant/set-default-card'
    return http.put(url, data)
  }
}
