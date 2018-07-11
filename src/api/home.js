/**
 * Created by user on 2018/3/31.
 */
/**
 * Created by user on 2018/1/25.
 */
import http from '../common/js/http'
export default {
  /**
   * 待办事项列表
   * @param params
   * @returns {Promise.<TResult>}
   */
  backlogLists(params) {
    const url = `/api/home/backlog-lists`
    return http.get(url, params)
  },
  /**
   *  证件审核
   * @param params
   * @returns {Promise.<TResult>}
   */
  licenseAudit(params) {
    const url = `/api/home/license-audit`
    return http.get(url, params)
  }
}
