import http from '../common/js/http'

export default {
  upLoadImage (data) {
    let url = 'api/merchant/images'
    return http.post(url, data)
  }
}