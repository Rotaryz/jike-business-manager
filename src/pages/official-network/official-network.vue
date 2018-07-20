<template>
  <form-box :pageShow="pageShow" ref="formBox">
    <div slot="form-list" class="official-network">
      <div class="iphone-box">
        <img src="./pic-nullpage@2x.png" class="iphone">
      </div>
      <div class="official-right">
        <div class="official-content-box">
          <p class="title">官网内容</p>
          <div type="text" class="official-content"></div>
          <div class="official-text-box">
            <span class="official-tip">公司介绍</span>
            <textarea name="official" id="official-msg" placeholder="请输入公司介绍" v-model="content"></textarea>
          </div>
          <div class="official-image">
            <span class="official-tip">公司图片</span>
            <div class="image-file-box">
              <div class="add-pic" v-for="(item, index) in image" :key="index">
                <img :src="item.url" class="add-pics hand" @click="_upImage(index)">
                <div class="close-icon hand" @click.stop="_delCover(index)">
                  <img class="close-icon" src="./icon-del@2x.png">
                </div>
              </div>
              <div class="add-pic">
                <img src="./pic-uploading@2x.png" class="add-pics hand" @click="_upImage(-1)">
              </div>
              <input type="file" class="file" id="product-cover" @change="_upImage($event)">
              <span class="image-tip">建议图片比例5:4, 2M以内</span>
            </div>

          </div>
          <div class="official-btn">
            <div class="official-btn-item official-btn-while hand" @click="_setNetWork(0)">保存</div>
            <div class="official-btn-item official-btn-orgin hand" @click="_setNetWork(1)">发布</div>
          </div>
        </div>
      </div>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  import { Website, UpLoad } from 'api'
  import { ERR_OK } from 'api/config'

  export default {
    name: 'official-network',
    data () {
      return {
        pageShow: false,
        content: '',
        companyIntroduction: '',
        image: [],
        isNew: true,
        imageIndex: null,
        id: null
      }
    },
    created () {
      this._getNetWork()
    },
    methods: {
      _delCover (index) {
        this.image.splice(index, 1)
      },
      _upImage (e) {
        let type = typeof e
        if (type === 'number') {
          this.imageIndex = e
        }
        document.getElementById('product-cover').click()
        if (e.target) {
          let param = this._infoImage(e.target.files[0])
          UpLoad.upLoadImage(param).then((res) => {
            if (res.error === ERR_OK) {
              res = res.data
              if (this.imageIndex === -1) {
                let item = {id: 0, image_id: res.id, url: res.url, sort: this.image.length}
                this.image.push(item)
                return
              }
              let item = {image_id: res.id, url: res.url, id: this.image[this.imageIndex].id, sort: this.imageIndex}
              this.image.splice(this.imageIndex, 1, item)
            }
          })
        }
      },
      _getNetWork () {
        Website.websiteDetail().then((res) => {
          this.isNew = res.error !== ERR_OK
          if (res.error === ERR_OK) {
            res = res.data
            console.log(res)
            this.content = res.introduction
            this.image = res.merchant_image
            console.log(this.image)
            this.id = res.id
          }
        })
      },
      _infoImage (file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name)// 通过append向form对象添加数据
        return param
      },
      _setNetWork (release) {
        if (!this.content) {
          this.$refs.formBox.showContent('请输入公司介绍')
        }
        if (!this.image.length) {
          this.$refs.formBox.showContent('请上传公司图片')
        }
        let data = {introduction: this.content, image: this.image, is_release: release}
        if (this.isNew) {
          Website.createWebsite(data).then((res) => {
            if (res.error === ERR_OK) {
              let title = release ? '发布成功' : '保存成功'
              this.$refs.formBox.showContent(title)
              this._getNetWork()
              return
            }
            this.$refs.formBox.showContent(res.message)
          })
          return
        }
        Website.upWebsite(this.id, data).then((res) => {
          if (res.error === ERR_OK) {
            let title = release ? '发布成功' : '保存成功'
            this.$refs.formBox.showContent(title)
            return
          }
          this.$refs.formBox.showContent(res.message)
        })
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
      .official-content-box
        width: 80%
    .official-tip
      white-space: nowrap
      tab-index: 12px
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
    .official-text-box
      margin-top: 30px
      display: flex
      align-items: flex-start
      #official-msg
        margin-left: 16px
        width: 88%
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
        display: flex
        flex-wrap: wrap
        align-items: flex-end
        position: relative
        margin-bottom: 10px
        .add-pic
          margin-bottom: 10px
          margin-left: 16px
          width: 120px
          height: 96px
          position: relative
          overflow: hidden
        .add-pics
          width: 100%
        .close-icon
          height: 16.5px
          width: 16.5px
          line-height: 16.5px
          text-align: center
          background: rgba(0, 0, 0, 0.20)
          color: $color-white
          font-size: $font-size-10
          position: absolute
          right: 0px
          top: 0px
          .close-icon
            cll-center()
            height: 16.5px
            width: 16.5px
        .image-tip
          margin-bottom: 10px
          margin-top: 10px
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
</style>