<template>
  <form-box :pageShow="pageShow" ref="formBox">
    <div slot="form-list" class="official-network">
      <div class="iphone-box">
        <img src="./pic-nullpage@2x.png" class="iphone">
      </div>
      <div class="official-right">
        <div class="offical-small">
          <p class="title">产品内容</p>
          <div type="text" class="official-content"></div>
          <div class="official-title-box">
            <span class="official-tip">产品标题</span>
            <input type="text" class="official-title" placeholder="请输入产品标题" v-model="productTitle" maxlength="20">
          </div>
          <div class="official-text-box">
            <span class="official-tip">推荐理由</span>
            <textarea name="official" id="official-msg" placeholder="请输入公司介绍" v-model="reason" maxlength="50"></textarea>
          </div>
          <div class="official-image">
            <span class="official-tip">产品封面</span>
            <div class="image-file-box">
              <div class="add-pic">
                <img :src="productCover.image_url || addIcon" class="add-pics hand" @click="_fileChange(0)">
              </div>
              <form>
                <input type="file" id="product-cover" class="file" @change="_fileChange($event)" accept="image/*">
              </form>
              <span class="image-tip">建议图片比例5:4, 2M以内</span>
            </div>
          </div>
          <div class="official-image">
            <span class="official-tip">产品详情</span>
            <div class="image-file-box">
              <div class="add-pic" v-for="(item, index) in productDetail" :key="index">
                <img :src="item.image_url" class="add-pics hand" @click="_fileDetail(index)">
              </div>
              <div class="add-pic">
                <img src="./pic-uploading@2x.png" class="add-pics hand" @click="_fileDetail(-1)">
              </div>
              <form>
                <input type="file" class="file" id="product-detail" @change="_fileDetail($event)" accept="image/*">
              </form>
              <span class="image-tip">建议图片比例5:4, 2M以内</span>
            </div>
          </div>
          <div class="official-btn">
            <div class="official-btn-item official-btn-while hand" @click="_back">返回</div>
            <div class="official-btn-item official-btn-orgin hand" @click="_addProduct">添加</div>
          </div>
        </div>
      </div>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  import { Goods, UpLoad } from 'api'
  import { ERR_OK } from 'api/config'

  export default {
    name: 'product-management',
    data () {
      return {
        pageShow: false,
        id: null,
        productTitle: '',
        reason: '',
        productCover: {},
        productDetail: [],
        addIcon: require('./pic-uploading@2x.png'),
        imageIndex: null
      }
    },
    created () {
      this.id = this.$route.query.id || null
      this._getProduvtDetail()
    },
    methods: {
      _fileChange (e) {
        document.getElementById('product-cover').click()
        if (e.target) {
          let param = this._infoImage(e.target.files[0])
          UpLoad.upLoadImage(param).then((res) => {
            if (res.error === ERR_OK) {
              res = res.data
              this.productCover = {image_id: res.id, image_url: res.url}
              return
            }
            this.$refs.formBox.showContent(res.message)
          })
        }
      },
      _infoImage (file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name)// 通过append向form对象添加数据
        return param
      },
      _fileDetail (e) {
        let type = typeof e
        if (type === 'number') {
          this.imageIndex = e
        }
        document.getElementById('product-detail').click()
        if (e.target) {
          let param = this._infoImage(e.target.files[0])
          UpLoad.upLoadImage(param).then((res) => {
            if (res.error === ERR_OK) {
              res = res.data
              if (this.imageIndex === -1) {
                let item = {image_id: res.id, image_url: res.url}
                this.productDetail.push(item)
                return
              }
              let item = {image_id: res.id, image_url: res.url, id: this.productDetail[this.imageIndex].id}
              this.productDetail.splice(this.imageIndex, 1, item)
              return
            }
            this.$refs.formBox.showContent(res.message)
          })
        }
      },
      _getProduvtDetail (e) {
        if (!this.id) {
          return
        }
        Goods.goodsDetail(this.id).then((res) => {
          if (res.error === ERR_OK) {
            res = res.data
            this.productTitle = res.title
            this.productDetail = res.goods_images
            this.productCover.image_url = res.image_url
            this.reason = res.subtitle
          }
        })
      },
      _addProduct () {
        let data = {title: this.productTitle, subtitle: this.reason, goods_images: this.productDetail, platform_price: 10, original_price: 10, image_id: this.productCover.image_id, total_stock: -1, is_online: 1}
        if (this.id) {
          Goods.putGoods(data, this.id).then((res) => {
            if (res.error === ERR_OK) {
              this.$refs.formBox.showContent('编辑产品成功')
              this.$router.back()
              return
            }
            this.$refs.formBox.showContent(res.message)
          })
          // 编辑
          return
        }
        Goods.createGoods(data).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.formBox.showContent('新建产品成功')
            this.$router.back()
            return
          }
          this.$refs.formBox.showContent(res.message)
        })
        // 新建
      },
      _back () {
        this.$router.back()
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
      .offical-small
        width: 80%
    .official-tip
      tab-index: 12px
      white-space: nowrap
      font-size: $font-size-large14
      color: $color-text
      line-height: 18px
    .official-content
      color: $color-text
      width: 100%
      height: 29px
      border-bottom: 1px solid $color-line
    .official-text-box
      margin-top: 30px
      display: flex
      align-items: flex-start
      #official-msg
        margin-left: 16px
        width: 100%
        height: 8.33vh
        box-sizing: border-box
        padding: 8px 0 0 8px
        color: $color-text
        border: 1px solid $color-lineCC
        &::-webkit-input-placeholder
          color: $color-lineCC
          font-size: $font-size-medium14
          font-family: $fontFamilyLight
    .official-image
      display: flex
      margin-top: 30px
      align-items: flex-start
      .file
        height: 1px
        width 1px
        opacity: 0
      .image-file-box
        display: flex
        flex-wrap: wrap
        align-items: flex-end
        position: relative
        .add-pic
          margin-bottom: 10px
          margin-left: 16px
          width: 120px
          height: 96px
          overflow: hidden
        .add-pics
          width: 100%
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
    align-items: center
    display: flex
    .official-title
      box-sizing: border-box
      width: 100%
      margin-left: 16px
      height: 28px
      padding: 8px
      border: 1px solid $color-lineCC
      font-family: $fontFamilyLight
      font-size: $font-size-medium14
</style>