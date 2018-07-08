<template>
  <form-box ref="order" :isDate="false" :isCity="false" @addPage="addPage" :pageDtail="pageDtail" :isIndustrie="false">
    <div class="order-sec" slot="order-sec">
      <div class="selects">
        <div class="selects-item">
          <span class="select-title">订单号</span>
          <div class="selects-inpput-box" :class="{'input-height':orderFocus}">
            <input type="text" class="input-height-item select-input"
                   placeholder="请输入订单号" @focus="orderFocus = true" v-model="orderInput"
                   @blur="orderFocus = false">
          </div>
        </div>
        <div class="selects-item">
          <span class="select-title">商户账号</span>
          <div class="selects-inpput-box" :class="{'input-height':bussFocus}">
            <input type="text" class="input-height-item select-input" v-model="busInput"
                   placeholder="请输入商户账号" @focus="bussFocus = true"
                   @blur="bussFocus = false">
          </div>
        </div>
        <div class="slectContent">
          <admin-select :select="selectList" @selectType="selectType" @setValue="setValue"></admin-select>
        </div>
      </div>
      <div class="order-block">
        <span class="block-title">创建时间</span>
        <el-date-picker
          v-model="moreTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="order-block pay-time">
        <span class="block-title">支付时间</span>
        <el-date-picker
          v-model="payTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="order-btn hand" @click="search">搜索</div>
      <a :href="excel" target="_blank">
        <div class="down-excel">下载Excel</div>
      </a>
    </div>
    <div slot="form-list" class="form-list" v-show="showContent">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <ul class="list">
        <li class="list-box" v-for="(item,index) in orderList" :key="index"
            :class="{'list-box-active': heightIndex === index}"
            @mouseenter="showHeight(index)" @mouseleave="hideHeight">
          <div class="list-item list-text">{{item.order_sn}}</div>
          <div class="list-item list-text">{{item.merchant_mobile}}</div>
          <div class="list-item list-text">{{item.order_type_cn}}</div>
          <div class="list-item list-text">{{item.total}}</div>
          <div class="list-item list-text">{{item.time_end}}</div>
          <div class="list-item list-text">{{item.created_at}}</div>
          <div class="list-item list-text">{{item.mobile}}</div>
          <!--优惠券状态-->
          <div class="list-item list-text" v-if="item.order_type === '0' || item.order_type === '7'">{{item.status === 0 ? '待支付' : item.status === 1 ? '已支付' : item.status === 2 ? '待评价' : item.status === 3 ? '退款中' : item.status === 4 ? '退款完成' : item.status === 5 ? '已评价' : item.status === 6 ? '逾期付款已关闭' : item.status === 7 ? '退款失败商家余额不足' : item.status === 8 ? '退款失败平台余额不足' : '有效期过期关闭'}}</div>
          <!--买单-->
          <div class="list-item list-text" v-if="item.order_type === '5'">{{item.status === 0 ? '待支付' :  '已支付'}}</div>
          <!--联盟-->
          <div class="list-item list-text" v-if="item.order_type === '6'">{{item.status === 0 ? '待支付' : item.status === 1 ? '已支付' : item.status === 2 ? '商家已确认' : item.status === 3 ? '拒绝后已退款' : '过期退款'}}</div>
          <div class="list-item" v-if="item.order_type === '0' || item.order_type === '5' || item.order_type === '6' || item.order_type === '7'"><span class="showDetail"><span @click="showDetail(item)">查看</span></span></div>
          <!--支付状态-->
          <div class="list-item list-text" v-if="item.order_type === '2' || item.order_type === '3'">支付成功</div>
          <div class="list-item" v-if="item.order_type === '2' || item.order_type === '3'"><span class="showDetail"><span @click="showDetail(item)">查看 | </span><span class="audit-disable">审核</span></span></div>
          <!--提现状态-->
          <div class="list-item list-text" v-if="item.order_type === '1' || item.order_type === '4'">{{item.status === 0 ? '未处理' : item.status === 1 ? '提现成功' : '提现失败'}}</div>
          <div class="list-item" v-if="item.order_type === '1' || item.order_type === '4'"><span class="showDetail"><span @click="showDetail(item)">查看 | </span><span :class="item.status === 0 ? 'audit' : 'audit-disable'" @click.stop="inquiry(item)">审核</span></span></div>
          <div class="list-item list-text">{{item.operation_time}}</div>
          <div class="list-item list-text">{{item.admin_name}}</div>
        </li>
      </ul>
    </div>
    <div slot="shade-box" class="shade-box">
      <div class="shade-detail" v-show="detail">
        <div class="shade-border shade-tiem">订单信息<span class="close" @click="hideShadeBox">&times;</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">商户订单号</span>
          <span class="shade-text">{{orderDetail.order_sn}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">微信支付流水</span>
          <span class="shade-text">{{orderDetail.transaction_id}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">商户号</span>
          <span class="shade-text">{{orderDetail.merchant_mobile}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">创建时间</span>
          <span class="shade-text">{{orderDetail.created_at}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">支付时间</span>
          <span class="shade-text">{{orderDetail.time_end}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">业务类型</span>
          <span
            class="shade-text">{{orderDetail.order_type_cn}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">业务描述</span>
          <span class="shade-text">{{orderDetail.title}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">支付对象</span>
          <span class="shade-text">{{orderDetail.mobile}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">支付类型</span>
          <span class="shade-text">微信支付</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">订单金额</span>
          <span class="shade-text">{{orderDetail.money}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">实付金额</span>
          <span class="shade-text">{{orderDetail.total}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">订单状态</span>
          <span class="shade-text" v-if="orderDetail.order_type === '0'">{{orderDetail.status === 0 ? '待支付' : orderDetail.status === 1 ? '已支付' : orderDetail.status === 2 ? '待评价' : orderDetail.status === 3 ? '退款中' : orderDetail.status === 4 ? '退款完成' : orderDetail.status === 5 ? '已评价' : orderDetail.status === 6 ? '逾期付款已关闭' : orderDetail.status === 7 ? '退款失败商家余额不足' : orderDetail.status === 8 ? '退款失败平台余额不足' : '有效期过期关闭'}}</span>
          <span class="shade-text" v-if="orderDetail.order_type === '1' || orderDetail.order_type === '4'">{{orderDetail.status === 0 ? '未处理' : orderDetail.status === 1 ? '提现成功' : '提现失败'}}</span>
          <span class="shade-text" v-if="orderDetail.order_type === '2' || orderDetail.order_type === '3'">支付成功</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">失败原因</span>
          <span class="shade-text">{{orderDetail.note}}</span>
        </div>
        <!--<div class="shade-border shade-exprent shade-tiem">-->
        <!--备注-->
        <!--<div class="ex-box" :class="{'input-height':focus}">-->
        <!--<textarea id="exprent" class="input-height-item" @focus="focus = true"-->
        <!--@blur="focus = false" placeholder="请输入"-->
        <!--v-model="orderDetail.reamrk"></textarea>-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <div class="shade-inquiry" v-show="!detail">
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
  import finances from 'api/finances'
  import {ERR_OK, BASE_URL} from 'api/config'
  import Toast from 'components/toast/toast'
  import AdminSelect from 'components/admin-select/admin-select'
  const TITLELIST = ['商户订单号', '商户账号', '业务类型', '订单金额', '支付时间', '创建时间', '交易对象', '订单状态', '操作', '操作时间', '操作人']
  const statusList = [{title: '支付成功', status: 1}, {title: '退款', status: 3}]
  const orderType = [{title: '优惠券', status: 0}, {title: '门店提现', status: 1}, {title: '门店年费', status: 3}, {title: '红包创建', status: 2}, {title: '顾客提现', status: 4}, {title: '买单', status: 5}, {title: '联盟投放', status: 6}, {title: '礼包', status: 7}]
  const couponList = [{title: '全部', status: ''}, {title: '待支付', status: 0}, {title: '已支付', status: 1}, {title: '待评价', status: 2}, {title: '退款中', status: 3}, {title: '退款完成', status: 4}, {title: '已评价', status: 5}, {title: '逾期付款已关闭', status: 6}, {title: '退款失败商家余额不足', status: 7}, {title: '退款失败平台余额不足', status: 8}, {title: '有效期过期关闭', status: 9}]
  const DEPOSIT = [{title: '全部', status: ''}, {title: '未处理', status: 0}, {title: '提现成功', status: 1}, {title: '提现失败', status: 2}]
  const ALL = [{title: '全部', status: 1}]
  const PAY = [{title: '全部', status: ''}, {title: '待支付', status: 0}, {title: '已支付', status: 1}]
  const ALLIANCE = [{title: '全部', status: ''}, {title: '待支付', status: 0}, {title: '已支付', status: 1}, {title: '商家已确认', status: 2}, {title: '拒绝后已退款', status: 3}, {title: '过期退款', status: 4}]
  const TOKEN = localStorage.getItem('business-token') || sessionStorage.getItem('business-token')
  let select = [{
    title: '业务类型',
    type: 'business',
    select: false,
    show: false,
    children: [{content: '优惠券', data: orderType}]
  }, {
    title: '订单状态',
    type: 'state',
    select: false,
    show: false,
    children: [{content: '全部', data: couponList}]
  }]
  export default {
    data() {
      return {
        payTime: '',
        reamrk: '',
        detail: true,
        focus: false,
        titleList: TITLELIST,
        orderList: [],
        time: 1,
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        page: 1,
        orderDetail: [],
        isIndustrie: false,
        address: {},
        status: 1,
        statusList: statusList,
        heightIndex: -1,
        showContent: false,
        selectList: select,
        orderFocus: false,
        bussFocus: false,
        orderType: 0,
        orderInput: '',
        busInput: '',
        type: '',
        moreTime: '',
        orderStatusCode: '',
        sreachTime: ['', ''],
        oldPayTime: '', // 支付时间
        newPayTime: '',
        sreachPayTime: ['', ''],
        findPayTime: ['', ''],
        orderSn: '',
        merchantMobile: '',
        orderTypes: 0,
        orderState: '',
        finalTime: ['', ''],
        oldTime: '',
        newTime: '',
        inquiryId: '',
        isRefund: false,
        isSearch: false,
        excel: '',
        goNUm: 0
      }
    },
    mounted() {
      this.info()
      this.excel = `${BASE_URL.api}/api/monies/download-money-orders?access_token=${TOKEN}&order_sn=&merchant_mobile=&order_type=0&order_status=&start_time=&end_time=&pay_start_time&pay_end_time=`
      this.showList()
    },
    methods: {
      info() {
        let orderSn = this.$route.query.order
        this.orderInput = orderSn || ''
        this.goNUm = this.orderInput ? 0 : 2
        this.orderSn = this.orderInput
      },
      downExcel() {
        this.excel = `${BASE_URL.api}/api/monies/download-money-orders?access_token=${TOKEN}&order_sn=${this.orderSn}&merchant_mobile=${this.merchantMobile}&order_type=${this.orderTypes}&order_status=${this.orderState}&start_time=${this.finalTime[0]}&end_time=${this.finalTime[1]}&pay_start_time=${this.findPayTime[0]}&pay_end_time=${this.findPayTime[1]}`
      },
      search() {
        this.orderSn = this.orderInput
        this.merchantMobile = this.busInput
        this.orderTypes = this.orderType
        this.orderState = this.orderStatusCode
        this.finalTime = this.sreachTime
        this.findPayTime = this.sreachPayTime
        this.page = 1
        this.$refs.order.beginPage()
        this.showList()
        this.downExcel()
      },
      selectType(type, res) {
        this.type = type
      },
      setValue(value, idx) {
        if (this.type === 'business') {
          this.orderType = value.status
          this.orderStatusCode = value.status === 2 || value.status === 3 ? 1 : ''
        }
        this.orderStatusCode = this.type === 'state' ? value.status : this.orderStatusCode
        switch (this.orderType) {
          case 0:
          case 7:
            //          优惠券+礼包状态
            this.selectList[1].children[idx].data = couponList
            break
          case 2:
          case 3:
            //          提现状态
            this.selectList[1].children[idx].data = ALL
            break
          case 5:
            //          买单状态
            this.selectList[1].children[idx].data = PAY
            break
          case 6:
            //          联盟投放状态
            this.selectList[1].children[idx].data = ALLIANCE
            break
          case 1:
          case 4:
            this.selectList[1].children[idx].data = DEPOSIT
            break
        }
        this.selectList[1].children[idx].content = this.type === 'business' ? '全部' : this.selectList[1].children[idx].content
      },
      hideShadeBox() {
        this.$refs.order.hideShade()
      },
      showList() {
        let data = {}
        data = Object.assign({}, {
          pay_start_time: this.findPayTime[0],
          pay_end_time: this.findPayTime[1],
          order_sn: this.orderSn,
          merchant_mobile: this.merchantMobile,
          order_type: this.orderTypes,
          order_status: this.orderState,
          start_time: this.finalTime[0],
          end_time: this.finalTime[1],
          limit: 10,
          page: this.page,
          is_withdrawal: 0
        })
        monies.ordersInquiry(data).then((res) => {
          this.showContent = true
          this.goNUm++
          if (res.error === ERR_OK) {
            this.orderList = res.data
            this.$refs.order.isBlank(res.data)
            let pages = res.meta
            this.pageDtail = [{
              total: pages.total,
              per_page: pages.per_page,
              total_page: pages.last_page
            }]
          }
        })
      },
      showDetail(res) {
        this.$refs.order.showShade()
        this.detail = true
        let data = {order_id: res.id, order_type: res.order_type}
        monies.orderDetail(data).then((res) => {
          if (res.error === ERR_OK) {
            this.orderDetail = res.data
          }
        })
      },
      inquiry(item) {
        if ((item.status === 0 && (item.order_type === '1' || item.order_type === '4')) || (item.status === 3 && item.order_type === '0')) {
          this.reamrk = item.note
          this.$refs.order.showShade()
          this.detail = false
          this.inquiryId = item.id
          item.status === 3 ? this.isRefund = true : this.isRefund = false
        }
      },
      //      判断是否返回待办事项
      isDeal() {
        if (this.orderInput === -1 && this.goNUm <= 1) {
          this.orderInput = ''
          this.$router.push({path: 'notes', query: {status: 'refund_audit'}})
        } else {
          this.$refs.order.hideShade()
          this.showList()
        }
      },
      withdrawal(pass) {
        let data = {order_id: this.inquiryId, note: this.reamrk, is_pass: pass}
        if (this.isRefund) {
          let data = {order_id: this.inquiryId, note: this.reamrk, status: pass}
          finances.refundConfirm(data).then((res) => {
            if (res.error === ERR_OK) {
              this.$refs.order.showContent('审核成功')
              this.isDeal()
            } else {
              this.$refs.order.showContent(res.message)
            }
          })
          return
        }
        monies.checkWithdrawal(data).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.order.hideShade()
            this.showList()
          } else {
            this.$refs.order.showContent(res.message)
          }
        })
      },
      showHeight(index) {
        this.heightIndex = index
      },
      hideHeight() {
        this.heightIndex = -1
      },
      addPage(page) {
        this.orderInput = this.orderInput !== this.orderSn ? this.orderSn : this.orderInput
        this.busInput = this.merchantMobile !== this.busInput ? this.merchantMobile : this.busInput
        this.orderType = this.orderTypes !== this.orderType ? this.orderTypes : this.orderType
        this.orderState = this.orderState !== this.orderStatusCode ? this.orderStatusCode : this.orderState
        this.moreTime = JSON.stringify(this.finalTime) !== JSON.stringify(this.sreachTime) ? this.oldTime : this.newTime
        this.payTime = JSON.stringify(this.findPayTime) !== JSON.stringify(this.sreachPayTime) ? this.oldPayTime : this.newPayTime
        let content = ''
        let contentTwo = ''
        this.selectList[0].children[0].data.forEach((item) => {
          if (this.orderTypes === item.status) {
            content = item.title
          }
        })
        this.selectList[1].children[0].data.forEach((item) => {
          if (this.orderState === item.status) {
            contentTwo = item.title
          }
        })
        this.selectList[0].children[0].content = content
        this.selectList[1].children[0].content = contentTwo
        this.page = page
        this.showList()
      }
    },
    watch: {
      moreTime(newVal, oldVal) {
        this.oldTime = oldVal
        this.newTime = newVal
        this.sreachTime = []
        if (Array.isArray(newVal)) {
          newVal.forEach((item) => {
            this.sreachTime.push(item.toLocaleDateString().replace(/\//g, '-'))
          })
        }
      },
      payTime(newVal, oldVal) {
        this.oldPayTime = oldVal
        this.newPayTime = newVal
        this.sreachPayTime = []
        if (Array.isArray(newVal)) {
          newVal.forEach((item) => {
            this.sreachPayTime.push(item.toLocaleDateString().replace(/\//g, '-'))
          })
        }
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
          font-size: $font-size-medium14
    .list-text
      width: 90%
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
    .list-item
      color: $color-text
      flex: 1
      .showDetail
        cursor: pointer
        font-size: $font-size-small
        padding: 6.5% 9%
        color: $color-nomal
        border-radius: 3px
        border: 1px solid $color-nomal
        .audit-disable
          color: $color-text-little
        .audit
          color: $color-nomal
      &:nth-child(1)
        flex: 1.8
      &:nth-child(2), &:nth-child(7)
        flex: 1.2
    .list-box-active
      background: $color-background

  .shade-box
    max-height: 540px
    overflow-y: auto
    .shade-border
      border-bottom: 1px solid $color-icon-line
      font-size: $font-size-medium14
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
        font-size: $font-size-medium14-x
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
            color: $color-nomal
            border: 1px solid $color-nomal

  .shade-tiem:hover
    background: $color-background
    .ex-box
      border: 2px solid $color-background
    textarea.shade-text
      background: $color-background

  .order-sec
    display: flex
    flex-wrap: wrap
    font-size: $font-size-medium14
    align-items: center
    color: $color-text
    line-height: 30px
    .selects
      position: relative
      z-index: 100
      width: 100%
      display: flex
      transform: translateY(-25%)
      .selects-item
        display: flex
        margin-left: 3.56vw
        &:first-child
          margin-left: 1.3vw
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

  .order-block
    display: flex
    margin-left: 1.3vw
    .block-title
      white-space: nowrap
    .el-date-editor .el-range-editor .el-input__inner .el-date-editor--daterange
      width: 200px !important

  .pay-time
    position: relative
    z-index: 0
    margin-left: 3.56vw

  .down-excel
    font-size: $font-size-medium14
    height: 30px
    line-height: 30px
    text-align: center
    border-radius: 3px
    background: $color-nomal
    color: $color-white
    width: 5.625vw
    white-space: nowrap
    &:hover
      background: $color-hover
    &:active
      background: $color-active

  .order-btn
    background: $color-nomal
    color: $color-white
    height: 30px
    line-height: 30px
    width: 60px
    text-align: center
    border-radius: 3px
    margin: 0 3.56vw
    &:hover
      background: $color-hover
    &:active
      background: $color-active
</style>
