<template>
  <form-box :pageShow="pageShow" ref="formBox">
    <div slot="form-list" class="employees">
      <p class="employees-title">员工编辑</p>
      <div class="employees-item">
        <span class="employees-name">姓名</span>
        <input type="text" placeholder="请输入" class="employees-input" v-model="name">
      </div>
      <div class="employees-item">
        <span class="employees-name">职位</span>
        <input type="text" placeholder="请输入" class="employees-input" v-model="position">
      </div>
      <div class="employees-item">
        <span class="employees-name">绑定微信手机号</span>
        <input type="text" placeholder="请输入" class="employees-input" v-model="mobile">
        <span class="employees-tip">此号将绑定企业微信，用于微信内登录和接</span>
      </div>
      <div class="employees-item">
        <span class="employees-name">名片展示手机号</span>
        <input type="text" placeholder="请输入" class="employees-input" v-model="businessCardMobile">
        <span class="employees-tip">此号将显示在AI名片的联系方式上，可在AI雷达“我”-“个人信息”中修改</span>
      </div>
      <div class="official-btn">
        <div class="official-btn-item official-btn-while hand" @click="_back()">返回</div>
        <div class="official-btn-item official-btn-orgin hand" @click="_submitUser">保存</div>
      </div>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  import { ERR_OK } from 'api/config'
  import { Employee } from 'api'

  export default {
    name: 'add-employees',
    data () {
      return {
        pageShow: false,
        name: '',
        mobile: '',
        position: '',
        businessCardMobile: '',
        id: null
      }
    },
    created () {
      this.id = this.$route.query.id || null
      this._getDetail()
    },
    methods: {
      _back () {
        this.$router.back()
      },
      _getDetail () {
        if (!this.id) {
          return
        }
        Employee.getUser({user_id: this.id}).then((res) => {
          if (res.error === ERR_OK) {
            res = res.data
            this.name = res.name
            this.mobile = res.mobile
            this.position = res.position
            this.businessCardMobile = res.business_card_mobile
          }
        })
      },
      _submitUser () {
        let data = {name: this.name, mobile: this.mobile, position: this.position, business_card_mobile: this.businessCardMobile}
        if (this.id) {
          data = Object.assign({}, data, {user_id: this.id})
          Employee.updateUser(data).then((res) => {
            if (res.error === ERR_OK) {
              this.$refs.formBox.showContent('保存成功')
              this.$router.back()
              return
            }
            this.$refs.formBox.showContent(res.message)
          })
          return
        }
        Employee.createcUser(data).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.formBox.showContent('保存成功')
            this.$router.back()
            return
          }
          this.$refs.formBox.showContent(res.message)
        })
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
  .employees
    padding-left: 10px
    .employees-title
      font-size: $font-size-large18
      color: $color-text
      width: 57%
      text-indent: 12px
      padding: 17px 0 29px
      margin-bottom: 10px
      border-bottom: 1px solid $color-line
    .employees-item
      display: flex
      margin-top: 20px
      align-items: center
      .employees-name
        font-size: $font-size-medium14
        width: 98px
        margin-right: 16px
        text-align: right
      .employees-input
        width: 292px
        height: 28px
        text-indent: 8px
        font-family: $fontFamilyLight
        font-size: $font-size-medium14
        border: 1px solid $color-lineCC
        &:-webkit-input-placeholder
          font-family: $fontFamilyLight
      .employees-tip
        font-size: $font-size-medium14
        margin-left: 10px
        color: $color-lineCC

  .official-btn
    margin-top: 40px
    display: flex
    margin-left: 114px
    .official-btn-item
      width: 96px
      height: 40px
      border-radius: 3px
      font-size: $font-size-medium16
      margin-right: 20px
      line-height: 40px
      text-align: center
      position: relative
    .official-btn-while
      color: $color-text
      border: 1px solid $color-lineCC
    .official-btn-orgin
      color: $color-white
      background: $color-orgin-theme

</style>