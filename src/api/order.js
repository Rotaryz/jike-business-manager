/**
 * Created by user on 2018/1/25.
 */
import http from '../common/js/http'
export default {
  /**
   * 订单列表
   * @param params
   * @returns {Promise.<TResult>}
   */
  orderList(params) {
    const url = `/api/order/order-index`
    return http.post(url, params)
  },
  /**
   * 查看订单详情
   * @param params
   * @returns {Promise.<TResult>}
   */
  orderDetail(id) {
    const url = `/api/order/order-manage/${id}`
    return http.get(url)
  },
  /**
   * 添加备注
   * @param params
   * @returns {Promise.<TResult>}
   */
  orderManage(id, params) {
    const url = `/api/order/order-manage/${id}`
    return http.put(url, params)
  }

}
