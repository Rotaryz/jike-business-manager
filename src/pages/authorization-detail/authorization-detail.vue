<template>
  <div class="authorization-detail">
    <img src="./icon-success_sq@2x.png" class="icon">
    <p>通讯录授权成功 {{times}}秒<span class="close hand" @click="_close">关闭</span></p>
    <p>其他操作可到企管后台操作</p>
  </div>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  import { ERR_OK } from 'api/config'
  import {Authorization} from 'api'

  export default {
    name: 'authorization-detail',
    components: {
      'form-box': FormBox
    },
    data() {
      return {
        times: 3
      }
    },
    created() {
      this._getTime()
      this._permanentCodeBind()
    },
    methods: {
      _getTime() {
        let times = setInterval(() => {
          if (this.times === 1) {
            clearInterval(times)
            return
          }
            this.times--
        }, 1000)
      },
      _permanentCodeBind() {
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
      _close() {
        console.log('ddd')
        window.close()
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .authorization-detail
    display :flex
    flex-direction :column
    align-items :center
    justify-content :center
    background :$color-white
    box-shadow: 0 0 5px 0 rgba(12,6,14,0.10)
    border-radius: 3px
    width: 92.7vw
    height: 366px
    color:$color-text
    font-size :$font-size-large18
    margin : 50px auto
    .icon
      margin-bottom: 60px
      width: 80px
    p
      margin-bottom: 20px
    .close
      color :rgb(86,138,247)
      text-decoration :underline
</style>