/**
 * Created by user on 2018/1/27.
 */
import http from '../common/js/http'

export default {
  /**
   * 对用户添加备注
   * @param params
   * @returns {Promise.<TResult>}
   */
  customerRemark(prams) {
    const url = `/api/customers/remark`
    return http.post(url, prams)
  },
  /**
   * 查看获取订单用户信息
   * @param params
   * @returns {Promise.<TResult>}
   */
  customerInfo(prams) {
    const url = `/api/customers/customer-info`
    return http.post(url, prams)
  },
  /**
   * 查看获取微信用户信息
   * @param params
   * @returns {Promise.<TResult>}
   */
  wechatdata(prams) {
    const url = `/api/customers/wechatdata-info`
    return http.post(url, prams)
  },
  customers(prams) {
    const url = `/api/customers/index`
    return http.post(url, prams)
  }
}
