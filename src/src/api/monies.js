/**
 * Created by user on 2018/3/6.
 */
// 财务模块
import http from '../common/js/http'
export default {
  /**
   * 订单查询
   * @param params
   * @returns {Promise.<TResult>}
   */
  ordersInquiry(params) {
    const url = `/api/monies/orders`
    return http.get(url, params)
  },

  /**
   * 审核提现
   * @param params
   * @returns {Promise.<TResult>}
   */
  checkWithdrawal(params) {
    const url = `/api/monies/check-withdrawal`
    return http.post(url, params)
  },
  /**
   * 订单查看详情
   * @param params
   * @returns {Promise.<TResult>}
   */
  orderDetail(params) {
    const url = `/api/monies/order-detail`
    return http.get(url, params)
  },
  /**
   * 财务收入收支
   * @param params
   * @returns {Promise.<TResult>}
   */
  accounts() {
    const url = `/api/monies/accounts`
    return http.get(url)
  },
  /**
   * 财务账目明细
   * @param params
   * @returns {Promise.<TResult>}
   */
  accountsDetail(params) {
    const url = `/api/monies/accounts-detail`
    return http.get(url, params)
  },
  /**
   * 顾客提现
   * @param params
   * @returns {Promise.<TResult>}
   */
  customerCheckWithdrawal(params) {
    const url = `/api/monies/customer-check-withdrawal`
    return http.post(url, params)
  }
}
