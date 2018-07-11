<template>
  <div class="container">
    <navigation ref="nav"></navigation>
    <div class="left-side" >
      <div class="herder-peo">
        <div class="guild-box" @click="checkStatus">
          <img src="./icon-menu@2x.png" class="guide"
               :class="{'guide-rotate':navStatus}">
        </div>
        <div class="user" :class="{'user-active': logout}" @mouseenter="showlogout" @mouseleave="hidelogout">
          <img src="./header.jpeg" class="user-header">
          <span class="nick-name">{{userName}}</span>
          <i class="icons-top" :class="logout ? 'icons-bottom': '' "></i>
          <transition name="fade">
            <div class="logout-box" v-show="logout" @mouseenter="showlogout">
              <div class="logout" @click.stop="isLogout">
                <span class="logout-icons"></span>
                退出登录
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="content" @mouseover="hideNav">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Navigation from 'components/navigation/navigation'

  export default {
    data() {
      return {
        navStatus: true,
        userName: localStorage.getItem('userName') || sessionStorage.getItem('userName'),
        logout: false,
        showOut: false,
        dataStatus: '',
        width: 200,
        offsetWhidt: document.body.clientWidth - 200
      }
    },
    created() {
      // window.onresize = () => {
      //   this.offsetWhidt = document.body.clientWidth - this.width
      // }
    },
    methods: {
      showlogout() {
        this.logout = true
      },
      hidelogout() {
        this.logout = false
      },
      checkStatus() {
        let res = this.$refs.nav.isShowBig()
        this.width = res
        this.offsetWhidt = document.body.clientWidth - this.width
        this.navStatus = !this.navStatus
      },
      hideNav() {
        this.$refs.nav.hideHover()
      },
      isLogout() {
        localStorage.clear()
        this.$router.push({path: '/'})
      },
      showHeight() {
        this.showOut = true
      },
      hideHeight() {
        this.showOut = false
      }
    },
    components: {
      'navigation': Navigation
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .container
    height: 100vh
    .left-side
      height : 100%
      overflow :hidden
      display: flex
      flex-direction: column
      position : relative
      .herder-peo
        position: absolute
        top: 0
        z-index: 800
        left: 0
        width: 100%
        background: $color-white
        display: flex
        height: 80px
        align-items: center
        justify-content: space-between
        border-bottom: 1px solid #eee
        .guild-box
          height: 100%
          width: 78px
          position: relative
          cursor: pointer
          &:hover
            background: $color-background
        .guide
          margin-left: 26px
          margin-top: 19.5px
          height: 26px
          width: 26px
          transform: rotateY(180deg)
          transition: all 0.5s
        .guide-rotate
          transform: rotateY(0deg)
          transition: all 0.5s
        .user
          cursor: pointer
          height: 100%
          display: flex
          align-items: center
          padding: 0 41px 0 33px
          position: relative
          z-index: 1500
          .logout-box
            position: absolute
            right: 2px
            bottom: -58px
            height: 58px
            width: 99%
            z-index: 1500
            &.fade-enter, &.fade-leave-to
              opacity: 0
            &.fade-enter-to, &.fade-leave-to
              transition: all .2s ease-in-out
          .logout
            background-color: $color-white
            margin-top: 4px
            border-radius: 3px
            width: 100%
            text-indent: 64px
            height: 50px
            box-shadow: 0 3px 8px 0 rgba(12, 6, 14, 0.20)
            line-height: 50px
            z-index: 200
            .logout-icons
              position: absolute
              left: 30px
              height: 22px
              width: 22px
              icon-image('icon-exit')
              col-center()
          .logout:active
            background: $color-background
          .user-header
            height: 40px
            border-radius: 100%
          .nick-name
            font-size: $font-size-medium-x
            color: $color-text-icon
            margin: 0 20px 0 10px
          .icons-top
            height: 0px
            border: 8px solid $color-text-icon
            border-bottom: 8px solid transparent
            border-left: 8px solid transparent
            border-right: 8px solid transparent
            position: absolute
            right: 28px
            top: 47%
            transform-origin: 7px 3px
            transform: rotate(0deg)
            transition: all 0.2s
          .icons-bottom
            transform-origin: 7px 3px
            transform: rotate(180deg)
            transition: all 0.2s
        .user-active
          background: $color-background
      .content
        margin-top: 80px
        flex: 1
</style>
