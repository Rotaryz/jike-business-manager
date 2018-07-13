<template>
  <div class="navigation" @mouseover="hideHover">
    <div class="big-show" :class="{'big-hide': showAnimation}" v-show="isBig">
      <div class="herder">
        <span class="icon"></span>
        {{title}}
      </div>
      <ul class="nav-big">
        <li class="nav-item" v-for="(item , index) in navList" :key="index"
            @click="showChild(index)" :style="{'height':item.showHeight+'px'}">
          <router-link :to="{path: item.url}" class="nav-tap" :class="{'nav-tap-active':bigChild === index,'nav-item-no-border':item.children.length > 1}">
            <span class="nav-icon"><img :src="item.icon" class="nav-pic"></span>
            <div class="nav-title" v-show="!showAnimation">
            <span v-for="(items , index) in item.title" :key="index">{{items}}
            </span>
            </div>
            <i class="nav" :class="{'nav-active': item.showHeight !== 60}" v-show="!showAnimation"></i>
          </router-link>
          <ul class="nav-big-child" v-if="item.children"
              v-show="item.children.length > 1">
            <li class="nav-item" v-for="(items , idx) in item.children" :key="idx" @click.stop="bigChildren(idx)" v-if="index === 0 && idx === 0 || index !== 0">
              <router-link :to="{path: items.url}" class="nav-tap" :class="item.childrenIndex === idx ? 'nav-big-active' : ''">
                <span class="nav-icon"><img src=""></span>
                <div class="nav-title">
                 <span v-for="(child , index) in items.title" :key="index">{{child}}
            </span>
                </div>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="small-show" v-show="!isBig"
         :class="{'small-hide': !showAnimation}">
      <div class="herder">
        <span class="icon"></span>
      </div>
      <ul class="nav-small" @mouseover.stop>
        <li class="nav-item" :class=" index === smallIndex ? 'nav-small-active' : '' "
            v-for="(item ,  index) in navList" :key="index"
            @mouseover="hoverChild(index)">
          <a href="javaScript:;" class="nav-tap">
            <span class="nav-icon"><img :src="item.icon" class="nav-pic"></span>
          </a>
          <div class="nav-small-box">
            <ul class="nav-small-child" v-if="item.children" v-show="index === hoverIndex">
              <li class="nav-item" v-for="(items , idx) in item.children" :class="hoverChildIndex === idx ? 'nav-item-active' : ''" :key="idx" @click.stop="hoverDetail(idx,index)" v-if="index === 0 && idx === 0 || index !== 0">
                <router-link :to="{path: items.url}" class="nav-tap">
                  <div class="small-title">{{items.title}}</div>
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const HEIGHT = 60
  const NAVLIST = [
    {
      title: '首页',
      url: '/',
      icon: require('./icon-homepage@2x.png'),
      childrenIndex: -1,
      children: [{
        title: '首页',
        url: '/'
      }],
      showHeight: HEIGHT
    }, {
      title: '小程序管理',
      url: 'officialNetwork',
      icon: require('./icon-applet_selected@2x.png'),
      childrenIndex: -1,
      children: [{
        title: '公司官网',
        url: 'officialNetwork'
      }, {
        title: '公司产品',
        url: 'product'
      }],
      showHeight: HEIGHT
    }, {
      title: '员工管理',
      url: 'organizationalStructure',
      icon: require('./icon-staff@2x.png'),
      childrenIndex: -1,
      children: [{
        title: '组织架构',
        url: 'organizationalStructure'
      }, {
        title: '权限管理',
        url: 'authorityManagement'
      }],
      showHeight: HEIGHT
    }, {
      title: '授权管理',
      icon: require('./icon-authorization@2x.png'),
      url: 'authorizationManagement',
      childrenIndex: -1,
      children: [{
        title: '授权管理',
        url: 'authorizationManagement'
      }],
      showHeight: HEIGHT
    }, {
      title: '账户中心',
      icon: require('./icon-account@2x.png'),
      url: 'accountCenter',
      childrenIndex: -1,
      children: [{
        title: '账户中心',
        url: 'accountCenter'
      }],
      showHeight: HEIGHT
    }]
  // {
  //        title: '订单列表',
  //        url: '#/container/order'
  //      }
  export default {
    data () {
      return {
        smallIndex: 0,
        title: '商家管理平台',
        navList: NAVLIST,
        hoverIndex: -1,
        hoverChildIndex: 0,
        isBig: true,
        bigChild: 1,
        showHeight: HEIGHT,
        timer: null,
        clickChild: 0,
        recodIndex: -1,
        showAnimation: false,
        sortTimer: null
      }
    },
    created () {
      let path = this.$route.matched[1].path
      this.info(path)
    },
    methods: {
      info (path) {
        //     待处理
        switch (path) {
          case '/container/productManagement':
            this.showChild(2)
            this.bigChildren(1)
            break
          case '/container/addEmployees':
            this.showChild(2)
            this.bigChildren(0)
            break
        }
        let rootType = path.split('/')
        let type = rootType[rootType.length - 1]
        this.navList.forEach((item, idx) => {
          if (item.children.length > 1) {
            item.children.forEach((items, index) => {
              if (items.url.includes(type)) {
                this.showChild(idx)
                this.bigChildren(index)
              } else {
                item.showHeight = HEIGHT
              }
            })
          } else {
            if (item.url.includes(type)) {
              this.showChild(idx)
            }
          }
        })
      },
      showChild (index, status = true) {
        this.smallIndex = index
        clearInterval(this.timer)
        if (this.navList[index].children.length === 1) {
          if (this.recodIndex !== -1) {
            this.timer = setInterval(() => {
              if (this.navList[this.recodIndex].showHeight <= HEIGHT) {
                this.navList[this.recodIndex].showHeight = HEIGHT
                clearInterval(this.timer)
                return false
              }
              this.navList[this.recodIndex].showHeight -= 20
            }, 30)
          }
          this.bigChild = index
        } else if (this.navList[index].children.length > 1) {
          clearInterval(this.timer)
          let childCode = this.navList[index].childrenIndex === -1 ? 0 : this.navList[index].childrenIndex
          this.recodIndex = index
          this.navList[this.recodIndex].childrenIndex = childCode
          this.bigChild = -1
          clearInterval(this.timer)
          for (let i = 0; i < this.navList.length; i++) {
            if (i !== index && this.navList[i].showHeight > HEIGHT) {
              clearInterval(this.sortTimer)
              this.sortTimer = setInterval(() => {
                if (this.navList[i].showHeight <= HEIGHT) {
                  this.navList[i].showHeight = HEIGHT
                  clearInterval(this.sortTimer)
                  return
                }
                this.navList[i].showHeight -= 20
              }, 30)
            } else {
              clearInterval(this.timer)
              let num = index === 0 ? 1 : this.navList[index].children.length
              if (this.navList[index].showHeight === HEIGHT) {
                let target = (num + 1) * HEIGHT
                this.timer = setInterval(() => {
                  if (this.navList[index].showHeight >= target) {
                    this.navList[index].showHeight = target
                    clearInterval(this.timer)
                    return
                  }
                  this.navList[index].showHeight += 20
                }, 30)
              } else {
                if (status) {
                  this.timer = setInterval(() => {
                    if (this.navList[index].showHeight <= HEIGHT) {
                      this.navList[index].showHeight = HEIGHT
                      clearInterval(this.timer)
                      return
                    }
                    this.navList[index].showHeight -= 20
                  }, 30)
                }
              }
            }
          }
        }
      },
      bigChildren (index) {
        this.navList[this.recodIndex].childrenIndex = index
        let num = this.recodIndex
        this.navList[num].url = this.navList[num].children[this.navList[num].childrenIndex].url
      },
      hoverChild (index) {
        this.hoverIndex = index
        this.hoverChildIndex = this.navList[index].childrenIndex
      },
      hideHover () {
        this.hoverIndex = -1
      },
      hoverDetail (index, parent) {
        this.smallIndex = parent
        this.hoverChildIndex = index
        this.hoverIndex = parent
        this.navList[parent].childrenIndex = index
        this.navList.forEach((item, idx) => {
          if (idx !== parent) {
            item.childrenIndex = -1
          }
        })
        if (this.navList[parent].children.length > 1) {
          this.showChild(parent, false)
          this.navList[parent].childrenIndex = index
          return false
        }
        this.showChild(parent)
      },
      isShowBig () {
        this.showAnimation = !this.showAnimation
        let marWidth = 0
        this.showAnimation ? marWidth = 79 : marWidth = 200
        this.title = '' || '赞播管理后台'
        setTimeout(() => {
          this.isBig = !this.isBig
          if (!this.isBig) {
            if (this.navList[this.recodIndex].showHeight > HEIGHT) {
              let target = HEIGHT
              this.timer = setInterval(() => {
                if (this.navList[this.recodIndex].showHeight >= target) {
                  this.navList[this.recodIndex].showHeight = HEIGHT
                  clearInterval(this.timer)
                  return false
                }
                this.navList[this.recodIndex].showHeight -= 20
              }, 30)
            }
          } else {
            let num = 0
            this.bigChild === -1 ? num = this.recodIndex : num = this.bigChild

            this.showChild(num, false)
          }
        }, 200)
        return marWidth
      }
    },
    watch: {
      '$route' (to, form) {
        let title = to.meta.title
        // let item = this.navList.find(item => item.url)
        sessionStorage.setItem('title', title)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .navigation
    float: left
    background: $color-menu-background
    color: $color-white
    height: 100vh
    position: relative
    z-index: 1000
    .big-show
      width: 200px
      .herder
        padding-left: 52px
        height: 65px
        overflow: hidden
        line-height: 67px
        font-size: $font-size-large20
        background: $color-menu-select
        position: relative
        .icon
          col-center()
          icon-image('pic-logo_menu')
          height: 20px
          width: 18px
          left: 29px
      .nav-big
        .nav-item
          background: $color-menu-background
          overflow: hidden
          border-bottom: 1px solid #3B3B43
          .nav-tap
            transition: all 0.2s
            align-items: center
            color: $color-white
            display: flex
            height: 60px
            width: 100%
            position: relative
            .nav-icon
              height: 100%
              width: 55px
              position: relative
              .nav-pic
                height: 17px
                col-center()
                left: 27px
            .nav-title
              width: 64px
              display: flex
              font-family: 'PingFangSC-Light'
              font-size: $font-size-medium16
              justify-content: space-between
            .nav
              col-center()
              height: 18px
              width: 18px
              right: 23px
              icon-image('icon-pressed')
              transform-origin: 50% 0%
              transform: rotate(0deg) translateY(-50%)
              transition: transform 0.2s
            .nav-active
              transform-origin: 50% 0%
              transform: rotate(90deg) translateY(-50%)
              transition: transform 0.2s
            &:hover
              background: $color-menu-select
              transition: all 0.2s
          .nav-tap-active
            background: $color-nomal !important

        .nav-big-child
          .nav-tap
            .nav-icon
              width: 46px
          .nav-title
            margin-left: 13px
          .nav-big-active
            background: $color-nomal !important
    .big-hide
      width: 79px
      transition: all .2s

    .small-show
      width: 79px
      .herder
        height: 65px
        background: $color-menu-select
        position: relative
        .icon
          icon-image('pic-logo_menu')
          height: 32px
          width: 30px
          col-center()
          transform: translateY(-55%)
          left: 22px
      .nav-small
        .nav-item
          height: 60px
          border-bottom: 1px solid #3B3B43
          position: relative
          .nav-tap
            display: block
            height: 100%
            width: 100%
            color: $color-white
            line-height: 46px
          .nav-pic
            height: 17px
            col-center()
            left: 20px
          .nav-small-box
            position: absolute
            right: -177px
            top: 5px
            padding-left: 3px
            background: $color-white
          .nav-small-child
            background: $color-menu-background
            border-radius: 4px
            z-index: 300
            .nav-item
              height: 46px
              border: none
              &:first-child
                border-top-right-radius: 3px
                border-top-left-radius: 3px
              &:last-child
                border-bottom-right-radius: 3px
                border-bottom-left-radius: 3px
              .nav-tap
                font-size: $font-size-medium16
                padding: 0 70px 0 20px
                .small-title
                  min-width: 84px
            .nav-item-active
              background: $color-menu-select
          &:hover
            background: $color-menu-select
        .nav-small-active
          background: $color-nomal !important
    .small-hide
      width: 200px
      transition: all .2s

</style>
