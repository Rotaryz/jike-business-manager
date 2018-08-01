<template>
  <div class="authorization-detail">
    <img src="./icon-success_sq@2x.png" class="icon">
    <p>授权{{errorMessage? '失败' : '成功'}} {{times}}秒<span class="close hand" @click="_close">关闭</span></p>
    <p>其他操作可到企管后台操作</p>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import { ERR_OK } from 'api/config'
  import { Authorization } from 'api'
  import Toast from 'components/toast/toast'

  export default {
    name: 'authorization-detail',
    data () {
      return {
        times: 3,
        type: '',
        errorMessage: ''
      }
    },
    created () {
      this.type = this.$route.query.type
      this.errorMessage = this.$route.query.error_message
      this._getTime()
      if (this.type) {
        if (this.errorMessage) {
          setTimeout(() => {
            this.$refs.toast.show(this.errorMessage, 2000)
          }, 100)
        }
        setTimeout(() => {
          window.close()
        }, 3000)
        return
      }
      this._permanentCodeBind()
    },
    methods: {
      _getTime () {
        let times = setInterval(() => {
          if (this.times === 1) {
            clearInterval(times)
            return
          }
          this.times--
        }, 1000)
      },
      _permanentCodeBind () {
        let data = {auth_code: this.$route.query.auth_code, state: this.$route.query.state}
        Authorization.permanentCodeBind(data).then((res) => {
          console.log(res)
          if (res.error === ERR_OK) {
            setTimeout(() => {
              window.close()
            }, 3000)
            //  关闭页面
          }
        })
      },
      _close () {
        window.close()
      }
    },
    components: {
      'toast': Toast
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .authorization-detail
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    background: $color-white
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.10)
    border-radius: 3px
    width: 92.7vw
    height: 366px
    color: $color-text
    font-size: $font-size-large18
    margin: 50px auto
    .icon
      margin-bottom: 60px
      width: 80px
    p
      margin-bottom: 20px
    .close
      color: rgb(86, 138, 247)
      text-decoration: underline
</style>