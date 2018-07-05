/**
 * Created by user on 2018/3/9.
 */
import http from '../common/js/http'

/**
 * 退款申请
 * @param params
 * @returns {Promise.<TResult>}
 */
export default {
  refundConfirm(params) {
    const url = `/api/finances/refund-confirm`
    return http.get(url, params)
  }
}
