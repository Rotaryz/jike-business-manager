<template>
  <form-box>
    <div slot="form-list" class="form-list">
      <div class="tool">
        <div class="tool-add">+ 添加产品</div>
        <div class="up">上架</div>
        <div class="up">删除</div>
        <div class="tool-search">
          <input type="text" placeholder="请输入产品名称" class="search-input">
          <div class="search-box">
            <img src="./icon-search@2x.png" class="search-icon">
          </div>
        </div>
      </div>
      <div class="form-tab">
        <div class="form-tab-item hand" :class="{'form-tab-item-active': tabIndex === index, 'form-tab-item-right': tabIndex + 1 === index}" v-for="(item, index) in tabList" :key="index" @click="setTab(item,index)">
          {{item.title}}

        </div>
      </div>
      <div class="list-header">
        <div class="check-box">
          <span class="check-item"></span>
        </div>
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
          <img src="./icon-down@2x.png" class="down-icon" v-if="item === '状态'">
          <ul class="status-box" v-if="item === '状态'">
            <li class="status-item">全部</li>
            <li class="status-item">已下架产品</li>
            <li class="status-item">已上架产品</li>
          </ul>
        </div>
      </div>
      <ul class="list">
        <li class="list-box">
          <div class="check-box">
            <span class="check-item"></span>
          </div>
          <div class="list-item list-text">
            <img class="list-item-img" src="">
          </div>
          <div class="list-item list-text">A8防爆轮胎了解一下谢谢</div>
          <div class="list-item list-text">2018-07-02 12:21:22</div>
          <div class="list-item list-text">广州波仕卡汽车科技有限公司</div>
          <div class="list-item list-text">已下架</div>
          <div class="list-item"><span class="showDetail"><span>编辑<span class="line">|</span></span><span class="audit">删除</span></span></div>
        </li>
      </ul>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  // import customer from 'api/customer'
  // import { ERR_OK } from 'api/config'
  import Toast from 'components/toast/toast'

  const TITLELIST = ['产品图片', '产品名称', '修改时间', '发布者', '状态', '操作']

  export default {
    name: 'product',
    data () {
      return {
        titleList: TITLELIST
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
    .tool
      height: 28px
      line-height: 28px
      margin-top: 10px
      padding-left: 30px
      margin-bottom: 30px
      display: flex
      font-family: $fontFamilyLight
      font-size: $font-size-small12
      .tool-add
        text-align: center
        margin-right: 10px
        width: 94px
        border: 1px solid $color-orgin-theme
        color: $color-orgin-theme
      .up
        text-align: center
        margin-right: 10px
        width: 60px
        border: 1px solid #D9D9D9
        color: $color-text-icon
      .tool-search
        width: 244px
        border: 1px solid #D9D9D9
        box-sizing: border-box
        display: flex
        margin-left: 10px
        .search-input
          flex: 1
          text-indent: 8px
          box-sizing: border-box
        .search-box
          height: 100%
          width: 32px
          display: flex
          align-items: center
          justify-content: center
          background: #F7F7F7
          border-left: 1px solid #D9D9D9
          .search-icon
            width: 11.5px
    .list-header, .list-box
      display: flex
      align-items: center
    .list-header
      height: 9.5%
      border-bottom: 1px solid $color-line
      background: $color-big-background
    .list
      height: 80.5%
      display: flex
      flex-direction: column
      .list-box
        height: 10%
        border-bottom: 1px solid $color-line
        .list-item
          line-height: 16px
          color: $color-text
          font-size: $font-size-medium14
    .list-text
      width: 90%
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
    .list-item-img
      width :60px
      height : 40px
      border :none
      display: block
      background :$color-orgin-theme
    .check-box
      width : 85px
      .check-item
        margin-left :30px
        display :inline-block
        width :14px
        height :14px
        border: 1px solid #D9D9D9
    .list-item
      color: $color-text
      flex: 1
      position: relative
      .down-icon
        width :13px
        margin-left :4px
      .status-box
        box-shadow: 0 1px 5px 0 rgba(12,6,14,0.20)
        border-radius: 3px
        position : absolute
        z-index : 1000
        bottom: -105px
        padding : 10px 0
        background: $color-white
        .status-item
          background: $color-white
          font-size : $font-size-medium14
          text-indent :9px
          width : 124px
          height : 26px
          color :$color-text99
          line-height: 26px
        .status-item-active
          background: #F2F2F2
          color :$color-text
      .showDetail
        cursor: pointer
        font-size: $font-size-small
        color: $color-nomal
        border-radius: 3px
        .audit-disable
          color: $color-text-little
        .audit
          color: $color-nomal
      &:nth-child(3)
        flex: 2
      &:nth-child(5), &:nth-child(4)
        flex: 1.5
    .list-box-active
      background: $color-background

  .line
    font-family: PingFangSC-Light
    font-size: 12px
    color: $color-lineCC
    letter-spacing: 0
    line-height: 14px
    margin: 0 12.5px
</style>