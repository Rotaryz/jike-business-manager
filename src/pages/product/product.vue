<template>
  <form-box ref="formBox" :pageDtail="pageDtail" @addPage="_addPage">
    <div slot="form-list" class="form-list">
      <div class="tool">
        <router-link to="productManagement" class="tool-add hand">+ 添加产品</router-link>
        <div class="up hand" @click="_onProduct">{{status ? '下架' : '上架'}}</div>
        <div class="up hand" @click="_delProduct">删除</div>
        <div class="tool-search">
          <input type="text" placeholder="请输入产品名称" class="search-input" v-model="title">
          <div class="search-box hand" @click="_search">
            <img src="./icon-search@2x.png" class="search-icon">
          </div>
        </div>
      </div>
      <div class="list-header">
        <div class="check-box">
          <span class="check-item hand" :class="{'check-ok': checkAll}" @click="_getAll(checkAll)"></span>
        </div>
        <div class="list-item" :class="{hand: index === 4}" v-for="(item, index) in titleList" :key="index" @click="_showStatusBox(item)">
          {{index === 4 ? status ? '已上架' : '已下架' :item}}
          <img src="./icon-down@2x.png" class="down-icon" :class="{'down-icon-active': showStatus}" v-if="item === '状态'">
          <transition name="fade">
            <ul class="status-box" v-if="index === 4" v-show="showStatus" @click.stop="">
              <li class="status-item" @click.stop="_checkStatue(1)">已上架产品</li>
              <li class="status-item" @click.stop="_checkStatue(0)">已下架产品</li>
            </ul>
          </transition>
        </div>
      </div>
      <ul class="list">
        <li class="list-box" v-for="(item, index) in goodsList" :key="index">
          <div class="check-box">
            <span class="check-item hand" :class="{'check-ok': item.check}" @click="_checkItem(index)"></span>
          </div>
          <div class="list-item list-text">
            <img class="list-item-img" :src="item.image_url">
          </div>
          <div class="list-item list-text">{{item.title}}</div>
          <div class="list-item list-text">{{item.updated_at}}</div>
          <div class="list-item list-text">{{item.merchant_id}}</div>
          <div class="list-item list-text">{{item.is_online ? '已上架' : '已下架'}}</div>
          <div class="list-item"><span class="showDetail"><span @click="_upProduct(item.id)">编辑<span class="line">|</span></span><span class="audit" @click="_delItem(item.id)">删除</span></span></div>
        </li>
      </ul>
    </div>
    <div slot="shade-box" class="shade">
      <p class="shade-title">提示<span class="close" @click="_hideShade">&times;</span></p>
      <p class="shade-tip">{{isDelete ? '是否删除选中产品' : '是否下架'}}</p>
      <div class="shade-btn">
        <div class="share-btn-item hare-btn-white hand" @click="_hideShade">取消</div>
        <div class="share-btn-item hare-btn-orgin hand" @click="_doubelCheck">{{isDelete ? '删除' : '下架'}}</div>
      </div>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  import { Goods } from 'api'
  import { ERR_OK } from 'api/config'

  const TITLELIST = ['产品图片', '产品名称', '修改时间', '发布者', '状态', '操作']

  export default {
    name: 'product',
    data () {
      return {
        titleList: TITLELIST,
        page: 1,
        goodsList: [],
        upList: [],
        title: '',
        status: 1,
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        showStatus: false,
        isDelete: false,
        delId: null
      }
    },
    created () {
      this._goodsList('')
    },
    methods: {
      _checkStatue (status) {
        this.status = status
        this._goodsList()
        this.showStatus = false
      },
      _getAll (status) {
        this.goodsList.map((item) => {
          if (!status) {
            this.upList.push(item.id)
          } else {
            this.upList = []
          }
          item.check = !status
        })
      },
      _checkItem (index) {
        let item = this.goodsList[index]
        item.check = !item.check
        if (item.check) {
          this.upList.push(item.id)
        } else {
          let idIndex = this.upList.findIndex((items) => items === item.id)
          this.upList.splice(idIndex, 1)
        }
        this.goodsList.splice(index, 1, item)
      },
      _delItem (id) {
        this.isDelete = true
        this._showShade()
        this.delId = id
        // 单独删除
      },
      _showStatusBox (item) {
        if (item === '状态') {
          this.showStatus = !this.showStatus
        }
        this.isDelete = false
      },
      _onProduct (text) {
        if (!this.upList.length) {
          this.$refs.formBox.showContent('请选择商品')
          return
        }
        this.isDelete = false
        if (this.status === 0) {
          this._batch()
          return
        }
        this._showShade()
        console.log('上架商品')
      },
      _delProduct () {
        if (!this.upList.length) {
          this.$refs.formBox.showContent('请选择商品')
          return
        }
        this.isDelete = true
        this._showShade()
        console.log('删除商品')
      },
      _batch () {
        let status = this.status ? 0 : 1
        let data = {ids: this.upList, is_online: status, is_delete: this.isDelete}
        Goods.goodsBatchUpdate(data).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.formBox.showContent('批量操作完成')
            this._goodsList()
            this._hideShade()
          }
        })
      },
      _goodsList () {
        let data = {status: this.status, page: this.page, title: this.title, limit: 10}
        Goods.goodsList(data).then((res) => {
          if (res.error === ERR_OK) {
            let pages = res.meta
            this.pageDtail = [{
              total: pages.total,
              per_page: pages.per_page,
              total_page: pages.last_page
            }]
            let json = res.data.map((item) => {
              item.check = false
              return item
            })
            this.goodsList = json
          }
          // console.log(res)
        })
      },
      _showShade () {
        this.$refs.formBox.showShade()
      },
      _hideShade () {
        this.delId = null
        this.$refs.formBox.hideShade()
      },
      _search () {
        this.page = 1
        this.$refs.formBox.beginPage()
        this._goodsList()
      },
      _upProduct (id) {
        this.$router.push({path: 'productManagement', query: {id}})
      },
      _doubelCheck () {
        if (this.delId) {
          Goods.delGoods(this.delId).then((res) => {
            if (res.error === ERR_OK) {
              this.$refs.formBox.showContent('成功删除商品')
              this._hideShade()
              this._goodsList()
            }
            console.log(res)
          })
          return
        }
        this._batch()
      },
      _addPage (page) {
        this.page = page
        this._goodsList()
      }
    },
    computed: {
      checkAll () {
        if (!this.goodsList.length) {
          return false
        }
        let index = this.goodsList.findIndex((item) => item.check === false)
        let status = index === -1
        return status
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
      width: 60px
      height: 40px
      border: none
      display: block
    .check-box
      width: 85px
      .check-item
        margin-left: 30px
        display: inline-block
        width: 14px
        box-sizing: border-box
        height: 14px
        border: 1px solid #D9D9D9
      .check-ok
        border: none
        icon-image('icon-selected')
    .list-item
      color: $color-text
      flex: 1
      position: relative
      .down-icon
        width: 13px
        margin-left: 4px
        transform: rotate(0deg)
        transform-origin: 50%
        transition : all 0.3s
      .down-icon-active
        transform: rotate(180deg)
        transform-origin: 50%
        transition : all 0.3s
      .status-box
        box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
        border-radius: 3px
        position: absolute
        z-index: 1000
        bottom: -80px
        padding: 10px 0
        background: $color-white
        &.fade-enter, &.fade-leave-to
          opacity: 0
        &.fade-enter-to, &.fade-leave-to
          transition: opacity .2s ease-in-out
        .status-item
          background: $color-white
          font-size: $font-size-medium14
          text-indent: 9px
          width: 124px
          height: 26px
          color: $color-text99
          line-height: 26px
        .status-item-active
          background: #F2F2F2
          color: $color-text
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

  .shade
    height: 261px
    .shade-tip
      text-indent: 36px
      margin-top: 46px
      font-size: $font-size-medium14
      color: $color-text

  .shade-title
    text-indent: 30px
    position: relative
    height: 60px
    border-bottom: 1px solid #DADADA
    line-height: 60px

  .close
    cursor: pointer
    position: absolute
    col-center()
    right: 30px
    color: #979797
    font-size: 24px
    &:hover
      transform: translateY(-70%) translateX(39%) rotate(90deg)
      transform-origin: 50%
      transition: transform 0.5s

  .shade-btn
    width: 100%
    position: absolute
    bottom: 20px
    display: flex
    padding-right: 30px
    justify-content: flex-end
    .share-btn-item
      font-size: $font-size-medium16
      height: 40px
      width: 90px
      line-height: 40px
      text-align: center
      margin-left: 20px
      border-radius: 3px
    .hare-btn-white
      color: $color-text
      border: 1px solid $color-lineCC
    .hare-btn-orgin
      background: $color-orgin-theme
      color: $color-white
</style>