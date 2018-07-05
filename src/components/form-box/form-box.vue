<template>
  <div class="form-box">
    <div class="tag" :class="{'tag-no-top':tagTop}">
      <div class="tag-title">
        <span class="title-item" v-for="(item,index) in navTitle" :key="index">{{index > 0 ? '/' : ''}} {{item}}</span>
      </div>
      <div class="tag-choice" v-if="chioce">
        <slot name="order-sec"></slot>
        <div class="tag-time" v-if="isDate">
          <span class="time-title" v-for="(item, index) in timeList"
                :key="index" :class="{'time-title-active': timeIndex === index}"
                @click="checkTime(index,item.type)">
            {{item.title}}
             <div class="block" v-if="item.type === ''" v-show="showPicker">
              <el-date-picker
                v-model="moreTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </span>
        </div>
        <div class="tag-city" v-if="isCity">
          <span class="city-title">地域筛选</span>
          <div class="city-select" v-for="(item, index) in cityList" :class="{'city-select-active': item.show}"
               :key="index" @click.stop="checkCity(index)" @mouseleave="leaveHide" @mouseenter="endShow" :style="{'cursor': prams[index - 1] === '' && index !== 0 ? 'not-allowed' : 'pointer'}">
            <div class="city-show" :class="{'city-show-active':item.active}">
              {{item.title}}
              <div class="city-tap">
                <span class="city-tap-top" :class="{'city-tap-bottom':item.show && item.active,'city-tap-top-two': !item.show && item.active}"></span>
              </div>
            </div>
            <div class="city-big-box">
              <transition name="fade">
                <ul class="city-box" v-show="item.show">
                  <li class="city-box-item" v-for="(items, idx) in item.data"
                      :class="{'city-box-item-active':item.index === idx}"
                      :key="idx" @click.stop="showCityList(idx,index,items)">{{items}}
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </div>
        <div class="tag-industry" v-if="isIndustrie">
          <span class="city-title">行业筛选</span>
          <div class="city-select" v-for="(item, index) in industrieList" :class="{'city-select-active': item.show}"
               :key="index" @click.stop="industrie(index)" @mouseleave="leaveHide" @mouseenter="endShow" :style="{'cursor': industrieId === -1 && index !== 0 ? 'not-allowed' : 'pointer'}">
            <div class="city-show" :class="{'city-show-active':item.active}">
              {{item.title}}
              <div class="city-tap">
                <span class="city-tap-top" :class="{'city-tap-bottom':item.show && item.active,'city-tap-top-two': !item.show && item.active}"></span>
              </div>
            </div>
            <div class="city-big-box">
              <transition name="fade">
                <ul class="city-box" v-show="item.show">
                  <li class="city-box-item" v-for="(items, idx) in item.data"
                      :key="idx"
                      :class="{'city-box-item-active':item.index === idx}"
                      @click.stop="industrieDetail(idx,index,items.name,items.id)">
                    {{items.name}}
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </div>
        <slot name="tag-sel"></slot>
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
                <input type="number" class="border-page input-height-item" v-model="pageInput" :focus="focus" @click.stop="focus = !focus"/>
              </div>
              <div class="border-page input-height-item" @click="goPage" @mouseenter="notAllowed" :style="{'cursor': isHand.handGo}">跳转</div>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import globals from 'api/globals'
  import {ERR_OK} from 'api/config'
  import Toast from 'components/toast/toast'
  const allWay = '全部'
  const shopWay = {id: 0, name: '全部', parent_id: -1}
  export default {
    name: 'demonstration',
    props: {
      tagTop: {
        type: Boolean,
        default: false
      },
      pageShow: {
        type: Boolean,
        default: true
      },
      timeList: {
        type: Array,
        default: () => [{title: '今天', type: '1'}, {
          title: '昨天',
          type: '-1'
        }, {title: '7天', type: '7'}, {title: '30天', type: '30'}, {
          title: '自定义',
          type: ''
        }]
      },
      chioce: {
        type: Boolean,
        default: true
      },
      isCity: {
        type: Boolean,
        default: true
      },
      isDate: {
        type: Boolean,
        default: true
      },
      isIndustrie: {
        type: Boolean,
        default: true
      },
      pageDtail: {
        type: Array,
        default: () => [{total: 1, per_page: 10, total_page: 0}]
      }
    },
    data() {
      return {
        focus: false,
        showBlank: false,
        moreTime: '',
        pageInput: '',
        timeIndex: 0,
        isShade: false,
        page: 1,
        pageDetail: false,
        showPicker: false,
        pageIndex: 0,
        prams: ['', '', '', ''],
        cityIndex: 0,
        industrieList: [{
          title: '行业',
          data: [],
          show: false,
          index: -1
        }, {
          title: '子行业',
          data: [],
          show: false,
          index: -1
        }],
        industrieId: -1,
        cityList: [{
          title: '省',
          type: 'province',
          data: [],
          show: false,
          index: -1
        }, {
          title: '市',
          type: 'city',
          data: [],
          show: false,
          index: -1
        }, {
          title: '区',
          type: 'district',
          data: [],
          show: false,
          index: -1
        }, {
          title: '商圈',
          type: 'business_circle',
          data: [],
          show: false,
          index: -1
        }],
        shopIndex: 0,
        shopData: ['', ''],
        navTitle: [],
        setTime: null,
        isHand: {handLeft: 'pointer', handRight: 'pointer', handGo: 'pointer'}
      }
    },
    created() {
      this.showCity()
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
      setNavTitle() {
        setTimeout(() => {
          this.navTitle = sessionStorage.getItem('title') ? sessionStorage.getItem('title').split(',') : this.navTitle
        }, 30)
      },
      hideHeightLine() {
        this.timeIndex = -1
        return this.timeIndex
      },
      isBlank(res) {
        if (res.length === 0) {
          this.showBlank = true
        } else {
          this.showBlank = false
        }
      },
      leaveHide() {
        this.setTime = setTimeout(() => {
          this.clickHide()
        }, 1500)
      },
      clickHide() {
        this.cityList.forEach((item) => {
          item.show = false
        })
        this.industrieList.forEach((item) => {
          item.show = false
        })
      },
      endShow() {
        clearTimeout(this.setTime)
      },
      industrieDetail(idx, index, title, id) {
        this.cityList[index].index = idx
        setTimeout(() => {
          this.industrieList[index].show = false
          this.industrieList[index].title = title
          this.shopData[index] = id
          this.industrieId = id
          this.beginPage()
          this.shopData.forEach((item, idx) => {
            if (idx > index) {
              if (idx === 1) {
                this.industrieList[idx].title = '子行业'
              }
            }
          })
          let shop = {parent_id: this.shopData[0], child_id: this.shopData[1]}
          this.$emit('showIndustrie', shop)
        }, 100)
      },
      showIndustrie() {
        let data = {}
        if (this.industrieId !== -1) {
          data = {partent_id: this.shopData[0]}
        }
        globals.industrie(data).then((res) => {
          if (res.error === ERR_OK) {
            this.industrieList[this.shopIndex].data = res.data
            this.industrieList[this.shopIndex].data.unshift(shopWay)
          }
        })
      },
      industrie(index) {
        this.cityList.forEach((item) => {
          item.show = false
        })
        this.industrieList.forEach((item, idx) => {
          if (idx !== index) {
            item.show = false
          }
        })
        if (index === 0) {
          this.industrieId = -1
          this.shopData[1] = ''
        } else if (index === 1 && this.industrieId === -1) {
          return false
        }
        if (index > 0 && this.shopData[0] === '') {
          return false
        }
        this.hideShade()
        this.shopIndex = index
        this.industrieList[index].show = !this.industrieList[index].show
        this.industrieList[index].active = true
        this.showIndustrie()
      },
      goPage() {
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
      showPageDetail() {
        this.pageDetail = !this.pageDetail
      },
      hidePageDetail() {
        this.clickHide()
        this.pageDetail = false
        this.focus = false
      },
      detailPage(page) {
        this.page = page
        this.pageIndex = page
        setTimeout(() => {
          this.hidePageDetail()
        }, 100)
        this.$emit('addPage', this.page)
      },
      showCity() {
        this.hideShade()
        let data = this.infoData(this.prams)
        globals.businessCircle(data).then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.filter[this.cityList[this.cityIndex].type]) {
              this.cityList[this.cityIndex].data = res.data.filter[this.cityList[this.cityIndex].type]
              this.cityList[this.cityIndex].data.unshift(allWay)
            }
          }
        })
      },
      checkCity(index) {
        this.industrieList.forEach((item) => {
          item.show = false
        })
        this.regPrams()
        this.cityList.forEach((item, idx) => {
          if (idx !== index) {
            item.show = false
          }
        })
        if (index > 0 && (this.prams[index - 1] === '' || this.prams[index - 1].length === 1)) {
          return false
        }
        this.cityIndex = index
        this.cityList[index].show = !this.cityList[index].show
        this.cityList[index].active = true
        this.showCity()
      },
      showCityList(idx, index, title) {
        this.cityList[index].index = idx
        setTimeout(() => {
          this.cityList[index].show = false
          this.cityList[index].title = title
          this.prams.forEach((item, idx) => {
            if (idx > index) {
              if (idx === 1) {
                this.cityList[idx].title = '市'
              } else if (idx === 2) {
                this.cityList[idx].title = '区'
              } else if (idx === 3) {
                this.cityList[idx].title = '商圈'
              }
            }
          })
          this.regPrams()
          this.beginPage()
          this.$emit('showCity', this.prams, this.page)
        }, 100)
      },
      regPrams() {
        for (let i = 0; i < this.prams.length; i++) {
          this.prams[i] = this.cityList[i].title.replace(/^(市)|^(区)|^(商圈)/g, '')
        }
      },
      infoData(res) {
        let data = {
          province: res[0],
          city: res[1],
          district: res[2],
          business_circle: res[3]
        }
        return data
      },
      checkTime(index, type) {
        this.hideShade()
        this.timeIndex = index
        if (type === '') {
          this.moreTime = ''
          this.showPicker = true
          return false
        }
        this.showPicker = false
        this.$emit('checkTime', type, this.page)
      },
      showShade() {
        this.isShade = true
      },
      hideShade() {
        this.isShade = false
      },
      addPage() {
        if (this.page < this.pageDtail[0].total_page) {
          this.page++
          this.$emit('addPage', this.page)
        }
        this.notAllowed()
      },
      notAllowed() {
        this.page === 1 ? this.isHand.handLeft = 'not-allowed' : this.isHand.handLeft = 'pointer'
        this.page === this.pageDtail[0].total_page ? this.isHand.handRight = 'not-allowed' : this.isHand.handRight = 'pointer'
        this.pageInput === '' ? this.isHand.handGo = 'not-allowed' : this.isHand.handGo = 'pointer'
      },
      subtract() {
        if (this.page > 1) {
          this.page--
          this.$emit('addPage', this.page)
        }
        this.notAllowed()
      },
      showContent(content, time) {
        const showTime = time || 1000
        this.$refs.toast.show(content, showTime)
      },
      beginPage() {
        this.pageInput = ''
        this.page = 1
      }
    },
    watch: {
      moreTime(newVal) {
        let time = []
        if (Array.isArray(newVal)) {
          newVal.forEach((item) => {
            time.push(item.toLocaleDateString().replace(/\//g, '-'))
          })
          this.$emit('checkTime', time, 1)
        }
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
  .form-box
    height: 100%
    min-height: 700px
    overflow-y: auto
    display: flex
    flex-direction: column
    .tag
      background: $color-white
      position: relative
      z-index: 150
      height: 150px
      .tag-title
        padding: 3.47vh 0 1.57vh 0
        font-size: $font-size-large
        height : $font-size-large
        color: $color-text-little
        text-indent: 30px
        position: relative
        &:before
          content: ''
          position: absolute
          background: $color-nomal
          top: 3.47vh
          height: 18px
          width: 4px
          left: 25px
        .title-item
          margin-left: 7px
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
            font-size: $font-size-medium
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
        font-size: $font-size-medium
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
          font-size: $font-size-medium
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
              font-size: $font-size-medium
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
          font-size: $font-size-medium
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
              font-size: $font-size-medium
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
                font-size: $font-size-medium
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
        height: 100%
        width: 100%
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
          width: 450px
</style>
