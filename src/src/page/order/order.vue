<template>
  <form-box ref="order" @checkTime="checkTime" @addPage="addPage" @showCity="showCity" :pageDtail="pageDtail" :isIndustrie="isIndustrie">
    <div class="selects" slot="tag-sel">
      <span class="select-title">订单</span>
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
        <li class="list-box" v-for="(item,index) in orderList" :key="index" :class="{'list-box-active': heightIndex === index}" @mouseenter="showHeight(index)" @mouseleave="hideHeight">
          <div class="list-item list-text">{{item.order_sn}}</div>
          <div class="list-item list-text">{{item.shop_name}}</div>
          <div class="list-item list-text">{{item.nickname}}</div>
          <div class="list-item list-text">{{item.total}}</div>
          <div class="list-item list-text">{{item.created_at}}</div>
          <div class="list-item list-text">{{item.status === 1 ? '支付成功' : item.status === 3 ? '退款中' : '退款完成'}}</div>
          <div class="list-item"><span class="showDetail" @click="showDetail(item.id)">查看</span></div>
        </li>
      </ul>
    </div>
    <div slot="shade-box" class="shade-box">
      <div class="shade-border shade-tiem">订单信息<span class="close" @click="hideShadeBox">&times;</span></div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">订单号</span>
        <span class="shade-text">{{orderDetail.order_sn}}</span>
      </div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">归属商家</span>
        <span class="shade-text">{{orderDetail.shop_name}}</span>
        </div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">归属客户</span>
        <span class="shade-text">{{orderDetail.nickname}}</span>
       </div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">订单金额</span>
        <span class="shade-text">{{orderDetail.total}}</span>
      </div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">下单时间</span>
        <span class="shade-text">{{orderDetail.created_at}}</span>
        </div>
      <div class="shade-border shade-tiem">
        <span class="shade-title">订单状态</span>
        <span class="shade-text">{{orderDetail.status === 1 ? '支付成功' : orderDetail.status === 3 ? '退款中' : '退款完成'}}</span>
        </div>
      <div class="shade-border shade-exprent shade-tiem">
        备注
        <div class="ex-box" :class="{'input-height':focus}">
          <textarea id="exprent" class="input-height-item" @focus="focus = true" @blur="focus = false" placeholder="请输入" v-model="orderDetail.reamrk"></textarea>
        </div>
      </div>
      <div class="ok">
        <span class="submit hand" @click="orderManage(orderDetail.id)">保存</span>
      </div>
    </div>
  </form-box>
</template>

<script type="text/ecmascript-6">
import FormBox from 'components/form-box/form-box'
import order from 'api/order'
import {ERR_OK} from 'api/config'
import Toast from 'components/toast/toast'
const titleList = ['订单号', '商家名称', '客户名称', '订单金额', '下单时间', '订单状态', '订单详情']
const statusList = [{title: '支付成功', status: 1}, {title: '退款', status: 3}]
export default {
  data() {
    return {
      focus: false,
      titleList: titleList,
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
      showContent: false
    }
  },
  created() {
    this.showList()
  },
  methods: {
    orderManage(id) {
      let data = {remark: this.orderDetail.reamrk}
      order.orderManage(id, data).then((res) => {
        if (res.error === ERR_OK) {
          this.$refs.order.hideShade()
        }
      })
    },
    hideShadeBox() {
      this.$refs.order.hideShade()
    },
    showList() {
      let data = {}
      data = Object.assign({}, {time: this.time, page: this.page, status: this.status}, this.address)
      order.orderList(data).then((res) => {
        this.showContent = true
        if (res.error === ERR_OK) {
          this.orderList = res.data
          this.$refs.order.isBlank(res.data)
          let pages = res.meta
          this.pageDtail = [{total: pages.total, per_page: pages.per_page, total_page: pages.last_page}]
        }
      })
    },
    showDetail(id) {
      this.$refs.order.showShade()
      order.orderDetail(id).then((res) => {
        if (res.error === ERR_OK) {
          this.orderDetail = res.data
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
    .list-box-active
      background: $color-background
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
        height :7.01vh
        font-size :$font-size-medium-x
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
      .ex-box
        margin-top :2px
        border :2px solid $color-white
        height :75%
        width :95.6%
      #exprent
        height :100%
        width :100%
        padding : 8px
        display :inline-block
        box-sizing :border-box
        border :1px solid $color-icon-line
    .ok
      height: 9.26vh
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
    .ex-box
      border : 2px solid $color-background
    textarea.shade-text
      background: $color-background
  .selects
    display :flex
    font-size :$font-size-medium
    color :$color-text
    line-height :30px
    margin-left :3.535vw
    transform: translateY(-25%)
    .select-title
      no-wrap()
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
