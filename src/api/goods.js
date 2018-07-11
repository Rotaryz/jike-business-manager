import http from '../common/js/http'

export default {
  /**
   * 获取商品列表
   * @param data
   * @returns {*}
   */
  goodsList (data) {
    let url = '/api/merchant/goods'
    return http.get(url, data)
  },
  /**
   * 获取商品列表
   * @param data
   * @returns {*}
   */
  goodsDetail (id) {
    let url = `/api/merchant/goods/${id}`
    return http.get(url)
  },
  /**
   * 商品新建
   * @param data
   * @returns {*}
   */
  createGoods (data) {
    let url = `/api/merchant/goods`
    return http.post(url, data)
  },
  /**
   * 商品编辑
   * @param data
   * @returns {*}
   */
  putGoods (data, id) {
    let url = `/api/merchant/goods/${id}`
    return http.put(url, data)
  },
  /**
   * 商品批量操作
   * @param data
   * @returns {*}
   */
  goodsBatchUpdate (data) {
    let url = `/api/merchant/goods-batch-update`
    return http.post(url, data)
  },
  /**
   * 商品删除
   * @param data
   * @returns {*}
   */
  delGoods (id) {
    let url = `/api/merchant/goods/${id}`
    return http.delete(url)
  }
}