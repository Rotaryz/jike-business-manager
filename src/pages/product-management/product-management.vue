<template>
  <form-box :pageShow="pageShow">
    <div slot="form-list" class="official-network">
      <div class="iphone-box">
        <img src="./pic-nullpage@2x.png" class="iphone">
      </div>
      <div class="official-right">
        <p class="title">产品内容</p>
        <input type="text" class="official-content">
        <div class="official-title-box">
          <span class="official-tip">产品标题</span>
          <input type="text" class="official-title" placeholder="请输入产品标题">
        </div>
        <div class="official-text-box">
          <span class="official-tip">推荐理由</span>
          <textarea name="official" id="official-msg" placeholder="请输入公司介绍" cols="30" rows="10"></textarea>
        </div>
        <div class="official-image">
          <span class="official-tip">产品封面</span>
          <div class="image-file-box">
            <img src="./pic-uploading@2x.png" class="add-pic">
            <input type="file" class="file">
            <span class="image-tip">建议图片比例5:4, 2M以内</span>
          </div>
        </div>
        <div class="official-image">
          <span class="official-tip">产品详情</span>
          <div class="image-file-box">
            <img src="./pic-uploading@2x.png" class="add-pic">
            <input type="file" class="file">
            <span class="image-tip">建议图片比例5:4, 2M以内</span>
          </div>
        </div>
        <div class="official-btn">
          <div class="official-btn-item official-btn-while">返回</div>
          <div class="official-btn-item official-btn-orgin">添加</div>
        </div>
      </div>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  // import customer from 'api/customer'
  // import { ERR_OK } from 'api/config'

  export default {
    name: 'product-management',
    data () {
      return {
        pageShow: false
      }
    },
    components: {
      'form-box':
      FormBox
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .official-network
    padding-top: 36px
    .iphone-box
      width: 18.32%
      float: left
      margin-left: 110px
    .iphone
      width: 100%
    .official-right
      padding-left: 58px
      overflow: hidden
      box-sizing: border-box
    .official-tip
      tab-index: 12px
      font-size: $font-size-large14
      color: $color-text
      line-height: 18px
    .official-content
      color: $color-text
      width: 80%
      height: 29px
      border-bottom: 1px solid $color-line
    .official-text-box
      margin-top: 30px
      display: flex
      align-items: flex-start
      #official-msg
        margin-left: 16px
        width: 70%
        height: 8.33vh
        box-sizing: border-box
        padding: 8px 0 0 8px
        color: $color-text
        border: 1px solid $color-lineCC
        &::textarea-placeholder
          color: $color-lineCC
          font-size: $font-size-medium14
          font-family: $fontFamilyLight
    .official-image
      display: flex
      margin-top: 30px
      align-items: flex-start
      .file
        display: none
      .image-file-box
        position: relative
        .add-pic
          margin-left: 16px
          width: 120px
        .image-tip
          color: $color-lineCC
          white-space: normal
          margin-left: 10px
          font-size: $font-size-medium14
    .official-btn
      margin-top: 40px
      margin-left: 84px
      .official-btn-item
        display: inline-block
        width: 96px
        height: 40px
        border-radius: 3px
        font-size: $font-size-medium16
        margin-right: 20px
        line-height: 40px
        text-align: center
        position: relative
      .official-btn-while
        border-all($color-lineCC, 3px)
        color: $color-text
      .official-btn-orgin
        color: $color-white
        background: $color-orgin-theme

  .official-title-box
    margin-top: 30px
    display: flex
    .official-title
      box-sizing: border-box
      width: 70%
      margin-left: 16px
      height: 28px
      padding: 8px
      border : 1px solid $color-lineCC
      font-family: $fontFamilyLight
      font-size: $font-size-medium14
</style>