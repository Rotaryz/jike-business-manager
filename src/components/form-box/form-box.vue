<template>
  <div class="form-box">
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
    <div class="tag">
      <div class="tag-title">
        <span class="title-item" v-for="(item,index) in navTitle" :key="index">{{index > 0 ? '/' : ''}} {{item}}</span>
      </div>
      <slot name="tap"></slot>
    </div>
    <slot name="money"></slot>
    <div class="data">
      <toast ref="toast"></toast>
      <div class="data-content">
        <div class="data-content-box">
          <div class="data-detail">
            <slot name="form-list"></slot>
            <div class="blank" v-show="showBlank">
              <div class="blank-icon"></div>
              <div class="blank-title">暂无相关数据</div>
            </div>
          </div>
          <div class="total" :class="{'totle-more':tagTop}" v-if="pageShow">
            <div>每页{{pageDtail[0].per_page}}条，共{{pageDtail[0].total}}条数据</div>
            <div class="page">
              <div class="page-icon" @click="subtract" :style="{'cursor': isHand.handLeft}" @mouseenter="notAllowed">
              </div>
              <div class="pade-detail">{{page}}/{{pageDtail[0].total_page}}</div>
              <div class="page-icon page-icon-two" @click="addPage" @mouseenter="notAllowed" :style="{'cursor': isHand.handRight}">
              </div>
              <div class="page-box" :class="{'input-height': pageDetail}">
                <div class="border-page page-total input-height-item" @click.stop="showPageDetail">
                  {{page}}/{{pageDtail[0].total_page}}
                  <span class="page-tap">
                <i class="page-top" :class="{'page-bottom':pageDetail}"></i>
              </span>
                  <transition name="fade">
                    <ul class="page-list" v-show="pageDetail">
                      <li class="page-item" v-for="item in pageDtail[0].total_page"
                          :key="item"
                          :class="{'page-item-active': pageIndex === item}"
                          @click.stop="detailPage(item)">
                        {{item}}/{{pageDtail[0].total_page}}
                      </li>
                    </ul>
                  </transition>
                </div>
              </div>
              <div class="input-box" :class="{'input-height': focus}">
                <input type="number" class="border-page input-height-item" v-model="pageInput" :focus="focus" @click.stop="focus = !focus" />
              </div>
              <div class="border-page input-height-item" @click="goPage" @mouseenter="notAllowed" :style="{'cursor': isHand.handGo}">跳转</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="shade-win" @click.stop="hideShade" v-show="isShade">
        <div class="shade-detail" @click.stop>
          <slot name="shade-box"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Toast from 'components/toast/toast'

  export default {
    name: 'demonstration',
    props: {
      pageShow: {
        type: Boolean,
        default: true
      },
      pageDtail: {
        type: Array,
        default: () => [{total: 1, per_page: 10, total_page: 0}]
      }
    },
    data () {
      return {
        isShade: false,
        showBlank: false,
        focus: false,
        page: 1,
        pageDetail: false,
        pageIndex: 0,
        prams: ['', '', '', ''],
        shopIndex: 0,
        shopData: ['', ''],
        navTitle: [],
        setTime: null,
        tagTop: false,
        isHand: {handLeft: 'pointer', handRight: 'pointer', handGo: 'pointer'},
        navStatus: true,
        userName: localStorage.getItem('userName') || sessionStorage.getItem('userName'),
        logout: false,
        showOut: false,
        dataStatus: '',
        width: 200,
        pageInput: '',
        offsetWhidt: document.body.clientWidth - 200
      }
    },
    created () {
      window.onkeydown = (e) => {
        if (e.keyCode === 13) {
          if (this.pageInput !== '') {
            if (this.pageInput > this.pageDtail[0].total_page) {
              this.pageInput = this.pageDtail[0].total_page
            } else if (this.pageInput === '0') {
              this.pageInput = 1
            }
            this.pageInput = Math.floor(this.pageInput * 1)
            this.page = this.pageInput
            this.$emit('addPage', this.page)
          }
        }
      }
      window.onclick = () => {
        this.hidePageDetail()
      }
      this.setNavTitle()
    },
    methods: {
      showlogout () {
        this.logout = true
      },
      hidelogout () {
        this.logout = false
      },
      checkStatus () {
        let res = this.$refs.nav.isShowBig()
        this.width = res
        this.offsetWhidt = document.body.clientWidth - this.width
        this.navStatus = !this.navStatus
      },
      hideNav () {
        this.$refs.nav.hideHover()
      },
      isLogout () {
        localStorage.clear()
        this.$router.push({path: '/'})
      },
      showHeight () {
        this.showOut = true
      },
      hideHeight () {
        this.showOut = false
      },
      setNavTitle () {
        setTimeout(() => {
          this.navTitle = sessionStorage.getItem('title') ? sessionStorage.getItem('title').split(',') : this.navTitle
        }, 30)
      },
      goPage () {
        if (this.pageInput !== '') {
          this.pageInput = Math.floor(this.pageInput * 1)
          if (this.pageInput > this.pageDtail[0].total_page) {
            this.pageInput = this.pageDtail[0].total_page
          } else if (this.pageInput === 0) {
            this.pageInput = 1
          }
          this.page = this.pageInput
          this.$emit('addPage', this.page)
        }
      },
      showPageDetail () {
        this.pageDetail = !this.pageDetail
      },
      hidePageDetail () {
        this.pageDetail = false
        this.focus = false
      },
      detailPage (page) {
        this.page = page
        this.pageIndex = page
        setTimeout(() => {
          this.hidePageDetail()
        }, 100)
        this.$emit('addPage', this.page)
      },
      showShade () {
        this.isShade = true
      },
      hideShade () {
        this.isShade = false
      },
      addPage () {
        if (this.page < this.pageDtail[0].total_page) {
          this.page++
          this.$emit('addPage', this.page)
        }
        this.notAllowed()
      },
      notAllowed () {
        this.page === 1 ? this.isHand.handLeft = 'not-allowed' : this.isHand.handLeft = 'pointer'
        this.page === this.pageDtail[0].total_page ? this.isHand.handRight = 'not-allowed' : this.isHand.handRight = 'pointer'
        this.pageInput === '' ? this.isHand.handGo = 'not-allowed' : this.isHand.handGo = 'pointer'
      },
      subtract () {
        if (this.page > 1) {
          this.page--
          this.$emit('addPage', this.page)
        }
        this.notAllowed()
      },
      showContent (content, time) {
        const showTime = time || 1000
        this.$refs.toast.show(content, showTime)
      },
      beginPage () {
        this.pageInput = ''
        this.page = 1
      }
    },
    components: {
      'toast':
      Toast
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .form-box
    height: 100%
    overflow-y: scroll
    display: flex
    flex-direction: column
    .tag
      background: $color-white
      height: 90px
      .tag-title
        line-height: 90px
        color: $color-text-little
        text-indent: 25.4px
        font-size: $font-size-large18
        font-family: $fontFamilyLight
        .title-item
          margin-left: 6px
          &:last-child
            color: $color-text
      .tag-choice
        display: flex
        padding: 0 10px
        margin: 20px 0 10px
        position: relative
        z-index: 100
        .tag-time
          white-space: nowrap
          .time-title
            cursor: pointer
            display: inline-block
            position: relative
            margin-left: 1.5625vw
            padding-bottom: 10px
            font-size: $font-size-medium14
            color: $color-text
            &:hover
              color: $color-nomal
            &:before
              row-center()
              bottom: 0px
              content: ''
              height: 2px
              width: 32px
              background: $color-white
            &:last-child
              position: relative
              .block
                position: absolute
                bottom: -40px
                transform: translateX(-20%)
          .time-title-active
            color: $color-nomal
            &:before
              background: $color-nomal
      .tag-city, .tag-industry
        margin-left: 2.6vw
        display: flex
        font-size: $font-size-medium14
        color: $color-text
        .city-title
          line-height: 17px
          no-wrap()
        .city-select
          cursor: pointer
          height: 30px
          margin-left: 10px
          border: 1px solid $color-white
          border-radius: 4px
          font-size: $font-size-medium14
          color: $color-text-little
          transform: translateY(-25%)
          position: relative
          .city-show
            border: 1px solid $color-line
            border-radius: 2px
            padding: 0 39px 0 10px
            line-height: 30px
            height: 100%
            no-wrap()
            .city-tap
              position: absolute
              right: 0
              top: 0
              height: 100%
              width: 24px
              border-left: 1px solid $color-line
              .city-tap-top
                height: 0
                border: 6px solid $color-text-little
                border-bottom: 6px solid transparent
                border-left: 6px solid transparent
                border-right: 6px solid transparent
                row-center()
                top: 42%
                transform: rotate(0deg) translateX(-43%)
                transform-origin: 1px 3px
              .city-tap-top-two
                height: 0
                border: 6px solid $color-text
                border-bottom: 6px solid transparent
                border-left: 6px solid transparent
                border-right: 6px solid transparent
                row-center()
                top: 42%
                transform-origin: 1px 3px
                transform: rotate(0deg) translateX(-43%)
                transition: all 0.2s
              .city-tap-bottom
                border: 6px solid  $color-text
                border-bottom: 6px solid transparent
                border-left: 6px solid transparent
                border-right: 6px solid transparent
                row-center()
                top: 42%
                transform-origin: 1px 3px
                transform: rotate(180deg) translateX(-43%)
                transition: all 0.2s
          .city-show-active
            color: $color-text
          &:hover
            transition: color 0.2s
            .city-show
              color: $color-text
              border: 1px solid $color-text-little
              .city-tap
                border-left: 1px solid $color-text-little
              .city-tap-top
                border: 6px solid $color-text
                border-bottom: 6px solid transparent
                border-left: 6px solid transparent
                border-right: 6px solid transparent
                top: 42%
              .city-tap-bottom
                border: 6px solid  $color-text
                border-bottom: 6px solid transparent
                border-left: 6px solid transparent
                border-right: 6px solid transparent
                row-center()
                top: 42%
                transform-origin: 1px 3px
                transform: rotate(180deg) translateX(-43%)
                transition: all 0.2s
          .city-big-box
            position: absolute
            min-width: 100%
            z-index: 100
          .city-box
            width: 100%
            border-radius: 3px
            box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
            background: $color-white
            margin-top: 4px
            max-height: 228px
            overflow-y: auto
            &.fade-enter, &.fade-leave-to
              opacity: 0
            &.fade-enter-to, &.fade-leave-to
              transition: opacity .2s ease-in-out
            .city-box-item
              white-space: nowrap
              padding: 0 10px
              text-align: left
              height: 26px
              line-height: 26px
              font-size: $font-size-medium14
              &:hover
                background: $color-big-background
            .city-box-item-active
              background: $color-big-background
        .city-select-active
          color: $color-text
          border: 2px solid rgba(102, 102, 102, .2)
          .city-show
            border: 1px solid $color-text-little
    .tag-no-top
      height: 62px
    .data
      flex: 1
      padding: 25px
      position: relative
      .data-content
        height: 100%
        width: 100%
        background: $color-white
        display: flex
        flex-direction: column
        padding: 20px 20px 0
        box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.10)
        .data-content-box
          height: 100%
        .data-detail
          height: 90%
          position: relative
          .blank
            all-center()
            text-align: center
            .blank-icon
              icon-image('icon-null')
              width: 140px
              height: 89px
              margin-bottom: 30px
            .blank-title
              color: $color-text-little
        .total
          width: 100%
          height: 7.6%
          display: flex
          align-items: center
          justify-content: space-between
          padding: 0 15px 0 30px
          color: $color-text
          font-size: $font-size-medium14
          .page
            display: flex
            align-items: center
            .pade-detail
              margin-right: 10px
            .page-icon
              cursor: pointer
              icon-image('icon-before')
              margin-right: 10px
              height: 25px
              width: 25px
              &:hover
                icon-image('icon-before_hover')
            .page-icon-two
              icon-image('icon-later')
              &:hover
                icon-image('icon-later_hover')
            .border-page
              display: flex
              line-height: 25px
              border-radius: 3px
              margin-right: 10px
              border: 1px solid $color-line
              font-size: $font-size-medium14
            div.border-page
              margin-right: 0
              padding: 0 15px
              height: 25px
              line-height: 25px
              cursor: pointer
            div.page-total
              cursor: pointer
              padding-right: 33px
              position: relative
              .page-tap
                position: absolute
                right: 0
                top: 0
                height: 23px
                display: inline-block
                width: 18px
                border-left: 1px solid $color-line
                .page-top
                  row-center()
                  top: 44%
                  display: inline-block
                  height: 0
                  border: 5px solid $color-text
                  border-bottom: 5px solid transparent
                  border-left: 5px solid transparent
                  border-right: 5px solid transparent
                  transform-origin: 0.5px 2px
                  transform: rotate(0deg) translateX(-43%)
                  transition: all 0.2s
                .page-bottom
                  display: inline-block
                  height: 0
                  transform-origin: 0.5px 2px
                  transform: rotate(180deg) translateX(-43%)
                  transition: all 0.2s
              .page-list
                position: absolute
                width: 100%
                left: 0
                box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
                text-align: center
                background: $color-white
                border-radius: 3px
                bottom: 30px
                font-size: $font-size-medium14
                color: $color-text-little
                max-height: 290px
                overflow-y: auto
                &.fade-enter, &.fade-leave-to
                  opacity: 0
                &.fade-enter-to, &.fade-leave-to
                  transition: all .2s ease-in-out
                .page-item
                  cursor: pointer
                  height: 29px
                  line-height: 29px
                  &:hover
                    background: $color-big-background
                .page-item-active
                  background: $color-big-background
            input.border-page
              height: 25px
              width: 39px
              text-align: center
            .input-box
              border: 2px solid $color-white
              height: 29px
              width: 43px
              margin-right: 10px
            .page-box
              border: 2px solid $color-white
              height: 29px
              margin-right: 10px
        .totle-more
          height: 4.8%

  .shade-win
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
    .shade-detail
      all-center()
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      border-radius: 3px
      background: $color-white
      box-sizing: border-box
      width: 534px

  .herder-peo
    position: absolute
    top: 0
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
</style>
