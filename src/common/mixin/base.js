/**
 * Created by user on 2018/3/29.
 */
export const mixinBase = {
  methods: {
    //  格式化时间
    farmatTime(time, detail = true) {
      let now = new Date(time)
      let year = now.getFullYear()
      let month = now.getMonth() + 1 > 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1)
      let date = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()
      let hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()
      let minute = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()
      let second = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds()
      let res = detail ? (year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second) : (year + '-' + month + '-' + date)
      return res
    }
  }
}
