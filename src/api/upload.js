import http from '../common/js/http'

export default {
  /**
   * 上传图片
   * @param data
   * @returns {*}
   */
  upLoadImage(data) {
    let url = 'api/merchant/images'
    return http.post(url, data)
  },
  /**
   * 上传视频
   * @param data
   * @returns {*}
   */
  upLoadVideo(data) {
    let url = 'api/merchant/files'
    return http.post(url, data)
  }
}
