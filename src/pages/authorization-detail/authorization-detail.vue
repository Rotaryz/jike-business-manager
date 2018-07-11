<template>
  <div>
    测试授权页面...
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
    created() {
      this._permanentCodeBind()
    },
    methods: {
      _permanentCodeBind() {
        let data = {auth_code: this.$route.query.auth_code, state: this.$route.query.state}
        Authorization.permanentCodeBind(data).then((res) => {
          console.log(res)
          if (res.error === ERR_OK) {
            window.close()
          //  关闭页面
          }
        })
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
</style>