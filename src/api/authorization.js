/**
 *merchant开头
 */
import http from '../common/js/http'

export default {
  /**
   * 获取第三方授权应用列表
   * @param params
   * @returns {Promise.<TResult>}
   */
  getSuiteist () {
    let url = '/api/merchant/authorization/get-suite-list'
    return http.get(url)
  },
  /**
   * 开始第三方应用授权
   * @param params
   * @returns {Promise.<TResult>}
   */
  workServer (data) {
    let url = '/api/merchant/authorization/work-server'
    return http.post(url, data)
  },
  /**
   * 永久企业授权码绑定
   * @param params
   * @returns {Promise.<TResult>}
   */
  permanentCodeBind (data) {
    let url = '/api/merchant/authorization/permanent-code-bind'
    return http.post(url, data)
  }
}