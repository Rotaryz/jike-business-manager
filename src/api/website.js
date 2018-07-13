import http from '../common/js/http'

export default {
  /**
   *官网详情
   * @returns {*}
   */
  websiteDetail () {
    const url = '/api/merchant/website'
    return http.get(url)
  },
  /**
   * 官网新建
   * @param data
   * @returns {*}
   */
  createWebsite (data) {
    let url = `/api/merchant/website`
    return http.post(url, data)
  },
  /**
   * 官网编辑
   * @param data
   * @returns {*}
   */
  upWebsite (id, data) {
    let url = `/api/merchant/website/${id}`
    return http.put(url, data)
  }
}