<template>
  <form-box ref="order" :pageShow="false" :tagTop="true" :chioce="false" :isIndustrie="false">
    <div slot="form-list" v-if="merchantDetail.expiration_time">
      <div class="shade-border shade-out-title">商家属性</div>
      <div class="shade-content">
        <div class="shade-border shade-tiem">
          <span class="shade-title">商家名称</span>
          <span class="shade-text">{{merchantDetail.shop_name}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">商家账号</span>
          <span class="shade-text">{{merchantDetail.account}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">注册时间</span>
          <span class="shade-text">{{merchantDetail.register_time}}</span>
        </div>
        <div class="shade-border shade-tiem" :class="{'shade-input':!disableds}">
          <span class="shade-title">联系方式</span>
          <div class="input-box" :class="{'input-height': heightType === 0}">
            <input type="number" :class="{'input-height-item': !disableds}"
                   class="shade-text" maxlength="11"
                   v-model="merchantDetail.mobile" name="change" @input="onPhone" @focus="isFocus(0)"
                   @blur="heightType = -1"/>
          </div>
        </div>
        <div class="shade-border shade-tiem" :class="{'shade-input':!disableds}">
          <span class="shade-title">所在行业</span>
          <div class="input-box" :class="{'input-height': heightType === 1}">
            <input class="shade-text" :class="{'input-height-item': !disableds}"
                   v-model="merchantDetail.industry_name"
                   name="change" @focus="isFocus(1)" @blur="heightType = -1"
                   :disabled="disableds"/>
          </div>
        </div>
        <div class="shade-border shade-tiem" :class="{'shade-input':!disableds}">

          <span class="shade-title">所在位置</span>
          <div class="input-box" :class="{'input-height': heightType === 2}">
          <textarea :class="{'input-height-item': !disableds}"
                    @focus="isFocus(2)" @blur="heightType = -1"
                    class="shade-text" v-model="merchantDetail.particular_address" :disabled="disableds"></textarea>
          </div>
        </div>
        <div class="shade-border shade-tiem" :class="{'shade-input':!disableds}">
          <span class="shade-title">所在商圈</span>
          <div class="input-box" :class="{'input-height': heightType === 3}">
            <input class="shade-text" :class="{'input-height-item': !disableds}"
                   v-model="merchantDetail.business_circle_name"
                   name="change" :disabled="disableds" @focus="isFocus(3)"
                   @blur="heightType = -1"/>
          </div>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">开通时间</span>
          <span class="shade-text">{{merchantDetail.open_service_log ? merchantDetail.open_service_log.created_at : ''}}</span>
        </div>
        <div class="shade-border shade-tiem end-time" :class="{'shade-input':!disableds}">
          <span class="shade-title">到期时间</span>
          <div class="order-block input-box" :class="{'order-boder': !disableds}">
            <el-date-picker
              v-model="merchantDetail.expiration_time"
              type="datetime">
            </el-date-picker>
          </div>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">开通方式</span>
          <span class="shade-text">{{!merchantDetail.open_service_log ? '' : merchantDetail.open_service_log.open_type === 0 ? '支付开通' : merchantDetail.open_service_log.open_type === 1 ? '盟主开通' : merchantDetail.open_service_log.open_type === 2 ? '后台开通' : ''}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">商家属性</span>
          <div class="radios" @click="level('single')">
          <span class="icon hand"
                :class="{'icon-active': merchantDetail.reseller_level === 0}"></span>
            <span class="title">单店</span>
          </div>
          <div class="radios" @click="level">
          <span class="icon hand"
                :class="{'icon-active': merchantDetail.reseller_level === 1}"></span>
            <span class="title">连锁门店</span>
          </div>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">商家角色</span>
          <div class="radios" @click="leader('leader')">
          <span class="icon hand"
                :class="{'icon-active': merchantDetail.is_leader === 0}"></span>
            <span class="title">普通</span>
          </div>
          <div class="radios" @click="leader">
          <span class="icon hand"
                :class="{'icon-active': merchantDetail.is_leader === 1}"></span>
            <span class="title">盟主</span>
          </div>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">版本</span>
          <span class="shade-text">{{merchantDetail.service_version ? '普通' : '试用'}}</span>
        </div>
        <div class="shade-border shade-tiem activation-code" :class="{'shade-input':!disableds}" v-show="merchantDetail.is_leader">
          <span class="shade-title">生成激活码</span>
          <div class="input-box" :class="{'input-height': heightType === 7}">
            <input class="shade-text" :class="{'input-height-item': !disableds}" type="number"
                   v-model="activationCode"
                   name="change" :disabled="disableds" @focus="isFocus(7)"
                   @blur="heightType = -1"/>
            <span class="activation-tip">累计{{merchantDetail.inviter_code_count + (activationCode * 1)}}个</span>
          </div>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">账号状态</span>
          <span class="shade-text">{{merchantDetail.is_disabled ? '已冻结' : '未冻结'}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">商家状态</span>
          <span class="shade-text">{{merchantDetail.is_expiration ? '已过期' : '使用中'}}</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">冻结原因</span>
          <span class="shade-text">{{merchantDetail.note}}</span>
        </div>
        <div class="shade-border shade-tiem" v-show="merchantDetail.is_leader">
          <span class="shade-title"></span>
          <span class="shade-text"></span>
        </div>
      </div>
      <div class="shade-border shade-out-title shade-shop">门店证照</div>
      <div class="shade-content">
        <div class="shade-border shade-tiem" :class="{'shade-input':!disableds}">
          <span class="shade-title">姓名</span>
          <div class="input-box" :class="{'input-height': heightType === 4}">
            <input type="text" :class="{'input-height-item': !disableds}"
                   class="shade-text" v-model="merchantDetail.user_name" name="change"
                   :disabled="disableds" @input="onPhone" @focus="isFocus(4)"
                   @blur="heightType = -1"/>
          </div>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">证件类型</span>
          <span class="shade-text">身份证</span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title">证件号码</span>
          <span class="shade-text"></span>
        </div>
        <div class="shade-border shade-tiem">
          <span class="shade-title"></span>
          <span class="shade-text"></span>
        </div>
        <div class="shade-border shade-tiem shade-image">
          <span class="shade-title">身份证正面</span>
          <div class="shade-img-box" :class="{'shade-image-bg':merchantDetail && merchantDetail.credential_images.length}">
            <span class="img-title" v-show="merchantDetail && !merchantDetail.credential_images.length">身份证正面</span>
            <img class="shade-img" v-show="merchantDetail && merchantDetail.credential_images.length" :src="merchantDetail.credential_images.length ? merchantDetail.credential_images[0].image_url : ''">
          </div>
        </div>
        <div class="shade-border shade-tiem shade-image">
          <span class="shade-title">身份证反面</span>
          <div class="shade-img-box" :class="{'shade-image-bg':merchantDetail && merchantDetail.credential_images.length}">
            <span class="img-title" v-show="merchantDetail && !merchantDetail.credential_images.length">身份证反面</span>
            <img class="shade-img" v-show="merchantDetail && merchantDetail.credential_images.length" :src="merchantDetail.credential_images.length ? merchantDetail.credential_images[1].image_url : ''">
          </div>
        </div>
        <div class="shade-border shade-tiem shade-image">
          <span class="shade-title">手持证件照</span>
          <div class="shade-img-box" :class="{'shade-image-bg':merchantDetail && merchantDetail.credential_images.length}">
            <span class="img-title" v-show="merchantDetail && !merchantDetail.credential_images.length">手持证件照</span>
            <img class="shade-img" v-show="merchantDetail && merchantDetail.credential_images.length" :src="merchantDetail.credential_images.length ? merchantDetail.credential_images[2].image_url : ''">
          </div>
        </div>
        <div class="shade-border shade-tiem shade-image">
          <span class="shade-title">商户承诺函证明</span>
          <div class="shade-img-box" :class="{'shade-image-bg':merchantDetail && merchantDetail.credential_images.length}">
            <span class="img-title" v-show="merchantDetail && !merchantDetail.credential_images.length">商户承诺函证明</span>
            <img class="shade-img" v-show="merchantDetail && merchantDetail.credential_images.length" :src="merchantDetail.credential_images.length ? merchantDetail.credential_images[3].image_url : ''">
          </div>
        </div>
      </div>
      <div class="ok">
        <span class="submit change hand" @click="back">{{cancelTitle}}</span>
        <span class="submit sure hand"
              @click="merchantMessage(merchantDetail.id)">保存</span>
      </div>
    </div>
  </form-box>
</template>

<script type="text/ecmascript-6">
  import FormBox from 'components/form-box/form-box'
  import merchant from 'api/merchant'
  import {ERR_OK} from 'api/config'
  import {mixinBase} from 'common/mixin/base'
  export default {
    mixins: [mixinBase],
    data() {
      return {
        merchantDetail: {},
        heightType: -1,
        disableds: false,
        cancelTitle: '返回',
        activationCode: 0
      }
    },
    created() {
      this.showDetail()
    },
    methods: {
//      报存修改
      merchantMessage(id) {
        let date = this.farmatTime(this.merchantDetail.expiration_time)
        let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
        if (!reg.test(this.merchantDetail.mobile) && this.merchantDetail.mobile !== '') {
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
            this.$router.back(-1)
            this.$refs.order.hideShade()
          }
          this.$refs.order.showContent(res.message)
        })
      },
      back() {
        this.$router.back(-1)
      },
      isFocus(num) {
        this.heightType = num
      },
      showDetail() {
        let id = this.$route.query.id
        merchant.merchantDetail(id).then((res) => {
          if (res.error === ERR_OK) {
            this.merchantDetail = res.data
            this.merchantDetail.expiration_time = new Date(this.merchantDetail.expiration_time * 1000)
          }
        })
      },
      onPhone() {
        if (this.merchantDetail.mobile.length > 11) {
          this.merchantDetail.mobile = this.merchantDetail.mobile.slice(0, 11)
          return false
        }
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
      }
    },
    components: {
      'form-box': FormBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .shade-out-title
    background: #FAFAFA
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

  .shade-shop
    margin-top: 50px

  .shade-content
    display: flex
    flex-wrap: wrap
    .shade-tiem
      width: 50%
    .shade-right, .shade-left
      flex: 1
    .shade-border
      font-size: $font-size-medium14
      padding-left: 30px
      display: flex
      height: 7.1vh
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
      .shade-img-box
        position: relative
        width: 17.7vw
        height: 10.625vw
        border: 0.5px dashed #DAE0E4
        background: #F8F8F8
        border-radius: 4px
        .img-title
          padding: 0.52vw 1.77vw
          background: $color-white
          border: 0.5px solid $color-line
          border-radius: 100px
          font-size: 14px
          all-center()
          color: $color-text-little
        img.shade-img
          height: 100%
          width: 100%
          border-radius: 4px
      .shade-image-bg
        background :$color-white
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
    .shade-image
      height: 252px

  .shade-exprent
    height: 144px
    display: block
    #exprent
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
      #exprent
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
      width: 220px
      border-radius: 3px
      color: $color-white
      text-align: center
      line-height: 40px
      background: $color-nomal
    .change
      margin-right: 60px
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
</style>
