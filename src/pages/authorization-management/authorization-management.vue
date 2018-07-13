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
    <transition name="fade">
      <div class="shade-box" v-show="showShade">
        <div class="shade">
          <p class="shade-title">提示<span class="close" @click="_hideShade">&times;</span></p>
          <p class="shade-tip">是否授权完成</p>
          <div class="shade-btn">
            <div class="share-btn-item hare-btn-white hand" @click="_hideShade">取消</div>
            <div class="share-btn-item hare-btn-orgin hand" @click="_doubelCheck">确定</div>
          </div>
        </div>
      </div>
    </transition>
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
        applyList: [],
        showShade: false
      }
    },
    created () {
      this._getSuiteList()
    },
    methods: {
      _showShade () {
        this.showShade = true
      },
      _hideShade () {
        this.showShade = false
      },
      _doubelCheck() {
        this._getSuiteList()
      },
      _getSuiteList () {
        Authorization.getSuiteist().then((res) => {
          if (res.error === ERR_OK) {
            this.applyList = res.data
            this.showShade = false
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
            let redirectUri = location.origin + '/authorizationDetail'
            redirectUri = encodeURI(redirectUri)
            let url = ` https://open.work.weixin.qq.com/3rdapp/install?suite_id=${res.suite_id}&pre_auth_code=${res.pre_auth_code}&redirect_uri=${redirectUri}&state=${res.suite_id},${res.corp_id}`
            this._showShade()
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
    flex-wrap :wrap
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

  .shade-box
    height: 100vh
    width: 100%
    z-index: 2000
    background: rgba(50, 50, 58, 0.60)
    position: absolute
    top: 0
    left: 0
    &.fade-enter, &.fade-leave-to
      opacity: 0
    &.fade-enter-to, &.fade-leave-to
      transition: opacity .2s ease-in-out
  .shade
    all-center()
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    background: $color-white
    box-sizing :border-box
    width: 534px
    height: 261px
  .shade-tip
    text-indent: 36px
    margin-top: 46px
    font-size: $font-size-medium14
    color: $color-text

  .shade-title
    text-indent: 30px
    position: relative
    height: 60px
    border-bottom: 1px solid #DADADA
    line-height: 60px

  .close
    cursor: pointer
    position: absolute
    col-center()
    right: 30px
    color: #979797
    font-size: 24px
    &:hover
      transform: translateY(-70%) translateX(39%) rotate(90deg)
      transform-origin: 50%
      transition: transform 0.5s

  .shade-btn
    width: 100%
    position: absolute
    bottom: 20px
    display: flex
    padding-right: 30px
    justify-content: flex-end
    .share-btn-item
      font-size: $font-size-medium16
      height: 40px
      width: 90px
      line-height: 40px
      text-align: center
      margin-left: 20px
      border-radius: 3px
    .hare-btn-white
      color: $color-text
      border: 1px solid $color-lineCC
    .hare-btn-orgin
      background: $color-orgin-theme
      color: $color-white
</style>