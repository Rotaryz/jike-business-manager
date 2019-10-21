<template>
  <form-box :pageShow="pageShow" ref="formBox">
    <div slot="form-list" class="official-network">
      <div class="iphone-box">
        <img src="./pic-nullpage@2x.png" class="iphone">
        <div class="off-box" v-if="image.length || content">
          <div class="video-box" v-if="videoUrl">
            <video :src="videoUrl" class="phone-video"></video>
          </div>
          <div class="goods-icon">
            <span class="goods-small-box goods-small-tall"></span>
            <span class="goods-small-box goods-small-width"></span>
            <span class="goods-small-text">公司介绍</span>
          </div>
          <pre class="text" v-if="content">{{content}}</pre>
          <div class="img-box" v-if="image.length">
            <img v-for="(item, index) in image" :key="index" :src="item.url" class="net-img" mode="widthFix">
          </div>
        </div>
      </div>
      <div class="official-right">
        <div class="official-content-box">
          <p class="title">官网内容</p>
          <div type="text" class="official-content"></div>
          <div class="official-image official-short">
            <span class="official-tip">公司视频</span>
            <div class="image-file-box">
              <div class="add-pic" v-if="videoUrl">
                <video :src="videoUrl" class="add-pics"></video>
                <div class="close-icon hand" @click.stop="_delVideo()">
                  <img class="close-icon" src="./icon-del@2x.png">
                </div>
              </div>
              <div class="add-pic" v-if="!videoUrl">
                <img src="./loading.gif" class="loading" v-if="loading">
                <img src="./pic-uploading-video@2x.png" class="add-pics hand">
                <input type="file" class="file" id="product-video" @change="_upVideo($event)" accept="video/*">
              </div>
              <span class="image-tip">可上传30M以内视频</span>
            </div>
          </div>
          <div class="official-text-box">
            <span class="official-tip">公司介绍</span>
            <textarea name="official" id="official-msg" placeholder="请输入公司介绍" v-model="content"></textarea>
          </div>
          <div class="official-image">
            <span class="official-tip">公司图片</span>
            <div class="image-file-box">
              <div class="add-pic" v-for="(item, index) in image" :key="index" :style="{'background-image': 'url(' +item.url + ')'}">
                <!--<img :src="item.url" class="add-pics hand" @click="_upImage(index)">-->
                <div class="close-icon hand" @click.stop="_delCover(index)">
                  <img class="close-icon" src="./icon-del@2x.png">
                </div>
              </div>
              <div class="add-pic">
                <img src="./pic-uploading@2x.png" class="add-pics hand" @click="_upImage(-1)">
              </div>
              <input type="file" class="file" id="product-cover" @change="_upImage($event)">
              <span class="image-tip">建议图片比例5:4, 10M以内</span>
            </div>
          </div>
          <div class="official-text-box">
            <span class="official-tip">公司电话</span>
            <input type="text" placeholder="请输入" class="tel" v-model="phone">
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
  import {Website, UpLoad} from 'api'
  import {ERR_OK} from 'api/config'

  export default {
    name: 'official-network',
    data() {
      return {
        pageShow: false,
        content: '',
        companyIntroduction: '',
        image: [],
        isNew: true,
        imageIndex: null,
        id: null,
        dels: [],
        videoUrl: '',
        videoId: '',
        phone: '',
        loading: false
      }
    },
    created() {
      this._getNetWork()
    },
    methods: {
      _delVideo() {
        this.videoUrl = ''
        this.videoId = ''
      },
      _delCover(index) {
        this.dels.push(this.image[index].id)
        this.image.splice(index, 1)
      },
      async _upVideo(e) {
        this.loading = true
        let param = this._infoImage(e.target.files[0])
        let res = await UpLoad.upLoadVideo(param)
        this.loading = false
        if (res.error !== ERR_OK) {
          this.$refs.formBox.showContent(res.message)
        }
        this.videoUrl = res.data.url
        this.videoId = res.data.id
      },
      _upImage(e) {
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
      _getNetWork() {
        Website.websiteDetail().then((res) => {
          this.isNew = res.error !== ERR_OK
          if (res.error === ERR_OK) {
            res = res.data
            this.content = res.introduction
            this.image = res.merchant_image
            this.videoUrl = res.merchant_video.length ? res.merchant_video[0].url : ''
            this.videoId = res.merchant_video[0] ? res.merchant_video[0].id : ''
            this.phone = res.telephone
            this.id = res.id
          }
        })
      },
      _infoImage(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name)// 通过append向form对象添加数据
        return param
      },
      _setNetWork(release) {
        // if (!this.content) {
        //   this.$refs.formBox.showContent('请输入公司介绍')
        //   return
        // }
        // if (!this.image.length) {
        //   this.$refs.formBox.showContent('请上传公司图片')
        //   return
        // }
        let data = {introduction: this.content, image: this.image, is_release: release, video_id: this.videoId, telephone: this.phone}
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
        data = Object.assign({}, data, {dels: this.dels})
        Website.upWebsite(this.id, data).then((res) => {
          if (res.error === ERR_OK) {
            this._getNetWork()
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
      min-width: 320px
      margin-left: 110px
      position: relative
    .off-box
      top: 18.6%
      left: 6.9%
      width: 86.55%
      height: 65.6%
      overflow-x: hidden
      position: absolute
      background: $color-white
      border-radius: 5px
      box-sizing: border-box
      &::-webkit-scrollbar
        display: none
      .video-box
        max-height: 200px
        overflow: hidden
      .phone-video
        width: 100%
      .goods-icon
        font-size: $font-size-14
        color: $color-text
        font-family: $font-family-regular
        position: relative
        height: 63px
        .goods-small-box
          border-1px(#CCCCCC, 0px)
          all-center()
        .goods-small-tall
          height: 33px
          width: 95px
        .goods-small-width
          height: 27px
          width: 101px
        .goods-small-text
          all-center()

      .text
        width: 94%
        margin: 0 auto
        border-all: (rgba(32, 32, 46, 0.10))
        box-shadow: 0 4px 12px 0 rgba(43, 43, 145, 0.07)
        border-radius: 2px
        background: $color-white
        font-size: $font-size-14
        font-family: $font-family-regular
        line-height: 22px
        padding: 15px
        box-sizing: border-box
        white-space: pre-wrap
        word-wrap: break-word
        -webkit-box-orient: vertical
    .img-box
      width: 94%
      margin: 15px auto 0
      border-radius: 2px
      border-1px()
      box-shadow: 0 4px 12px 0 rgba(43, 43, 145, 0.07)
      background: $color-white
      padding: 15px
      .net-img
        display: block
        width: 100%
    .iphone
      width: 100%
    .official-right
      padding-left: 58px
      overflow: hidden
      box-sizing: border-box
      .official-content-box
        width: 81%
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
        font-size: $font-size-medium14
        color: $color-text
        font-family: $fontFamilyLight
        border: 1px solid $color-lineCC
        &::textarea-placeholder
          color: $color-lineCC
          font-size: $font-size-medium14
          font-family: $fontFamilyLight
      .tel
        height: 28px
        width: 270px
        margin-left: 16px
        border: 0.5px solid $color-lineCC
        text-indent: 8px
        font-size: $font-size-medium14
        color: $color-text
        font-family: $fontFamilyLight
        &::-webkit-input-placeholder
          color: $color-lineCC
          font-size: $font-size-medium14
          font-family: $fontFamilyLight
    .official-image
      display: flex
      align-items: flex-start
      margin-top: 30px
      .file
        display: none
      .image-file-box
        padding-top: 14px
        margin-top: -14px
        display: flex
        flex-wrap: wrap
        align-items: flex-end
        position: relative
        margin-bottom: 10px
        max-height: 190px
        overflow-y: auto
        &::-webkit-scrollbar
          display: none
        .add-pic
          background-position: center
          background-repeat: no-repeat
          background-size: cover
          margin-bottom: 10px
          margin-left: 16px
          width: 120px
          height: 96px
          position: relative
          .loading
            height: 30px
            all-center()
        .add-pics
          width: 100%
        #product-video
          display: block
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
          z-index: 100
          opacity: 0
        .close-icon
          height: 26px
          width: 26px
          line-height: 16.5px
          text-align: center
          color: $color-white
          font-size: $font-size-10
          position: absolute
          right: -6.5px
          top: -6.5px
          .close-icon
            cll-center()
            height: 26px
            width: @height
        .image-tip
          margin-bottom: 10px
          margin-top: 10px
          color: $color-lineCC
          white-space: normal
          margin-left: 10px
          font-size: $font-size-medium14
    .official-short
      height: 96px
      .image-file-box
        .add-pic
          margin-bottom: 0
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
