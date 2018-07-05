<template>
  <form-box ref="order" @checkTime="checkTime" @addPage="addPage" @showCity="showCity" :pageDtail="pageDtail" :isIndustrie="isIndustrie">
    <div class="selects" slot="tag-sel">
      <span class="city-title">订单</span>
      <div class="select-box">
        <span class="select-item hand" v-for="(item, index) in statusList" :class="{'select-item-active': status === item.status}" :key="index" @click="orderStatus(item.status)">{{item.title}}</span>
      </div>
    </div>
    <div slot="form-list" class="form-list" v-show="showContent">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <ul class="list">
        <li class="list-box" v-for="(item,index) in customers" :class="{'list-box-active': heightIndex === index}" :key="index" @mouseenter="showHeight(index)" @mouseleave="hideHeight">
          <div class="list-item list-text">{{item.user}}</div>
          <div class="list-item list-text">{{item.shop_name}}</div>
          <div class="list-item list-text">{{item.bind_time}}</div>
          <div class="list-item"><span class="showDetail" @click="showDetail(item.user_id)">查看</span></div>
        </li>
      </ul>
    </div>
    <div slot="shade-box" class="shade-box">
      <div class="shade-border">客户信息<span class="close" @click="hideShadeBox">&times;</span></div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">客户账号</span>
        <span class="shade-text">{{customersDetail.user}}</span>
      </div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">绑定商家</span>
        <span class="shade-text">{{customersDetail.shop_name}}</span>
      </div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">绑定时间</span>
        <span class="shade-text">{{customersDetail.bind_time}}</span>
      </div>
      <div class="shade-border shade-tiem" v-show="status === 'order_customer'">
        <span class="shade-title">订单数量</span>
        <span class="shade-text">{{customersDetail.order_count}}</span>
      </div>
      <div class="shade-border shade-tiem" v-show="status === 'order_customer'">
        <span class="shade-title">消费金额</span>
        <span class="shade-text">{{customersDetail.order_money_total}}</span>
      </div>
      <div class="shade-border shade-exprent shade-tiem">
        备注
        <div class="exprent-box" >
          <div class="ex-box" :class="{'input-height':focus}">
            <textarea id="exprent" class="input-height-item" @focus="focus = true" @blur="focus = false" placeholder="请输入" v-model="customersDetail.remark"></textarea>
          </div>
        </div>
      </div>
      <div class="ok">
        <span class="submit hand" @click="customerRemark">保存</span>
      </div>
    </div>
    <toast></toast>
  </form-box>
</template>

<script type="text/ecmascript-6">
import FormBox from 'components/form-box/form-box'
import customer from 'api/customer'
import {ERR_OK} from 'api/config'
import Toast from 'components/toast/toast'
const titleList = ['客户账号', '绑定商家', '绑定时间', '操作']
const statusList = [{title: '订单客户', status: 'order_customer'}, {title: '微信用户', status: 'wechat_user'}]
export default {
  data() {
    return {
      focus: false,
      titleList: titleList,
      customers: [],
      time: 1,
      pageDtail: [{total: 1, per_page: 10, total_page: 1}],
      page: 1,
      customersDetail: [],
      isIndustrie: false,
      address: {},
      status: 'order_customer',
      statusList: statusList,
      remarkId: 0,
      heightIndex: -1,
      showContent: false
    }
  },
  created() {
    this.showList()
  },
  methods: {
    customerRemark() {
      let data = {remark: this.customersDetail.remark, user_id: this.remarkId, type: 'customers'}
      if (this.status === 'wechat_user') {
        data.type = 'wechat_data'
      }
      customer.customerRemark(data).then((res) => {
        if (res.error === ERR_OK) {
          this.focus = false
          this.$refs.order.hideShade()
        } else {
          this.$refs.toast.show(res.message)
        }
      })
    },
    hideShadeBox() {
      this.$refs.order.hideShade()
    },
    showList() {
      let data = {}
      data = Object.assign({}, {time: this.time, page: this.page, user_type: this.status}, this.address)
      customer.customers(data).then((res) => {
        this.showContent = true
        if (res.error === ERR_OK) {
          this.customers = res.data
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
    showDetail(id) {
      this.remarkId = id
      this.$refs.order.showShade()
      let data = {user_id: id}
      if (this.status === 'wechat_user') {
        customer.wechatdata(data).then((res) => {
          if (res.error === ERR_OK) {
            this.customersDetail = res.data
          }
        })
        return false
      }
      customer.customerInfo(data).then((res) => {
        if (res.error === ERR_OK) {
          this.customersDetail = res.data
        }
      })
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
      this.page = 1
      this.$refs.order.beginPage()
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
      background :$color-big-background
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
        font-size: $font-size-small
        padding: 3.8% 9%
        color: $color-nomal
        border-radius: 3px
        border: 1px solid $color-nomal
      &:nth-child(1), &:nth-child(2)
        flex: 1.2
      &:last-child
        flex :0.5
    .list-box-active
      background: $color-background
  .list-header
    .list-item:last-child
      transform :translateX(7%)
  .shade-box
    .shade-border
      border-bottom :1px solid $color-icon-line
      font-size :$font-size-medium
      padding-left :30px
      display :flex
      height :5.01vh
      align-items :center
      color :$color-text
      .shade-title
        width :112px
        no-wrap()
      &:first-child
        font-size :$font-size-medium-x
        height :7.01vh
        position: relative
        .close
          cursor: pointer
          position: absolute
          col-center()
          right: 30px
          color: #979797
          font-size :24px
          &:hover
            transform :translateY(-50%) rotate(90deg)
            transform-origin :50%
            transition : transform 0.5s
    .shade-exprent
      height : 14.42vh
      display: block
      padding-top :10px
      .exprent-box
        height :10.2vh
        width :88%
        border :2px solid $color-white
        .ex-box
          margin-top :2px
          border :2px solid $color-white
          height :100%
          width :95.6%
        #exprent
          height :100%
          width :100%
          padding : 8px
          display :inline-block
          box-sizing :border-box
          border :1px solid $color-icon-line
      .text-height
        border:2px solid rgba(102,102,102,.2) !important
        #exprent
          border :1px solid $color-text-icon
    .ok
      height :100px
      display :flex
      justify-content :center
      align-items :center
      .submit
        height :40px
        width :220px
        border-radius :3px
        color :$color-white
        text-align :center
        line-height:40px
        background :$color-nomal
        &:hover
          background :$color-hover
        &:active
          background :$color-active
  .shade-tiem:hover
    background :$color-background
    .exprent-box
      border :2px solid $color-background
      .ex-box
        border : 2px solid $color-background
      textarea#exprent
        border :1px solid $color-text-icon
  .selects
    display :flex
    font-size :$font-size-medium
    color :$color-text
    line-height :30px
    transform: translateY(-25%)
    margin-left :4.5vw
    .city-title
      white-space: nowrap
    .select-box
      display :flex
      margin-left :10px
      .select-item
        box-sizing :border-box
        width :76px
        height :30px
        line-height :32px
        text-align center
        border :1px solid $color-icon-line
        color: $color-text-icon
        &:nth-child(1)
          border-right :none
          border-bottom-left-radius :3px
          border-top-left-radius :3px
        &:nth-child(2)
          border-bottom-right-radius :3px
          border-top-right-radius :3px
          border-left :none
      .select-item-active
        border :none
        background :$color-nomal
        color :$color-white
</style>
