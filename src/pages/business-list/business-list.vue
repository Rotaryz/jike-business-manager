<template>
  <div class="buslist" @click="hideTime">
    <form-box ref="order" @checkTime="checkTime" @addPage="addPage" @showCity="showCity" @showIndustrie="showIndustrie" :pageDtail="pageDtail" :isIndustrie="isIndustrie">
      <div class="bl-mobile" slot="tag-sel">
        <div class="selects-inpput-box" :class="{'input-height':bussFocus}">
          <input type="text" class="input-height-item select-input" v-model="mobile" placeholder="请输入商家账号" @focus="bussFocus = true" @blur="bussFocus = false">
        </div>
        <span class="select-item hand select-item-active" @click="sreach">搜索</span>
      </div>
      <div slot="tap" class="select">
        <admin-select :select="selectList" @selectType="selectType" @setValue="setValue"></admin-select>
      </div>
      <div slot="form-list" class="form-list" v-show="showContent">
        <div class="list-header">
          <div class="list-item" v-for="(item, index) in titleList" :key="index">
            {{item}}
          </div>
        </div>
        <ul class="list">
          <li class="list-box" v-for="(item,index) in merchanList" :class="{'list-box-active': heightIndex === index}" :key="index" @mouseenter="showHeight(index)" @mouseleave="hideHeight">
            <div class="list-item list-text list-src hand" @click="showDetail(item.id)">{{item.mobile}}</div>
            <div class="list-item list-text">{{item.shop_name}}</div>
            <div class="list-item list-text">{{item.is_leader ? '盟主' : '普通'}}
            </div>
            <div class="list-item list-text">{{item.industry}}</div>
            <div class="list-item list-text">{{item.user}}</div>
            <div class="list-item list-text">{{item.customer}}</div>
            <div class="list-item list-text">{{item.order}}</div>
            <div class="list-item list-text">{{item.service_version ? '基础' : '试用'}}</div>
            <div class="list-item list-text">{{item.is_expiration ? '已过期' : '使用中'}}</div>
            <div class="list-item list-text">
              {{item.is_checked === 2 ? '已认证' : '未认证 '}}
              <!--{{item.open_type === 0 ? '支付开通' : item.open_type === 1 ? '盟主开通' : item.open_type === 2 ? '后台开通' : ''}}-->
            </div>
            <div class="list-item">
            <span class="showDetail">
              <!--<span >查看</span>-->
              <span class="open" @click.stop="openShop(item.merchant_id)">
                开通
                <div class="order-block " @click.stop v-show="item.end_time">
                  <el-date-picker
                    type="datetime"
                    v-model="endTime"
                    placeholder="结束日期">
                  </el-date-picker>
                  <span class="time-sure" @click="openServices(index)">确定</span>
                </div>
              </span>
              <span @click="frost(item)"> | {{item.is_disabled ? '解冻' : '冻结'}}</span>
              <span @click="audit(item)" :class="item.is_checked !== 2  ? 'audit' : 'audit-disable'"> | 审核</span>
              <span @click="showUltra(item)"> | 越权</span>
            </span>
            </div>
          </li>
        </ul>
      </div>
      <div slot="shade-box" class="shade-box">
        <div class="shade-inquiry" v-show="check === 1">
          <div class="shade-border shade-tiem">{{freezeText}}<span class="close" @click="hideShadeBox">&times;</span>
          </div>
          <div class="shade-border shade-exprent shade-tiem">
            备注
            <div class="ex-box" :class="{'input-height':focus }">
              <textarea class="exprent" :class="freezeText == '解冻' ? '' : 'input-height-item'" @focus="focus = true" :disabled="freezeText == '解冻'" @blur="focus = false" placeholder="请输入" v-model="reamrk"></textarea>
            </div>
          </div>
          <div class="ok">
            <span class="submit sure hand" @click="withdrawal">确定</span>
          </div>
        </div>
        <div class="shade-check" v-show="check === 2">
          <div class="shade-border shade-tiem">审核<span class="close" @click="hideShadeBox">&times;</span>
          </div>
          <div class="shade-border shade-exprent shade-tiem">
            备注
            <div class="ex-box" :class="{'input-height':focus}">
              <textarea class="input-height-item exprent" @focus="focus = true" @blur="focus = false" placeholder="请输入" v-model="remarks"></textarea>
            </div>
          </div>
          <div class="ok">
            <span class="submit change hand" @click="withdrawal(2)">审核通过</span>
            <span class="submit sure hand" @click="withdrawal(3)">审核不通过</span>
          </div>
        </div>
        <div class="ultra-vires-box" v-show="check === 3">
          <div class="shade-border">设置越权密码<span class="close" @click="hideShadeBox">&times;</span></div>
          <div class="shade-border shade-tiem">
            <span class="shade-title">越权帐号</span>
            <span class="shade-text">{{ultraPhone}}</span>
          </div>
          <div class="shade-border shade-tiem activation-code" :class="{'shade-input':!disableds}">
            <span class="shade-title">设置密码</span>
            <div class="input-box" :class="{'input-height': heightType === 7}">
              <input class="shade-text input-height-item" type="text"
                     v-model="ultraPassword" name="change" @focus="isFocus(7)"
                     @blur="heightType = -1" />
            </div>
          </div>
          <div class="shade-border shade-tiem shade-img">
            <span class="shade-title">商家二维码</span>
            <img :src="shopQrcord" class="qrcord-img">
          </div>
          <div class="ultra-vires-ok">
            <span class="submit hand" @click="ultraViresSub">确定</span>
          </div>
        </div>
      </div>
      <toast></toast>
    </form-box>
  </div>
</template>

<script type="text/ecmascript-6">
  import FormBox from 'components/form-box/form-box'
  import merchant from 'api/merchant'
  import home from 'api/home'
  import { mixinBase } from 'common/mixin/base'
  import { ERR_OK } from 'api/config'
  import Toast from 'components/toast/toast'
  import AdminSelect from 'components/admin-select/admin-select'

  const titleList = ['商家账号', '商家名称', '商家角色', '商家类型', '用户数', '客户数', '订单数', '版本', '商家状态', '认证状态', '操作']
  const SELECT = [{
    title: '开通方式',
    type: 'open',
    select: false,
    show: false,
    children: [{
      content: '全部',
      data: [{title: '全部', status: ''}, {
        title: '支付开通',
        status: 0
      }, {title: '盟主开通', status: 1}, {title: '后台开通', status: 2}]
    }]
  }, {
    title: '版本',
    type: 'version',
    select: false,
    show: false,
    children: [{
      content: '全部',
      data: [{title: '全部', status: ''}, {title: '试用', status: 0}, {
        title: '基础',
        status: 1
      }]
    }]
  }, {
    title: '商家角色',
    type: 'role',
    select: false,
    show: false,
    children: [{
      content: '全部',
      data: [{title: '全部', status: ''}, {title: '普通', status: 0}, {
        title: '盟主',
        status: 1
      }]
    }]
  }, {
    title: '商家状态',
    type: 'account',
    select: false,
    show: false,
    children: [{
      content: '全部',
      data: [{title: '全部', status: ''}, {
        title: '使用中',
        status: 0
      }, {title: '已过期', status: 1}]
    }]
  }, {
    title: '账号状态',
    type: 'merchant',
    select: false,
    show: false,
    children: [{
      content: '全部',
      data: [{title: '全部', status: ''}, {title: '未冻结', status: 0}, {
        title: '已冻结',
        status: 1
      }]
    }]
  }, {
    title: '认证状态',
    type: 'checked',
    select: false,
    show: false,
    children: [{
      content: '全部',
      data: [{title: '全部', status: ''}, {title: '已认证', status: 1}, {
        title: '未认证',
        status: 0
      }]
    }]
  }]
  export default {
    mixins: [mixinBase],
    data () {
      return {
        mobile: '',
        bussFocus: false,
        shopQrcord: '',
        ultraPassword: '',
        ultraShow: false,
        freezeText: '冻结',
        focus: false,
        reamrk: '',
        freeze: false,
        endTime: '',
        activationCode: 0,
        heightType: -1,
        disableds: true,
        titleList: titleList,
        merchanList: [],
        time: 1,
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        page: 1,
        merchantDetail: [],
        isIndustrie: true,
        address: {},
        status: 1,
        shopId: {},
        heightIndex: -1,
        showContent: false,
        cancelTitle: '修改',
        selectList: SELECT,
        type: '',
        openType: '',
        role: '',
        serviceVersion: '',
        isExpiration: '',
        isDisabled: '',
        merchantId: 0,
        isDisabledCode: 0,
        checked: '',
        orderId: '',
        check: 1,
        remarks: '',
        goNUm: 0,
        ultraPhone: '',
        isWithdrawal: true
      }
    },
    created () {
      this.orderId = this.$route.query.order ? this.$route.query.order : ''
      this.goNUm = this.orderId ? 0 : 2
      //      未完成 ，，，判断审核的订单号
      this.orderId ? this.showList(true) : this.showList()
    },
    methods: {
//      搜索
      sreach () {
        this.showList()
      },
      selectType (type, res) {
        this.selectList = res
        this.type = type
      },
      setValue (res) {
        switch (this.type) {
          case 'open':
            this.openType = res.status
            break
          case 'version':
            this.serviceVersion = res.status
            break
          case 'role':
            this.role = res.status
            break
          case 'account':
            this.isExpiration = res.status
            break
          case 'merchant':
            this.isDisabled = res.status
            break
          case 'checked':
            this.checked = res.status
            break
        }
        this.page = 1
        this.$refs.order.beginPage()
        this.showList()
      },
      showIndustrie (res) {
        this.shopId = res
        this.showList()
      },
      isFocus (num) {
        this.heightType = num
      },

      merchantMessage (id) {
        let date = this.riQi(this.merchantDetail.expiration_time)
        let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
        if (!reg.test(this.merchantDetail.mobile)) {
          this.$refs.order.showContent('请输入正确的手机号码')
          return false
        }
        let data = {
          mobile: this.merchantDetail.mobile,
          industry_id: this.merchantDetail.industry_id,
          particular_address: this.merchantDetail.particular_address,
          business_circle_id: this.merchantDetail.business_circle_id,
          reseller_level: this.merchantDetail.reseller_level,
          is_leader: this.merchantDetail.is_leader,
          inviter_code_count: this.activationCode,
          service_version: this.merchantDetail.service_version,
          expiration_time: date,
          user_name: this.merchantDetail.user_name
        }
        merchant.merchantMessage(id, data).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.order.hideShade()
          }
          this.$refs.order.showContent(res.message)
        })
      },
//       冻结
      frost (res) {
        res.is_disabled ? this.freezeText = '解冻' : this.freezeText = '冻结'
        this.merchantId = res.merchant_id
//        this.isDisabledCode = res.is_disabled
        res.is_disabled ? this.reamrk = '' : this.reamrk = res.note
        this.merchanList.map((item) => {
          item.end_time = false
          return item
        })
        this.$refs.order.showShade()
        this.check = 1
        this.isWithdrawal = true
      },
      // 越权
      ultraViresSub () {
        if (!this.ultraPassword) {
          this.$refs.order.showContent('请输入密码')
          return
        }
        let data = {
          mobile: this.ultraPhone,
          password: this.ultraPassword
        }
        merchant.ultraVires(data).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.order.showContent('设置成功')
            setTimeout(() => {
              this.ultraPhone = ''
              this.ultraPassword = ''
              this.ultraShow = false
              this.hideShadeBox()
            }, 1000)
            return
          }
          this.$refs.order.showContent(res.message)
        })
      },
//      审核
      audit (res) {
        if (res.is_checked !== 2) {
          this.remarks = res.remark
          this.freezeText = '认证审核'
          this.$refs.order.showShade()
          this.merchantId = res.merchant_id
          this.check = 2
          this.isWithdrawal = true
        }
      },
      isDeal () {
        if (this.orderId && this.goNUm <= 1) {
          this.$router.push({path: 'notes', query: {status: 'license_audit'}})
          this.orderId = ''
        } else {
          this.$refs.order.hideShade()
          this.showList()
        }
      },
//      审核弹窗
      withdrawal (code) {
        let data = {note: this.reamrk, merchant_id: this.merchantId}
        if (this.check && this.check !== 1) {
          let data = {remark: this.remarks, merchant_id: this.merchantId, check_status: code}
          if (this.isWithdrawal) {
            this.isWithdrawal = false
            home.licenseAudit(data).then((res) => {
              if (res.error === ERR_OK) {
                switch (code) {
                  case 2:
                    this.$refs.order.showContent('审核通过')
                    break
                  case 3:
                    this.$refs.order.showContent('审核不通过')
                    break
                }
                this.isDeal()
                return
              }
              this.$refs.order.showContent(res.message)
              this.isWithdrawal = true
            })
          }
          return false
        }
        if (this.isWithdrawal) {
          this.isWithdrawal = false
          merchant.disable(data).then((res) => {
            if (res.error === ERR_OK) {
              let content = ''
              this.isDisabledCode ? content = '解冻' : content = '冻结'
              this.$refs.order.showContent(content + '成功')
              this.$refs.order.hideShade()
              this.showList()
              return
            }
            this.$refs.order.showContent(res.message)
            this.isWithdrawal = true
          })
        }
      },
      hideShadeBox () {
        this.$refs.order.hideShade()
      },
      showUltra (item) {
        this.$refs.order.showShade()
        this.check = 3
        this.ultraPassword = ''
        this.ultraPhone = item.mobile
        this.ultraShow = true
        merchant.getQrcord(item.merchant_id).then((res) => {
          if (res.error === ERR_OK) {
            this.shopQrcord = res.data.url
          }
        })
      },
      showList (status = false) {
        let data = {}
        data = Object.assign({}, {
          time: this.time,
          page: this.page,
          open_type: this.openType,
          role: this.role,
          service_version: this.serviceVersion,
          is_expiration: this.isExpiration,
          is_disabled: this.isDisabled,
          is_checked: this.checked,
          mobile: this.mobile
        }, this.address, this.shopId)
        if (status) {
          data = Object.assign({}, data, {merchant_id: this.orderId})
        }
        merchant.merchanList(data).then((res) => {
          this.goNUm++
          this.showContent = true
          if (res.error === ERR_OK) {
            res.data.map((item) => {
              item.end_time = false
            })
            this.merchanList = res.data
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
      showDetail (id) {
        this.$router.push({name: 'BusinessDetail', query: {id: id}})
        let title = sessionStorage.getItem('title').split(',')
        title.push('商家详情')
        sessionStorage.setItem('title', title)
      },
      hideTime () {
        this.merchanList.map((item) => {
          item.end_time = false
          return item
        })
      },
      openShop (merchantId) {
        this.merchantId = merchantId
        this.merchanList.map((item) => {
          if (item.merchant_id === merchantId) {
            item.end_time = !item.end_time
          } else {
            item.end_time = false
          }
          return item
        })
      },
      openServices (index) {
        if (this.endTime === '') {
          this.$refs.order.showContent('请选择开通时间')
          return
        }
        let endTime = this.farmatTime(this.endTime)
        let data = {expiration_time: endTime, merchant_id: this.merchantId}
        merchant.openService(data).then((res) => {
          if (res.error === ERR_OK) {
            this.merchanList[index].end_time = false
            this.$refs.order.showContent('开通成功')
            this.showList()
            this.endTime = ''
            return
          }
          this.$refs.order.showContent(res.message)
        })
      },
      showHeight (index) {
        this.heightIndex = index
      },
      hideHeight () {
        this.heightIndex = -1
      },
      checkTime (value, page) {
        if (Array.isArray(value)) {
          this.time = value.join(',')
        } else {
          this.time = value
        }
        this.$refs.order.beginPage()
        this.page = 1
        this.showList()
      },
      addPage (page) {
        this.page = page
        this.showList()
      },
      showCity (prams, page) {
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
  .buslist
    height: 100%

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
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
    .list-src
      color: $color-nomal !important
      text-decoration: underline
    .list-item
      color: $color-text
      flex: 1
      .showDetail
        cursor: pointer
        font-size: $font-size-small
        padding: 4% 4%
        color: $color-nomal
        border-radius: 3px
        border: 1px solid $color-nomal
        .audit-disable
          color: $color-text-little
        .audit
          color: $color-nomal
        .open
          position: relative
          .order-block
            z-index: 1000
            position: absolute
            bottom: -47px
            row-center()
            .time-sure
              position: absolute
              col-center()
              right: 15px
      &:nth-child(1), &:nth-child(2)
        flex: 1.2
      &:last-child
        flex: 1.5
    .list-box-active
      background: $color-background

  .list-header
    .list-item:last-child
      transform: translateX(8%)

  .shade-box
    max-height: 540px
    overflow-y: auto
    .shade-border
      font-size: $font-size-medium14
      padding-left: 30px
      display: flex
      height: 5.01vh
      align-items: center
      color: $color-text
      white-space: nowrap
      overflow: hidden
      position: relative
      border-bottom: 0.5px solid $color-icon-line
      .shade-text:disabled
        background: $color-white
      input.shade-text, textarea.shade-text
        height: 100%
        width: 100%
        padding-left: 10px
        border: 0.5px solid $color-line
      textarea.shade-text
        padding-top: 2px
        font-size: $font-size-medium14
        box-sizing: border-box
        outline: none
      .shade-text
        border: 0.5px solid transparent
        width: 65%

      .input-box
        width: 65%
        height: 75%
        border: 2px solid $color-white
        border-radius: 5px
        transform: translateX(-10px)
        position: relative
      .shade-title
        min-width: 112px
        no-wrap()
      &:first-child
        font-size: $font-size-medium16
        height: 7.01vh
        position: relative
        .close
          cursor: pointer
          position: absolute
          col-center()
          right: 30px
          color: #979797
          font-size: 24px
          transform: translateY(-50%) rotate(0deg)
          &:hover
            transform: translateY(-50%) rotate(90deg)
            transform-origin: 50%
            transition: transform 0.5s
      /*修改*/
      .amend
        position: absolute
        right: 30px
        font-size: $font-size-medium14
        padding: 8px 18px
        line-height: 1
        col-center()
        color: $color-nomal
        border: 1px solid $color-nomal
        border-radius: 3px
      /*单选*/
      .radios
        display: flex
        align-items: center
        margin-right: 60px
        .icon
          display: inline-block
          height: 16px
          width: 16px
          border: 1px solid #ccc
          border-radius: 100%
          margin-right: 6px
        .icon-active
          border: none
          icon-image('icon-rignt')
    .shade-img
      height: 10.41vw
      .qrcord-img
        height: 8.33vw
        width: 8.33vw
    .shade-exprent
      height: 144px
      display: block
      .exprent
        padding: 8px
        transform: translateY(-12px)
        display: block
        height: 74px
        width: 88.764%
        border: 0.5px solid $color-icon-line
    .shade-inquiry
      .shade-exprent
        height: 19vh
        display: block
        padding-top: 10px
        .ex-box
          transform: translateY(12px)
          border: 2px solid $color-white
          height: 75%
          width: 95.6%
        .exprent
          transform: translateY(0px)
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
          .input-height-item
            border: 1px solid #999 !important
            background: $color-white
      .ok
        .submit
          width: 220px
    .shade-input
      input.shade-text, textarea.shade-text
        background: $color-white
        border: 1px solid $color-line
        border-radius: 3px
    .ok
      height: 9.26vh
      display: flex
      justify-content: center
      align-items: center
      .submit
        height: 40px
        width: 41.19%
        border-radius: 3px
        color: $color-white
        text-align: center
        line-height: 40px
        background: $color-nomal
      .change
        margin-right: 20px
        background: $color-white
        border: 1px solid $color-line
        color: $color-text
        &:hover
          color: $color-nomal
          border: 1px solid $color-nomal
      .sure
        &:hover
          background: $color-hover
        &:active
          background: $color-active

    .shade-tiem:hover
      background: $color-background
      .input-box
        border: 2px solid $color-background
      input.shade-text:disabled, textarea.shade-text:disabled
        background: $color-background
        border: 0.5px solid $color-background
    .activation-code
      position: relative
      .input-box
        width: 40%
      .activation-tip
        right: -80%
        col-center()
        font-size: $font-size-small
        color: $color-text-little

  .shade-check
    .shade-exprent
      height: 19vh
      display: block
      padding-top: 10px
      .ex-box
        transform: translateY(12px)
        margin-top: 2px
        border: 2px solid $color-white
        height: 75%
        width: 95.6%
      .exprent
        transform: translateY(0px)
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
        .exprent
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

  .selects
    display: flex
    font-size: $font-size-medium14
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

  // 越权
  .ultra-vires-box
    all-center()
    width: 29vw
    border: 0.5px solid $color-icon-line
    background: $color-white
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    .ultra-vires-ok
      display: flex
      justify-content: center
      align-items: center
      height: 5.2vw
      .submit
        font-size: $font-size-medium16
        display: inline-block
        height: 2.5vw
        width: 11.45vw
        text-align: center
        line-height: 2.5vw
        border-radius: 3px
        background: $color-nomal
        color: $color-white
        &:hover
          background: $color-hover
        &:active
          background: $color-nomal

  .select
    margin-left: 1.9625vw

  .bl-mobile
    display: flex
    font-size: $font-size-medium14
    align-items: center
    transform: translateY(-10px)
    margin-left: 2.3vw
    .selects-inpput-box
      margin-left: 10px
      border: 2px solid $color-white
      .select-input
        height: 30px
        width: 10vw
        border-radius: 3px
        padding-left: 10px
        border: 1px solid $color-icon-line
    .select-item
      margin-left: 10px
      box-sizing: border-box
      width: 50px
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
</style>
