<template>
  <form-box ref="order" :timeList="timeList" @checkTime="checkTime" @addPage="addPage" @showCity="showCity" :pageDtail="pageDtail" :isIndustrie="isIndustrie" :isCity="false">
    <div class="selects" slot="tag-sel">
      <div class="selects-item">
        <span class="select-title">商户账号</span>
        <div class="selects-inpput-box" :class="{'input-height':bussFocus}">
          <input type="text" class="input-height-item select-input" v-model="busInput" placeholder="请输入商户账号" @focus="bussFocus = true" @blur="bussFocus = false">
        </div>
      </div>
      <div slot="tap" class="select">
        <admin-select :select="selectList" @selectType="selectType" @setValue="setValue"></admin-select>
      </div>
      <div class="select-box">
        <span class="select-item hand select-item-active" @click="sreach">搜索</span>
      </div>
    </div>
    <div slot="form-list" class="form-list" v-show="showContent">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <ul class="list">
        <li class="list-box" v-for="(item,index) in orderList" :key="index" :class="{'list-box-active': heightIndex === index}" @mouseenter="showHeight(index)" @mouseleave="hideHeight">
          <a href="javaScript:;" class="list-item list-text" :title="item.created_at"><div class="list-none">{{item.created_at}}</div></a>
          <div class="list-item list-text">{{item.order_type === '1' ? '门店提现' : item.order_type === '4' ? '顾客提现' : item.order_type === '12' ? '异业联盟员工提现' : item.order_type === '13' ? '异业联盟商家提现' : ''}}</div>
          <div class="list-item list-text">{{item.merchant_mobile}}</div>
          <div class="list-item list-text">{{item.bank}}</div>
          <a href="javaScript:;" class="list-item list-text" :title="item.withdrawal_card"><div class="list-none">{{item.withdrawal_card}}</div></a>
          <div class="list-item list-text">{{item.user_name}}</div>
          <div class="list-item list-text">{{item.remaining}}</div>
          <div class="list-item list-text">{{item.blocked_remaining}}</div>
          <div class="list-item list-text">{{item.total}}</div>
          <div class="list-item list-text">{{item.status === 0 ? '未处理' : item.status === 1 ? '受理成功' : item.status === 2 ? '审核不通过' : item.status === 3 ? '提现成功' : '过期退款'}}</div>
          <!--<div class="list-item list-text">{{item.operation_time}}</div>-->
          <!--<div class="list-item list-text">{{item.admin_name}}</div>-->
          <div class="list-item"><span class="showDetail" :class="item.status === 1 || item.status === 3? 'audit-disable' : 'audit'" @click="showDetail(item)">审核</span></div>
        </li>
      </ul>
    </div>
    <div slot="shade-box" class="shade-box">
      <div class="shade-inquiry">
        <div class="shade-border shade-tiem">审核<span class="close" @click="hideShadeBox">&times;</span>
        </div>
        <div class="shade-border shade-exprent shade-tiem">
          备注
          <div class="ex-box" :class="{'input-height':focus}">
            <textarea id="exprent" class="input-height-item" @focus="focus = true" @blur="focus = false" placeholder="请输入" v-model="reamrk"></textarea>
          </div>
        </div>
        <div class="ok">
          <span class="submit change hand" @click="withdrawal(1)">审核通过</span>
          <span class="submit sure hand" @click="withdrawal(0)">审核不通过</span>
        </div>
      </div>
    </div>
  </form-box>
</template>

<script type="text/ecmascript-6">
  import FormBox from 'components/form-box/form-box'
  import monies from 'api/monies'
  import {ERR_OK, BASE_URL} from 'api/config'
  import Toast from 'components/toast/toast'
  import AdminSelect from 'components/admin-select/admin-select'
  const titleList = ['申请日期', '业务类型', '商户账号', '提现渠道', '提现账号', '姓名', '可提现金额', '冻结金额', '申请提现金额', '处理状态', '操作']
  const statusList = [{title: '支付成功', status: 1}, {title: '退款', status: 3}]
  const TOKEN = localStorage.getItem('token') || sessionStorage.getItem('token')
  const SELECT = [{
    title: '  处理状态',
    type: 'open',
    select: false,
    show: false,
    children: [{
      content: '全部',
      data: [{title: '全部', status: ''},
        {title: '未处理', status: 0},
        {title: '提现成功', status: 1},
        {title: '提现失败', status: 2}]
    }]
  }, {
    title: '业务类型',
    type: 'version',
    select: false,
    show: false,
    children: [{
      content: '门店提现',
      data: [{title: '门店提现', status: 1}, {title: '顾客提现', status: 4}, {title: '异业联盟员工提现', status: 12}, {title: '异业联盟商家提现', status: 13}]
    }]
  }]
  const TIMELIST = [{title: '今天', type: 'today'}, {
    title: '昨天',
    type: 'yesterday'
  }, {title: '7天', type: 'week'}, {title: '30天', type: 'month'}, {
    title: '自定义',
    type: ''
  }]
  export default {
    data() {
      return {
        timeIdx: 0,
        reamrk: '',
        timeList: TIMELIST,
        busInput: '',
        bussFocus: false,
        selectList: SELECT,
        focus: false,
        titleList: titleList,
        orderList: [],
        time: 'today',
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        page: 1,
        orderDetail: [],
        isIndustrie: false,
        address: {},
        status: 1,
        statusList: statusList,
        heightIndex: -1,
        showContent: false,
        endDay: '',
        endInput: '', // 商户账号
        endDeal: '',
        endBusiness: '', // 业务类型
        deal: '', // 处理状态
        business: 1,
        startTime: '',
        finalTime: '',
        endStart: '',
        endFinal: '',
        type: '', // 下拉框类型,
        orderInput: '', // 订单号
        goNUm: 0,
        isWithdrawal: true
      }
    },
    mounted() {
//      未完成
      this.info()
      this.excel = `${BASE_URL.api}/api/monies/download-money-orders?access_token=${TOKEN}&order_sn=&merchant_mobile=&order_type=0&order_status=&start_time=&end_time=&pay_start_time&pay_end_time=`
      this.showList(true)
      this.$refs.order.setNavTitle()
    },
    methods: {
      info() {
        this.orderInput = this.$route.query.order || ''
        this.business = this.$route.query.status || 1
        let status = this.$route.query.status
        this.timeIdx = status ? this.$refs.order.hideHeightLine() : 0
        this.time = status ? '' : 'today'
        this.goNUm = status ? 0 : 2
        if (this.orderInput) {
          let sum = this.selectList[1].children[0].data
          let idx = sum.findIndex(item => item.status === this.business * 1)
          this.selectList[1].children[0].content = this.selectList[1].children[0].data[idx].title
        }
      },
      selectType(type) {
        this.type = type
      },
      setValue(res, idx) {
        switch (this.type) {
          case 'open':
            this.deal = res.status
            break
          case 'version':
            this.business = res.status
            break
        }
      },
      hideShadeBox() {
        this.$refs.order.hideShade()
      },
      sreach() {
        this.$refs.order.beginPage()
        this.page = 1
        this.showList()
      },
      showList(status = false) {
        this.endTime = this.time
        this.endBusiness = this.business
        this.endInput = this.busInput
        this.endDeal = this.deal
        this.endStart = this.startTime
        this.endFinal = this.finalTime
        let data = {
          page: this.page,
          start_time: this.endStart,
          end_time: this.endFinal,
          time: this.endTime,
          merchant_mobile: this.endInput,
          order_type: this.endBusiness,
          order_status: this.endDeal,
          is_withdrawal: 1
        }
        if (status) {
          data = Object.assign({}, data, {order_sn: this.orderInput})
        }
        monies.ordersInquiry(data).then((res) => {
          this.goNUm++
          this.showContent = true
          if (res.error === ERR_OK) {
            this.orderList = res.data
            this.$refs.order.isBlank(res.data)
            let pages = res.meta
            this.pageDtail = [{total: pages.total, per_page: pages.per_page, total_page: pages.last_page}]
          }
        })
      },
      showDetail(item) {
        if (item.status !== 1 && item.status !== 3) {
          this.reamrk = item.note
          this.$refs.order.showShade()
          this.detail = false
          this.inquiryId = item.id
          this.isRefund = item.status === 3
          this.isWithdrawal = true
        }
      },
      showHeight(index) {
        this.heightIndex = index
      },
      hideHeight() {
        this.heightIndex = -1
      },
      //      判断是否返回待办事项
      isDeal() {
        if (this.timeIdx === -1 && this.goNUm <= 1) {
          this.timeIdx = 0
          this.business === '1' ? this.$router.push({path: 'notes', query: {status: 'shop_withdrawal_audit'}}) : this.$router.push({path: 'notes', query: {status: 'user_withdrawal_audit'}})
        } else {
          this.$refs.order.hideShade()
          this.showList()
        }
      },
      withdrawal(pass) {
        switch (this.endBusiness) {
          case 1:
          case 13:
            let data = {order_id: this.inquiryId, note: this.reamrk, is_pass: pass}
            if (this.isWithdrawal) {
              this.isWithdrawal = false
              monies.checkWithdrawal(data).then((res) => {
                if (res.error === ERR_OK) {
                  this.$refs.order.hideShade()
                  this.isDeal()
                  this.$refs.order.showContent('审核成功')
                } else {
                  this.$refs.order.showContent(res.message)
                  this.isWithdrawal = true
                }
              })
            }
            break
          case 4:
          case 12:
            let datas = {apply_id: this.inquiryId, note: this.reamrk, is_pass: pass}
            if (this.isWithdrawal) {
              this.isWithdrawal = false
              monies.customerCheckWithdrawal(datas).then((res) => {
                if (res.error === ERR_OK) {
                  this.$refs.order.hideShade()
                  this.isDeal()
                  this.$refs.order.showContent('审核成功')
                } else {
                  this.$refs.order.showContent(res.message)
                  this.isWithdrawal = true
                }
              })
            }
            break
        }
      },
      checkTime(value, page, index) {
        this.timeIdx = index
        if (Array.isArray(value)) {
          this.startTime = value[0]
          this.finalTime = value[1]
          this.time = ''
        } else {
          this.startTime = ''
          this.finalTime = ''
          this.time = value
        }
        this.$refs.order.beginPage()
      },
      addPage(page) {
        this.endTime = this.endTime !== this.time ? this.time : this.endTime
        this.endInput = this.endInput !== this.busInput ? this.busInput : this.endInput
        this.endDeal = this.endDeal !== this.deal ? this.deal : this.endDeal
        this.endBusiness = this.endBusiness !== this.business ? this.business : this.endBusiness
        this.endStart = this.endStart !== this.startTime ? this.startTime : this.endStart
        this.endFinal = this.finalTime !== this.endFinal ? this.finalTime : this.endFinal
        this.page = page
        this.showList()
      },
      orderStatus(status) {
        this.status = status
      },
      showCity(prams, page) {
        this.address = this.$refs.order.infoData(prams)
        this.page = page
        this.showList()
      }
    },
    components: {
      'form-box': FormBox,
      'toast': Toast,
      'admin-select': AdminSelect
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
      padding-left: 30px
    .list-header
      height: 9.5%
      border-bottom: 1px solid $color-big-background
      background: $color-big-background
      .list-item
        cursor: url
        white-space: nowrap
    .list
      height: 90.5%
      display: flex
      flex-direction: column
      .list-box
        height: 10%
        border-bottom: 1px solid $color-big-background
        .list-item
          cursor: pointer
          line-height: 16px
          font-size: $font-size-medium
          .list-none
            no-wrap()
    .list-text
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
    .list-item
      color: $color-text
      flex: 1
      .showDetail
        cursor: pointer
        font-size: $font-size-small
        padding: 3.8% 9%
        color: $color-nomal
        border-radius: 3px
        border: 1px solid $color-nomal
      .audit-disable
        color: $color-text-little
      .audit
        color: $color-nomal
      &:nth-child(7), &:nth-child(9)
        flex: 1.2
      &:nth-child(6)
        flex: 0.8
    .list-box-active
      background: $color-background

  .shade-box
    .shade-border
      border-bottom: 1px solid $color-icon-line
      font-size: $font-size-medium
      padding-left: 30px
      display: flex
      height: 5.01vh
      align-items: center
      color: $color-text
      .shade-title
        width: 112px
        no-wrap()
      &:first-child
        height: 7.01vh
        font-size: $font-size-medium-x
        position: relative
        .close
          cursor: pointer
          position: absolute
          col-center()
          right: 30px
          color: #979797
          font-size: 24px
          &:hover
            transform: translateY(-50%) rotate(90deg)
            transform-origin: 50%
            transition: transform 0.5s
    .shade-exprent
      height: 14.42vh
      display: block
      padding-top: 10px
      .ex-box
        margin-top: 2px
        border: 2px solid $color-white
        height: 75%
        width: 95.6%
      #exprent
        height: 100%
        width: 100%
        padding: 8px
        display: inline-block
        box-sizing: border-box
        border: 1px solid $color-icon-line
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
        &:hover
          background: $color-hover
        &:active
          background: $color-active

  .shade-tiem:hover
    background: $color-background
    .ex-box
      border: 2px solid $color-background
    textarea.shade-text
      background: $color-background

  .selects
    display: flex
    font-size: $font-size-medium
    color: $color-text
    line-height: 30px
    margin-left: 3.535vw
    transform: translateY(-25%)
    .select-title
      no-wrap()
    .select-box
      display: flex
      margin-left: 3.535vw
      .select-item
        box-sizing: border-box
        width: 60px
        height: 30px
        line-height: 32px
        text-align center
        border: 1px solid $color-icon-line
        color: $color-text-icon
        border-radius: 3px
      .select-item-active
        border: none
        background: $color-nomal
        color: $color-white
        &:hover
          background: $color-hover
        &:active
          background: $color-active

  .select
    transform: translateY(25%)

  .selects-item
    display: flex
    margin-right: 3.56vw

  .select-title
    no-wrap()

  .selects-inpput-box
    margin-left: 10px
    border: 2px solid $color-white
    .select-input
      height: 30px
      width: 10vw
      border-radius: 3px
      padding-left: 10px
      border: 1px solid $color-icon-line

  .slectContent
    margin-left: 3.56vw
    transform: translateY(25%)

  .shade-inquiry
    .shade-exprent
      height: 19vh
      display: block
      padding-top: 10px
      .ex-box
        margin-top: 2px
        border: 2px solid $color-white
        height: 75%
        width: 95.6%
      #exprent
        height: 100%
        width: 100%
        padding: 8px
        display: inline-block
        box-sizing: border-box
        border: 1px solid $color-icon-line
      &:hover
        background: $color-background
        .ex-box
          border: 2px solid $color-background
        #exprent
          border: 1px solid #999 !important
          background: $color-white
    .ok
      height: 9.26vh
      display: flex
      justify-content: center
      align-items: center
      .submit
        height: 40px
        width: 40%
        border-radius: 3px
        color: $color-white
        text-align: center
        line-height: 40px
        background: $color-nomal
      .sure
        &:hover
          background: $color-hover
        &:active
          background: $color-active
      .change
        margin-right: 20px
        background: $color-white
        border: 1px solid $color-line
        color: $color-text
        &:hover
          background: $color-white
          color: $color-nomal
          border: 1px solid $color-nomal

</style>
