<template>
  <form-box ref="order" @addPage="addPage" :isDate="false" :isCity="false" :pageDtail="pageDtail" :isIndustrie="false">
    <div class="order-sec" slot="order-sec">
      <div class="selects">
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
        <div class="order-btn hand" @click="search">搜索</div>
      </div>
    </div>
    <div slot="form-list" class="form-list" v-show="showContent">
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <ul class="list">
        <li class="list-box" v-for="(item,index) in datasList" :class="{'list-box-active': heightIndex === index}" :key="index" @mouseenter="showHeight(index)" @mouseleave="hideHeight">
          <div class="list-item list-text">{{item.created_at}}</div>
          <div class="list-item list-text">{{item.type}}</div>
          <div class="list-item list-text">{{item.mobile}}</div>
          <div class="list-item"><span class="showDetail" @click="goDetail(item)">去处理</span></div>
        </li>
      </ul>
    </div>
    <toast></toast>
  </form-box>
</template>

<script type="text/ecmascript-6">
  import FormBox from 'components/form-box/form-box'
  import home from 'api/home'
  import {ERR_OK} from 'api/config'
  import Toast from 'components/toast/toast'
  import AdminSelect from 'components/admin-select/admin-select'
  const titleList = ['创建时间', '类型', '商户账号', '操作']
  let SELECT = [{
    title: '类型',
    type: 'version',
    select: false,
    show: false,
    children: [{
      content: '门店提现审核',
      data: [{title: '门店提现审核', status: 'shop_withdrawal_audit'}, {title: '顾客提现审核', status: 'user_withdrawal_audit'}, {title: '退款审核', status: 'refund_audit'}, {
        title: '证照审核',
        status: 'license_audit'
      }]
    }]
  }]
  export default {
    data() {
      return {
        moreTime: '',
        selectList: SELECT,
        bussFocus: false,
        busInput: '',
        titleList: titleList,
        datasList: [],
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        page: 1,
        merchantDetail: [],
        shopId: {},
        heightIndex: -1,
        showContent: false,
        searchType: '',
        searchEndType: 'shop_withdrawal_audit',
        newTime: '',
        oldTime: '',
        finalTime: ['', ''],
        sreachTime: ['', ''],
        merchantMobile: ''
      }
    },
    created() {
      this.info()
      this.showList()
    },
    methods: {
//      初始化
      info() {
        let status = this.$route.query.status || ''
        if (status) {
          let sum = this.selectList[0].children[0].data
          let idx = sum.findIndex(item => item.status === status)
          this.selectList[0].children[0].content = this.selectList[0].children[0].data[idx].title
          this.searchEndType = this.selectList[0].children[0].data[idx].status
        }
      },
      selectType() {

      },
      search() {
        this.showList()
      },
      setValue(res) {
        this.searchEndType = res.status
      },
      showList() {
        this.searchType = this.searchEndType
        this.finalTime = this.sreachTime
        this.merchantMobile = this.busInput
        let data = {page: this.page, search_type: this.searchType, start_time: this.finalTime[0], end_time: this.finalTime[1], mobile: this.merchantMobile}
        home.backlogLists(data).then((res) => {
          this.showContent = true
          if (res.error === ERR_OK) {
            this.datasList = res.data
            this.$refs.order.isBlank(res.data)
            let pages = res.meta
            this.pageDtail = [{total: pages.total, per_page: pages.per_page, total_page: pages.last_page}]
          }
        })
      },
      goDetail(item) {
        switch (item.type) {
          case '门店提现审核':
            this.$router.push({path: 'withdraw', query: {order: item.order_sn, status: 1}})
            break
          case '顾客提现审核':
            this.$router.push({path: 'withdraw', query: {order: item.order_sn, status: 4}})
            break
          case '退款审核':
            this.$router.push({path: 'moniesInquiry', query: {order: item.order_sn}})
            break
          case '证照审核':
            this.$router.push({path: 'BusinessList', query: {order: item.merchant_id}})
            break
        }
      },
      showHeight(index) {
        this.heightIndex = index
      },
      hideHeight() {
        this.heightIndex = -1
      },
      addPage(page) {
//        分页时判断是否有点击搜索
        this.searchEndType = this.searchEndType !== this.searchType ? this.searchType : this.searchEndType
        this.moreTime = JSON.stringify(this.finalTime) !== JSON.stringify(this.sreachTime) ? this.oldTime : this.newTime
        this.busInput = this.merchantMobile !== this.busInput ? this.merchantMobile : this.busInput
        let content = ''
        let target = this.selectList[0].children[0].data.find(item => this.searchEndType === item.status).title
        content = target.title
        this.page = page
        this.selectList[0].children[0].content = content
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
        font-size: $font-size-small
        padding: 2.5% 3%
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

  .order-sec
    display: flex
    flex-wrap: wrap
    font-size: $font-size-medium
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
