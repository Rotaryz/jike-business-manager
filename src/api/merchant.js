/**
 * Created by user on 2018/1/26.
 */
/**
 * Created by user on 2018/1/25.
 */
import http from '../common/js/http'
export default {
  /**
   * 商家列表
   * @param params
   * @returns {Promise.<TResult>}
   */
  merchanList(params) {
    const url = `/api/merchant/merchant-index`
    return http.post(url, params)
  },
  /**
   * 查看订单详情
   * @param params
   * @returns {Promise.<TResult>}
   */
  merchantDetail(id) {
    const url = `/api/merchant/merchant-message/${id}`
    return http.get(url)
  },
  /**
   * 添加备注
   * @param params
   * @returns {Promise.<TResult>}
   */
  merchantMessage(id, params) {
    const url = `api/merchant/merchant-message/${id}`
    return http.put(url, params)
  },
  /**
   * 查看商圈列表
   * @param params
   * @returns {Promise.<TResult>}
   */
  circlesDetail(params) {
    const url = `/api/merchant/circles-detail`
    return http.get(url, params)
  },
  /**
   * 新增商圈
   * @param params
   * @returns {Promise.<TResult>}
   */
  addCircle(params) {
    const url = `/api/merchant/add-circle`
    return http.post(url, params)
  },
  /**
   * 查看行业列表
   * @param params
   * @returns {Promise.<TResult>}
   */
  industryDetail(params) {
    const url = `/api/merchant/industry-detail`
    return http.get(url, params)
  },
  /**
   * 添加行业
   * @param params
   * @returns {Promise.<TResult>}
   */
  indestryAdd(params) {
    const url = `/api/merchant/indestry-add`
    return http.post(url, params)
  },
  /**
   * 开通商家服务
   * @param params
   * @returns {Promise.<TResult>}
   */
  openService(params) {
    const url = `/api/merchant/open-service`
    return http.get(url, params)
  },
  /**
   * 冻结商家服务
   * @param params
   * @returns {Promise.<TResult>}
   */
  disable(params) {
    const url = `/api/merchant/disable`
    return http.get(url, params)
  },

  /**
   * 删除商圈
   * @param params
   * @returns {Promise.<TResult>}
   */
  delCircle(params) {
    const url = `/api/merchant/del-circle`
    return http.get(url, params)
  },
  /**
   * 越权
   * @param params
   * @returns {Promise.<TResult>}
   */
  getQrcord(id) {
    const url = `/api/merchant/shop-qrcode/${id}`
    return http.get(url)
  },
  /**
   * 越权
   * @param params
   * @returns {Promise.<TResult>}
   */
  ultraVires(params) {
    const url = `/api/merchant/exceed-authority`
    return http.post(url, params)
  }
}
