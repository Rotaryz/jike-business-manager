<template>
  <form-box ref="order" :pageShow="false" @addPage="addPage" :tagTop="true" :pageDtail="pageDtail" :chioce="false" :isIndustrie="false">
    <div slot="money">
      <div class="money">
        <div class="monry-item">
          <div class="monty-title">总收入<span class="unit">单位：元</span></div>
          <div class="money-detail">{{moneyDetail.total_sale}}</div>
          <div class="sale">
            <div class="sale-item">昨天收入：{{moneyDetail.yesterday_sale}}</div>
            <div class="sale-item">今天收入：{{moneyDetail.today_sale}}</div>
          </div>
        </div>
        <div class="monry-item">
          <div class="monty-title">总支出<span class="unit">单位：元</span></div>
          <div class="money-detail">{{moneyDetail.total_expenditure}}</div>
        </div>
      </div>
      <div class="check-tip">
        <div class="tap-first">
          <div class="tap-item" v-for="(item, index) in timeList" :class="{'tap-item-active' : timeIndex === index}" :key="index" @click="timeCheck(index, item.type)">
            {{item.title}}
            <div class="block" v-if="item.type === ''" v-show="showPicker">
              <el-date-picker
                v-model="moreTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="select">
          <admin-select :select="selectList" @selectType="selectType" @setValue="setValue"></admin-select>
        </div>
        <a class="down-excel hand" :href="excel" target="_blank">下载Excel</a>
      </div>
    </div>
    <div slot="form-list" class="form-box-small">
      <div class="form-list">
        <div class="list-header">
          <div class="list-item" v-for="(item, index) in titleListSec" :key="index">
            {{item}}
          </div>
        </div>
        <ul class="list">
          <li class="list-box" v-for="(item,index) in accountsList" :key="index">
            <div class="list-item list-text">{{item.pay_time}}</div>
            <div class="list-item list-text">{{item.pay_type}}</div>
            <div class="list-item list-text">{{item.order_type}}</div>
            <div class="list-item list-text">{{item.money}}</div>
          </li>
        </ul>
      </div>
    </div>
  </form-box>
</template>

<script type="text/ecmascript-6">
  import FormBox from 'components/form-box/form-box'
  import monies from 'api/monies'
  import AdminSelect from 'components/admin-select/admin-select'
  import {ERR_OK, BASE_URL} from 'api/config'
  import {mixinBase} from 'common/mixin/base'
  const TITLELIST = ['支付时间', '收/支', '业务类型', '交易金额']
  const BUSINESS = [{title: '全部', status: ''}, {title: '优惠券', status: 0}, {title: '门店年费', status: 3}, {title: '红包创建', status: 2}, {title: '买单', status: 5}, {title: '联盟投放', status: 6}, {title: '礼包', status: 7}]
  const BUSINESS2 = [{title: '全部', status: ''}, {title: '门店提现', status: 1}, {title: '顾客提现', status: 4}]
  const TOKEN = localStorage.getItem('business-token') || sessionStorage.getItem('business-token')
  const SELECT = [{
    title: '开通方式',
    type: 'open',
    select: false,
    show: false,
    children: [{
      content: '收入',
      data: [{
        title: '收入',
        status: 0
      }, {title: '支出', status: 1}]
    }]
  }, {
    title: '业务类型',
    type: 'state',
    select: false,
    show: false,
    children: [{content: '全部', data: BUSINESS}]
  }]
  export default {
    mixins: [mixinBase],
    data() {
      return {
        titleListSec: TITLELIST,
        showPicker: false,
        moreTime: '', // 时间区间
        selectList: SELECT,
        timeList: [{title: '今天', type: 'today'}, {
          title: '昨天',
          type: 'yesterday'
        }, {title: '7天', type: 'week'}, {title: '30天', type: 'month'}, {
          title: '自定义',
          type: ''
        }],
        tapIndex: 0,
        accountsList: [],
        industryList: [],
        type: '',
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        page: 1,
        isCity: false,
        address: {},
        cityIndex: 0,
        prams: ['', '', ''],
        name: '',
        insId: 0,
        heightIndex: -1,
        time: 'today',
        startTime: '',
        endTime: '',
        timeIndex: 0,
        payType: 0,
        orderType: '',
        moneyDetail: {},
        excel: `${BASE_URL.api}/api/monies/download-money-orders?access_token=${TOKEN}&order_type=0&start_time=&end_time=0&pay_type=0&time=`
      }
    },
    created() {
      this.showList()
      this.showMoney()
    },
    methods: {
//      账单明细
      showMoney() {
        monies.accounts().then((res) => {
          if (res.error === ERR_OK) {
            this.moneyDetail = res.data
          }
        })
      },
//      下拉选择
      selectType(type, res) {
        this.type = type
        this.selectList = res
      },
      setValue(res, idx) {
        if (this.type === 'open') {
          switch (res.status) {
            case 0:
              this.selectList[1].children[idx].data = BUSINESS
              break
            case 1:
              this.selectList[1].children[idx].data = BUSINESS2
              break
          }
          this.selectList[1].children[idx].content = this.selectList[1].children[idx].data[0].title
          this.payType = res.status
          this.orderType = this.selectList[1].children[idx].data[0].status
        } else {
          this.orderType = res.status
        }
        this.showList()
      },
//      时间筛选
      timeCheck(index, type) {
        this.time = type
        this.timeIndex = index
        if (type === '') {
          this.moreTime = ''
          this.showPicker = true
          return false
        }
        this.startTime = ''
        this.endTime = ''
        this.$refs.order.beginPage()
        this.showPicker = false
        this.showList()
      },
      showHeight(index) {
        this.heightIndex = index
      },
      hideHeight() {
        this.heightIndex = -1
      },
      showList() {
        let data = {time: this.time, page: this.page, start_time: this.startTime, end_time: this.endTime, order_type: this.orderType, pay_type: this.payType}
        monies.accountsDetail(data).then((res) => {
          this.pageDtail = [{total: 1, per_page: 7, total_page: 1}]
          this.accountsList = res.data
        })
        this.excel = `${BASE_URL.api}/api/monies/download-money-orders?access_token=${TOKEN}&order_type=${this.orderType}&pay_type=${this.payType}&start_time=${this.startTime}&end_time=${this.endTime}&time=${this.time}`
      },
//      页码
      addPage(page) {
        this.page = page
        this.showList()
      }
    },

    watch: {
//      时间区间筛选
      moreTime(newVal) {
        let time = []
        if (Array.isArray(newVal)) {
          newVal.forEach((item) => {
            time.push(this.farmatTime(item))
          })
          this.time = ''
          this.startTime = time[0]
          this.endTime = time[1]
          this.$refs.order.beginPage()
          this.showList()
        }
      }
    },
    components: {
      'admin-select': AdminSelect,
      'form-box': FormBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .money
    background: $color-white
    margin: 24px 24px 0
    height: 13.74vh
    min-height: 120px
    display: flex
    position: relative
    &:before
      content: ''
      width: 1px
      height: 12.407vh
      background: $color-icon-line
      all-center()
    .monry-item
      flex: 1
      padding: 0 5.5vw 0 2.8vw
      .monty-title
        color: $color-text
        font-size: $font-size-medium16
        display: flex
        justify-content: space-between
        margin: 2vh 0 2vh 0
        .unit
          color: $color-text-icon
      .money-detail
        text-align: center
        color: $color-text-icon
        font-size: $font-money-size
        transform: translateY(-14PX)
        font-weight: 600
        font-family: 'ZegoeUI-Bold'
      .sale
        transform: translateY(-5PX)
        display: flex
        justify-content: center
        font-family: PingFang-SC-Medium
        .sale-item
          &:first-child
            margin-right: 3.125vw

  .form-box-small
    min-height: 380px !important
    display: flex
    height: 90%
    flex-direction: column
    background: $color-white
    .form-list
      height: 95%
      background: $color-white
      .list-header, .list-box
        display: flex
        align-items: center
        padding-left: 43px
      .list-header
        height: 14.5%
        border-bottom: 1px solid $color-big-background
        background: $color-big-background
      .list
        height: 85.5%
        display: flex
        flex-direction: column
        .list-box
          height: 14.2857%
          border-bottom: 1px solid $color-big-background
          &:hover
            background :$color-background
          .list-item
            white-space: nowrap
            line-height: 16px
            font-size: $font-size-medium
      .list-text
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden
      .list-item
        color: $color-text
        flex: 2
        &:first-child
          flex: 2.5
        .showDetail
          cursor: pointer
          height: 25px
          font-size: $font-size-medium
          padding: 8px 18px
          color: $color-nomal
          border-radius: 3px
          border: 1px solid $color-nomal

  .shade-box
    .shade-border
      border-bottom: 1px solid #DADADA
      font-size: $font-size-medium
      padding-left: 30px
      height: 50px
      line-height: 50px
      display: flex
      color: $color-text
      position: relative
      .shade-text:disabled
        background: $color-white
      .shade-text
        width: 52%
      .shade-title
        width: 112px
        no-wrap()
      &:first-child
        font-size: $font-size-medium16
        height: 60px
        line-height: 60px
        position: relative
        .close
          cursor: pointer
          position: absolute
          col-center()
          right: 30px
          color: #979797
          font-size: 24px
    .ok
      height: 100px
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

  .check-tip
    display: flex
    background: $color-white
    margin: 24px 24px 0
    height: 80px
    align-items: center
    position: relative
    z-index: 100
    .tap-first
      margin-left: 37.5px
      display: flex
      white-space: nowrap
      .tap-item
        font-size: $font-size-medium
        color: $color-text
        cursor: pointer
        line-height: 20px
        margin-right: 1.5625vw
        position: relative
        .block
          position: absolute
          z-index: 150
          bottom: -48px
          transform: translateX(-20%)
        &:hover
          color: $color-nomal
        &:before
          row-center()
          bottom: -8px
          content: ''
          height: 2px
          width: 32px
          background: $color-white
      .tap-item-active
        color: $color-nomal
        &:before
          background: $color-nomal
    .selects
      display: flex
      font-size: $font-size-medium
      color: $color-text
      line-height: 30px
      transform: translateY(-1%)
      margin-left: 3.535vw
      .select-title
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .select-box
        display: flex
        margin-left: 10px
        .select-item
          box-sizing: border-box
          width: 3.958vw
          height: 30px
          line-height: 30px
          text-align center
          color: $color-text-icon
          border: 1px solid $color-icon-line
          border-right: none
          &:first-child
            border-top-left-radius: 3px
            border-bottom-left-radius: 3px
          &:last-child
            border-top-right-radius: 3px
            border-bottom-right-radius: 3px
            border-right: 1px solid $color-icon-line
        .select-item-none
          border-left: none
        .select-item-active
          border: none
          background: $color-nomal
          color: $color-white
    .search
      height: 30px
      margin-left: 3.535vw
      display: flex
      font-size: $font-size-medium
      .search-input
        height: 100%
        border: 1px solid $color-icon-line
        border-top-left-radius: 3px
        border-bottom-left-radius: 3px
        border-right: none
        width: 8.02vw
        padding-left: 10px
        &::-webkit-input-placeholder
          color: $color-text-little
      .search-title
        width: 60px
        height: 100%
        text-align: center
        background: $color-nomal
        color: $color-white
        line-height: 30px
        border-top-right-radius: 3px
        border-bottom-right-radius: 3px
        &:hover
          background: $color-hover
        &:active
          background: $color-active
    .down-excel
      font-size: $font-size-medium
      height: 30px
      line-height: 30px
      text-align: center
      margin-left: 3.535vw
      border-radius: 3px
      background: $color-nomal
      color: $color-white
      width: 5.625vw
      &:hover
        background: $color-hover
      &:active
        background: $color-active

  .select
    margin-left: 3.535vw
    transform: translateY(28%)
</style>
