<template>
  <form-box ref="order" :timeList="timeList" @checkTime="checkTime" @addPage="addPage" @showCity="showCity" @showIndustrie="showIndustrie" :pageDtail="pageDtail" :isIndustrie="isIndustrie">
    <div slot="form-list" class="form-list" v-show="showContent">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <ul class="list">
        <li class="list-box" v-for="(item,index) in datasList" :class="{'list-box-active': heightIndex === index}" :key="index" @mouseenter="showHeight(index)" @mouseleave="hideHeight">
          <div class="list-item list-text">{{item.date}}</div>
          <div class="list-item list-text">{{item.merchant_count}}</div>
          <div class="list-item list-text">{{item.user_count}}</div>
          <div class="list-item list-text">{{item.customer_count}}</div>
          <div class="list-item list-text">{{item.order_count}}</div>
          <div class="list-item list-text">{{item.money_total}}</div>
        </li>
      </ul>
    </div>
    <toast></toast>
  </form-box>
</template>

<script type="text/ecmascript-6">
  import FormBox from 'components/form-box/form-box'
  import datas from 'api/datas'
  import {ERR_OK} from 'api/config'
  import Toast from 'components/toast/toast'
  const titleList = ['日期', '商家数', '用户数', '客户数', '订单数', '交易金额']
  const statusList = [{title: '支付成功', status: 1}, {title: '退款', status: 3}]
  export default {
    data() {
      return {
        timeList: [{title: '7天', type: '7'}, {title: '30天', type: '30'}, {
          title: '自定义',
          type: ''
        }],
        titleList: titleList,
        datasList: [],
        time: 7,
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        page: 1,
        merchantDetail: [],
        isIndustrie: true,
        address: {},
        status: 1,
        statusList: statusList,
        shopId: {},
        heightIndex: -1,
        showContent: false
      }
    },
    created() {
      this.showList()
    },
    methods: {
      showIndustrie(res) {
        this.shopId = res
        this.showList()
      },
      level(type) {
        if (type === 'single') {
          if (this.merchantDetail.reseller_level !== 0) {
            this.merchantDetail.reseller_level = 0
          }
        } else {
          if (this.merchantDetail.reseller_level !== 1) {
            this.merchantDetail.reseller_level = 1
          }
        }
      },
      leader(type) {
        if (type === 'leader') {
          if (this.merchantDetail.is_leader !== 0) {
            this.merchantDetail.is_leader = 0
          }
        } else {
          if (this.merchantDetail.is_leader !== 1) {
            this.merchantDetail.is_leader = 1
          }
        }
      },
      hideShadeBox() {
        this.$refs.order.hideShade()
      },
      showList() {
        let data = {}
        data = Object.assign({}, {time: this.time, page: this.page}, this.address, this.shopId)
        datas.datasList(data).then((res) => {
          this.showContent = true
          if (res.error === ERR_OK) {
            this.datasList = res.data
            this.$refs.order.isBlank(res.data)
            let pages = res.meta
            this.pageDtail = [{total: pages.total, per_page: pages.per_page, total_page: pages.last_page}]
          }
        })
      },
      showHeight(index) {
        this.heightIndex = index
      },
      hideHeight() {
        this.heightIndex = -1
      },
      checkTime(value, page) {
        if (Array.isArray(value)) {
          this.time = value.join(',')
        } else {
          this.time = value
        }
        this.$refs.order.beginPage()
        this.page = 1
        this.showList()
      },
      addPage(page) {
        this.page = page
        this.showList()
      },
      orderStatus(status) {
        this.status = status
        this.showList()
      },
      showCity(prams, page) {
        this.address = this.$refs.order.infoData(prams)
        this.page = page
        this.showList()
      }
    },
    components: {
      'form-box': FormBox,
      'toast': Toast
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .form-list
    height: 100%
    .list-header, .list-box
      display: flex
      align-items: center
      padding-left: 43px
    .list-header
      height: 9.5%
      border-bottom: 1px solid $color-big-background
      background: $color-big-background
    .list
      height: 90.5%
      display: flex
      flex-direction: column
      .list-box
        height: 10%
        border-bottom: 1px solid $color-big-background
        .list-item
          line-height: 16px
          font-size: $font-size-medium
    .list-text
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
    .list-item
      color: $color-text
      flex: 1
      .showDetail
        cursor: pointer
        height: 25px
        font-size: $font-size-medium
        padding: 8px 18px
        color: $color-nomal
        border-radius: 3px
        border: 1px solid $color-nomal
      &:nth-child(1), &:nth-child(2)
        flex: 1.2
    .list-box-active
      background: $color-background
      /*修改*/
      .amend
        position: absolute
        right: 30px
        font-size: $font-size-medium
        padding: 8px 18px
        line-height: 1
        col-center()
        color: $color-nomal
        border: 1px solid $color-nomal
        border-radius: 3px
    .ok
      height: 9.26vh
      display: flex
      justify-content: center
      align-items: center
      .submit
        height: 40px
        width: 220px
        border-radius: 3px
        color: $color-white
        text-align: center
        line-height: 40px
        background: $color-nomal

  .selects
    display: flex
    font-size: $font-size-medium
    color: $color-text
    line-height: 30px
    transform: translateY(-25%)
    .select-box
      display: flex
      margin-left: 10px
      .select-item
        box-sizing: border-box
        width: 76px
        height: 30px
        line-height: 32px
        text-align center
        border: 1px solid $color-icon-line
        color: $color-text-icon
        &:nth-child(1)
          border-right: none
          border-bottom-left-radius: 3px
          border-top-left-radius: 3px
        &:nth-child(2)
          border-bottom-right-radius: 3px
          border-top-right-radius: 3px
          border-left: none
      .select-item-active
        border: none
        background: $color-nomal
        color: $color-white
</style>
