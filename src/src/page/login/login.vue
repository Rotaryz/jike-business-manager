<template>
  <div class="login" @click="hideFocus">
    <div class="bk"></div>
    <div class="login-box">
      <img src="./pic-logo_login@2x.png" class="logo">
      <h2 class="title">赞播管理后台信息系统</h2>
      <div class="user input-box" :class="{'input-height': focusPhone}">
        <span class="input-icon"></span>
        <input class="inputs input-height-item" value="asd" type="text"
               placeholder="请输入用户名" v-model="user"
               @click.stop="focusPhone = !focusPhone"
               @blur="focusPhone = false"/>
      </div>
      <div class="passward input-box" :class="{'input-height': focusPass}">
        <span class="input-icon"></span>
        <input class="inputs input-height-item" type="password"
               placeholder="请输入密码" v-model="password"
               @click.stop="focusPass = !focusPass" @blur="focusPass = false"/>
      </div>
      <div class="remenber hand" @click="remenberPassWord">
        <i class="check" :class="{'check-yes' : remenber}"></i>
        <span class="tip">记住密码</span>
      </div>
      <div class="submit-no input-box" @click="login">
        登陆
      </div>
    </div>
    <toast ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import admins from 'api/admins'
  import Toast from 'components/toast/toast'
  export default {
    data() {
      return {
        focusPass: false,
        focusPhone: false,
        user: '',
        password: '',
        remenber: true
      }
    },
    created() {
      let token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token') ? sessionStorage.getItem('token') : false
      if (token) {
        location.href = '#/container/data'
      }
      window.onkeydown = (e) => {
        if (e.keyCode === 13) {
          this.login()
        }
      }
    },
    methods: {
      hideFocus() {
        this.focusPhone = false
        this.focusPass = false
      },
      remenberPassWord() {
        this.remenber = !this.remenber
      },
      login() {
        if (this.user === '') {
          this.$refs.toast.show('请输入用户名')
          return false
        } else if (this.password === '') {
          this.$refs.toast.show('请输入密码')
          return false
        }
        let data = {username: this.user, password: this.password}
        admins.login(data).then((res) => {
          if (!res.error) {
            let data = res.data
            this.$refs.toast.show('登陆成功')
            if (this.remenber) {
              localStorage.setItem('token', data.access_token)
              localStorage.setItem('userName', data.admin_info.username)
            } else {
              sessionStorage.setItem('token', data.access_token)
              sessionStorage.setItem('userName', data.admin_info.username)
            }
            setTimeout(() => {
              location.href = '#/container/data'
            }, 500)
          } else if (res.error) {
            this.$refs.toast.show(res.message)
          }
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
  .login
    .bk
      height: 66.389vh
      width: 100%
      position: absolute
      bottom: 0
      left: 0
      background-size: cover
      bg-image('pic-bg')
    .login-box
      box-shadow: 0 0 10px 0 rgba(12, 6, 14, 0.10)
      border-radius: 3px
      height: 28.22vw
      width: 26.45vw
      min-width: 386px
      min-height: 416px
      background: $color-white
      all-center()
      text-align: center
      .logo
        margin-top: 8.118%
        width: 17.98%
      .title
        color: #000
        font-size: 1.875vw
        margin-top: 4.428%
      .input-box
        margin: 4.59% auto
        height: 9.225%
        width: 72.47%
        font-size: $font-size-small
        position: relative
        border: 2px solid $color-white
        .inputs
          text-indent: 8.856%
          height: 100%
          width: 100%
          border-radius: 3px
          border: 1px solid #D1D1D1
          &::placeholder
            opacity: 1
            color: $color-text-little
        .input-icon
          height: 44%
          width: 6.01%
          icon-image('icon-user')
          col-center()
          left: 2.5%
          z-index: 100
      .passward
        .input-icon
          icon-image('icon-password')
      .remenber
        display: flex
        justify-content: right
        margin-left: 13.7795%
        height: 1.0416vw
        position: relative
        .check
          position: absolute
          left: 2px
          top: 0px
          cursor: pointer
          height: 12px
          width: 12px
          border: 1px solid #979797
          border-radius: 4px
        .check-yes
          border: none
          icon-image('icon-select')
        .tip
          display: inline-block
          position: absolute
          left: 10px
          top: 0px
          margin-left: 2.853%
          line-height: 1
          font-size: $font-size-small
          color: #9B9B9B
      .submit-no
        background: $color-nomal
        color: $color-white
        display: flex
        align-items: center
        justify-content: center
        border-radius: 4px
        &:hover
          background: $color-hover
        &:active
          background: $color-nomal
          border: 1px solid rgba(239, 112, 93, 0.30)
</style>
