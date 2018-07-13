<template>
  <form-box :pageShow="pageShow" ref="formBox">
    <div slot="form-list" class="account-center">
      <div class="account-center-header">
        <span class="account-center-title">账户信息</span>
      </div>
      <div class="account-center-item">
        <span class="account-center-text">企业名称</span>
        <span class="account-center-msg">{{userInfo.name}}</span>
        <span class="change hand" @click="_showShade('name')">修改</span>
      </div>
      <div class="account-center-item">
        <span class="account-center-text">名片数量</span>
        <span class="account-center-msg">{{userInfo.init_stock}}/100</span>
      </div>
      <div class="account-center-item">
        <span class="account-center-text">到期时间</span>
        <span class="account-center-msg">{{userInfo.expire_time}}</span>
      </div>
      <div class="account-center-item">
        <span class="account-center-text">登录账号</span>
        <span class="account-center-msg">{{userInfo.mobile}}</span>
        <!--<span class="change hand" @click="_showShade('mobile')">修改</span>-->
      </div>
      <div class="account-center-item">
        <span class="account-center-text">登录密码</span>
        <span class="account-center-msg">************</span>
        <span class="change hand" @click="_showShade('pass')">修改</span>
      </div>
    </div>
    <div slot="shade-box" class="shade-box">
      <div class="change-box" v-if="showType === 'name'">
        <p class="shade-title">修改企业名称<span class="close" @click="_hideShade">&times;</span></p>
        <div class="chang-msg">
          <span>企业名称</span>
          <input type="text" class="change-name" v-model="bussName">
        </div>
        <div class="shade-btn">
          <div class="share-btn-item hare-btn-white hand" @click="_hideShade">取消</div>
          <div class="share-btn-item hare-btn-orgin hand" @click="_resetName">修改</div>
        </div>
      </div>
      <div class="identity-box" v-if="showType === 'mobile'">
        <p class="shade-title">身份验证<span class="close" @click="_hideShade">&times;</span></p>
        <p class="identity-tip">手机号修改需要进行身份验证，请根据指示完成验证</p>
        <div class="chang-msg">
          <span>短信验证码</span>
          <input type="text" class="change-name" placeholder="请输入验证码">
          <span class="identity-items identity-get-code">获取</span>
        </div>
        <div class="shade-btn">
          <div class="share-btn-item hare-btn-white hand" @click="_hideShade">取消</div>
          <div class="share-btn-item hare-btn-orgin hand">修改</div>
        </div>
      </div>
      <div class="change-password" v-if="showType === 'pass'">
        <p class="shade-title">修改企业名称<span class="close" @click="_hideShade">&times;</span></p>
        <div class="password-box">
          <div class="chang-msg">
            <span class="chang-text">旧密码</span>
            <input type="password" placeholder="请输入旧密码" class="change-name" v-model="oldPassword">
          </div>
          <div class="chang-msg">
            <span class="chang-text">新密码</span>
            <input type="password" placeholder="新密码" class="change-name" v-model="password">
          </div>
          <div class="chang-msg">
            <span class="chang-text">确认密码</span>
            <input type="password" placeholder="确认秘密" class="change-name" v-model="anPassword">
          </div>
        </div>
        <div class="shade-btn">
          <div class="share-btn-item hare-btn-white hand" @click="_hideShade">取消</div>
          <div class="share-btn-item hare-btn-orgin hand" @click="_resetPass">修改</div>
        </div>
      </div>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  import { Reset } from 'api'
  import { ERR_OK } from '../../api/config'

  export default {
    name: 'account-center',
    data () {
      return {
        pageShow: false,
        bussName: '',
        showType: 'name',
        userInfo: {},
        password: '',
        oldPassword: '',
        anPassword: ''
      }
    },
    created () {
      Reset.merchantData().then((res) => {
        if (res.error === ERR_OK) {
          this.userInfo = res.data
          this.name = res.data.name
          console.log(this.userInfo)
        }
      })
    },
    methods: {
      _showShade (name) {
        this.showType = name
        this.$refs.formBox.showShade()
      },
      _hideShade () {
        this.$refs.formBox.hideShade()
      },
      _resetName () {
        Reset.resetName({name: this.bussName}).then((res) => {
          this._hideShade()
          this.userInfo.name = this.bussName
          localStorage.setItem('userName', this.bussName)
          console.log(res)
        })
      },
      _resetPass () {
        if (this.password !== this.anPassword && this.password) {
          this.$refs.formBox.showContent('两次输入密码不一致')
          return
        }
        Reset.resetPassword({password: this.password, old_password: this.oldPassword}).then((res) => {
          if (res.error === ERR_OK) {
            this._hideShade()
            this.$refs.formBox.showContent('成功修改密码')
            return
          }
          this.$refs.formBox.showContent(res.message)
        })
      }
    },
    components: {
      'form-box': FormBox
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .account-center
    padding: 8px 30px 0 37px

  .account-center-header
    padding: 29px 0
    color: $color-text
    border-bottom: 1px solid $color-line
    font-size: $font-size-large18

  .account-center-item
    height: 60px
    font-size: $font-size-medium14
    text-indent: 12px
    line-height: 60px
    color: $color-text
    border-bottom: 1px solid $color-line
    position: relative
    .account-center-msg
      margin-left: 346px
    .change
      col-center()
      text-decoration: underline
      right: 27px

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

  .shade-box
    .change-box
      width: 100%
      height: 261px
      .chang-msg
        color: $color-text
        font-size: $font-size-medium14
        padding: 40px 30px 70px
        box-sizing: border-box
        display: flex
        align-items: center
        .change-name
          text-indent: 8px
          width: 292px
          height: 28px
          margin-left: 11px
          border: 1px solid $color-lineCC
          &::-webkit-input-placeholder
            color: $color-lineCC
            font-size: $font-size-medium14
            font-family: $fontFamilyLight

    .identity-box
      height: 331px
      font-size: $font-size-medium14
      .identity-tip
        text-indent: 32px
        margin-top: 36px
      .chang-msg
        padding-bottom: 110px
        margin-top: 20px
        display: flex
        align-items: center
        margin-left: 32px
        .change-name
          height: 28px
          margin-left: 11px
          text-indent: 8px
          border: 1px solid $color-lineCC
        .identity-items
          height: 28px
          line-height: 28px
          width: 50px
          text-align: center
          border: 1px solid $color-lineCC
        .identity-get-code
          margin-left: 10px
        .identity-get-code-disable
          color: $color-lineCC

    .change-password
      height: 357px
      .password-box
        box-sizing: border-box
        padding: 20px 0 70px 31px
        .chang-msg
          display: flex
          margin-top: 20px
          align-items: center
          .chang-text
            width: 56px
            font-size: $font-size-medium14
            text-align: right
          .change-name
            margin-left: 11px
            height: 28px
            text-indent: 8px
            width: 292px
            border: 0.5px solid $color-lineCC
            &::-webkit-input-placeholder
              color: $color-lineCC
              font-size: $font-size-medium14
              font-family: $fontFamilyLight
    .shade-title
      text-indent: 30px
      position: relative
      height: 60px
      border-bottom: 1px solid #DADADA
      line-height: 60px
    .shade-btn
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