/**
 * Created by user on 2018/1/25.
 */
import http from '../common/js/http'
export default {
  /**
   * 省份商圈筛选
   * @param params
   * @returns {Promise.<TResult>}
   */
  businessCircle(params) {
    const url = `/api/globals/filter/business-circle`
    return http.get(url, params)
  },
  /**
   * 行业筛选
   * @param params
   * @returns {Promise.<TResult>}
   */
  industrie(params) {
    const url = `/api/globals/filter/industrie`
    return http.get(url, params)
  }
}
