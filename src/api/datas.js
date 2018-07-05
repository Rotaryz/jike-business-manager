/**
 * Created by user on 2018/1/27.
 */
import http from '../common/js/http'
/**
 * 数据概况列表
 * @param params
 * @returns {Promise.<TResult>}
 */
export default {
  datasList(prams) {
    const url = `/api/datas/index`
    return http.post(url, prams)
  }
}
