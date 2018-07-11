<template>
  <div slot="form-list">
    <div class="top">小程序授权</div>
    <div class="big-box">
      <div v-for="(item, index) in applyList" :key="index" :class="{'item-active': item.is_authorize}" @click="_authorzation(item)" class="item-box hand">
        <img src="./icon-success@2x.png" class="right" v-show="item.is_authorize">
        <img :src="item.is_authorize ? require('./icon-'+item.suite_alias+'@2x.png') : require('./icon-'+item.suite_alias+'_default@2x.png')" class="icon">
        <div class="title">{{item.suite_title}}</div>
        <!--<span>{{item.is_authorize}}</span>-->
      </div>
    </div>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import { ERR_OK } from 'api/config'
  import { Authorization } from 'api'
  import Toast from 'components/toast/toast'

  export default {
    name: 'authorization-amanagement',
    data () {
      return {
        pageShow: false,
        applyList: []
      }
    },
    created () {
      this._getSuiteList()
    },
    methods: {
      _getSuiteList () {
        Authorization.getSuiteist().then((res) => {
          if (res.error === ERR_OK) {
            const applyList = res.data
            // res.data.forEach((item, index) => {
            //   if (index < 2) {
            //     applyList.push(item)
            //   }
            // })
            this.applyList = applyList
          }
        })
      },
      _authorzation (item) {
        // if (item.is_authorize) {
        //
        //   return
        // }
        let suiteId = item.suite_id
        Authorization.workServer({suite_id: suiteId}).then((res) => {
          if (res.error === ERR_OK) {
            res = res.data
            let redirectUri = location.origin + '/container/authorizationDetail'
            redirectUri = encodeURI(redirectUri)
            let url = ` https://open.work.weixin.qq.com/3rdapp/install?suite_id=${res.suite_id}&pre_auth_code=${res.pre_auth_code}&redirect_uri=${redirectUri}&state=${res.suite_id},${res.corp_id}`
            // https://work.weixin.qq.com/wework_admin/third/authSuite?suite_id=ww65ff1d66710fd8c5&thirdapp_id=&pre_auth_code=8pNRGE4PsWU-ISoQGMRIEr0SiWREdne4LAOgyWbZR0yOrIjPsX0qmasErKTzdt4I&redirect_uri=http%3A%2F%2Fcallbacktest.jkweixin.com%3A8080&state=&from=#/authorization-detail&state=ww65ff1d66710fd8c5,ww8254a365bf92e5aa
            window.open(url)
            return
          }
          this.$refs.toast.show(res.message)
        })
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
  .top
    background: $color-white
    height: 90px
    text-indent: 25px
    font-size: $font-size-large18
    color: $color-text
    line-height: 90px

  .big-box
    display: flex
    padding-left: 200px
    .item-box
      position: relative
      margin-top: 51px
      width: 260px
      height: 120px
      margin-right: 120px
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.10)
      background: $color-white
      .icon
        margin-bottom: 10px
        width: 21.15%
      .title
        font-size: $font-size-large18
        color: $color-text
      .right
        top: -17px
        right: -17px
        width: 34px
        position: absolute
    .item-active
      border: 1px solid #56BA15;
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.10)
</style>
