<template>
  <transition>
    <form-box ref="order" @addPage="addPage"
              :pageDtail="pageDtail" :chioce="chioce"
              :isIndustrie="isIndustrie">
      <div class="tap" slot="tap">
        <div class="tap-first">
          <div class="tap-item" v-for="(item, index) in tapList"
               :class="{'tap-item-active':tapIndex === index}" :key="index"
               @click="checkTap(index,item.type)">{{item.title}}
          </div>
        </div>
        <div slot="tag-sel" class="selects">
          <div class="select-box">
            <span class="select-item hand" @click="showDetail()">+ 新增</span>
          </div>
        </div>
      </div>
      <div slot="form-list" class="form-list form-industry"
           v-show="type === 'industry' && showContent">
        <div class="list-header list-industry">
          <div class="list-item" v-for="(item, index) in titleList"
               :key="index">
            {{item}}
          </div>
        </div>
        <ul class="list">
          <li class="list-box list-industry"
              v-for="(item,index) in industryList"
              :class="{'list-box-active': heightIndex === index}" :key="index"
              @mouseenter="showHeight(index)" @mouseleave="hideHeight">
            <div class="list-item list-text">{{item.name}}</div>
            <div class="list-item list-text">{{item.parent_name}}</div>
            <div class="list-item">
              <div class="showDetail" @click="showDetail()">
                <span>查看</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div slot="form-list" class="form-list"
           v-show="type === 'circles' && showContent">
        <div class="list-header">
          <div class="list-item" v-for="(item, index) in titleListSec"
               :key="index">
            {{item}}
          </div>
        </div>
        <ul class="list">
          <li class="list-box" v-for="(item,idx) in merchanList"
              :class="{'list-box-active': heightIndex === idx}" :key="item.id"
              @mouseenter="showHeight(idx)" @mouseleave="hideHeight">
            <div class="list-item list-text">{{item.name}}</div>
            <div class="list-item list-text">{{item.province}}</div>
            <div class="list-item list-text">{{item.city}}</div>
            <div class="list-item list-text">{{item.district}}</div>
            <div class="list-item">
              <div class="showDetail">
                <span @click="showDetail()">查看 </span>
                <span @click.stop="delCri(item.id,idx)">| 删除</span>
              </div>
              <!--<div class="del-box" v-show="idx === delIndex">-->
              <!--<div class="del-text"><img src="./icon-warn@2x.png" class="del-icon">是否删除？</div>-->
              <!--<div class="del-tip">-->
              <!--<div class="del-btn del-cancel hand" @click="delCancel">取消</div>-->
              <!--<div class="del-btn del-sure hand" @click="delSure">确定</div>-->
              <!--</div>-->
              <!--</div>-->
            </div>
          </li>
        </ul>
      </div>
      <div slot="shade-box" class="shade-box" @click="hideCity">
        <div class="gen-detail-box" v-show="genDetail">
          <div class="shade-border shade-tiem">新增{{shadeTitle}}<span
            class="close" @click="hideShadeBox">&times;</span>
          </div>
          <div class="shade-city">
            <span class="city-name">{{shadeTitle}}名称</span>
            <div class="input-box" :class="{'input-height': inputCirent}">
              <input type="text" class="shade-city-select input-height-item"
                     placeholder="请输入" v-model="name"
                     @click="inputCirent = true" @blur="inputCirent = false">
            </div>
          </div>
          <div class="shade-city" v-for="(item, index) in cityList"
               :key="index">
            <span class="city-name">{{item.tip}}</span>
            <div class="input-box" :class="{'input-height': item.show}">
              <div class="shade-city-select shade-after hand input-height-item"
                   @click.stop="checkCity(index)">
                {{item.title}}
                <span
                  :class="item.show && item.data.length > 0 ? 'shade-bottom' : 'shade-top'"></span>
                <transition name="fade">
                  <ul class="shade-city-box"
                      v-show="item.show && item.data.length > 0">
                    <li class="shade-city-tiem"
                        v-for="(items, idx) in item.data"
                        :class="{'shade-city-tiem-active':item.index === idx}"
                        :key="idx" @click.stop="showCityList(idx,index,items)">
                      {{items.name || items}}
                    </li>
                  </ul>
                </transition>
              </div>
            </div>
          </div>
          <div class="ok">
            <span class="submit hand" @click="setData">保存</span>
          </div>
        </div>
        <div class="shade-del-box" v-show="!genDetail">
          <div class="del-header">
            <img :src="require('./Group5@2x.png')" class="shade-del-icon">
            <div class="del-text">确定要删除？</div>
          </div>
          <div class="del-tip">
            <div class="del-btn del-cancel hand" @click="hideShadeBox">取消
            </div>
            <div class="del-btn del-sure hand" @click="delSure">确定</div>
          </div>
        </div>
      </div>
    </form-box>
  </transition>
</template>

<script type="text/ecmascript-6">
  import FormBox from 'components/form-box/form-box'
  import merchanList from 'api/merchant'
  import globals from 'api/globals'
  import {ERR_OK} from 'api/config'
  const titleList = ['商圈名称', '省', '市', '区', '操作']
  const cityInfo = [{
    tip: '省',
    title: '请选择省份',
    type: 'province',
    data: [],
    show: false,
    index: -1
  }, {
    tip: '市',
    title: '请选择城市',
    type: 'city',
    data: [],
    show: false,
    index: -1
  }, {
    tip: '区',
    title: '请选择市区',
    type: 'district',
    data: [],
    show: false,
    index: -1
  }]
  const isIndustrieInfo = [{
    tip: '所属行业',
    title: '请选择行业',
    type: '',
    data: [],
    show: false,
    index: -1
  }]
  const titleListSec = ['行业类型名称', '所属行业', '操作']
  export default {
    data() {
      return {
        genDetail: true,
        delIndex: -1,
        inputCirent: false,
        chioce: false,
        isDate: false,
        tapList: [{title: '商圈信息', type: 'circles'}, {
          title: '行业信息',
          type: 'industry'
        }],
        shadeTitle: '商圈名称',
        tapIndex: 0,
        cityList: [{
          tip: '省',
          title: '请选择省份',
          type: 'province',
          data: [],
          show: false,
          index: -1
        }, {
          tip: '市',
          title: '请选择城市',
          type: 'city',
          data: [],
          show: false,
          index: -1
        }, {
          tip: '区',
          title: '请选择市区',
          type: 'district',
          data: [],
          show: false,
          index: -1
        }],
        titleList: titleListSec,
        titleListSec: titleList,
        merchanList: [],
        industryList: [],
        type: 'circles',
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        page: 1,
        isIndustrie: false,
        isCity: false,
        address: {},
        cityIndex: 0,
        prams: ['', '', ''],
        name: '',
        insId: 0,
        heightIndex: -1,
        showContent: false,
        delId: 0
      }
    },
    created() {
      this.showList()
    },
    methods: {
      delCri(id, index) {
        this.genDetail = false
        this.$refs.order.showShade()
        this.delId = id
        this.delIndex = index
      },
      delSure() {
        let data = {id: this.delId}
        merchanList.delCircle(data).then((res) => {
          if (res.error === ERR_OK) {
            this.hideShadeBox()
            this.showList()
          }
        })
      },
      showHeight(index) {
        this.heightIndex = index
      },
      hideHeight() {
        this.heightIndex = -1
      },
      hideCity() {
        this.cityList.forEach((item, idx) => {
          item.show = false
        })
      },
      checkCity(index) {
        this.inputCirent = false
        for (let i = 0; i < this.cityList.length; i++) {
          this.prams[i] = this.cityList[i].title.replace(/^(请选择.{2})/g, '')
        }
        this.cityList.forEach((item, idx) => {
          if (idx !== index) {
            item.show = false
          }
        })
        if (index > 0 && this.prams[index - 1] === '') {
          return false
        }
        this.cityIndex = index
        this.cityList[index].show = !this.cityList[index].show
        this.showCity()
      },
      showCity() {
        let data = this.infoData(this.prams)
        if (this.type === 'circles') {
          globals.businessCircle(data).then((res) => {
            if (res.error === ERR_OK) {
              if (res.data.filter[this.cityList[this.cityIndex].type]) {
                this.cityList[this.cityIndex].data = res.data.filter[this.cityList[this.cityIndex].type]
              }
            }
          })
          return false
        }
        globals.industrie(data).then((res) => {
          if (res.error === ERR_OK) {
            this.cityList[0].data = res.data
          }
        })
      },
      showCityList(idx, index, title) {
        this.cityList[index].index = idx
        setTimeout(() => {
          this.cityList[index].show = false
          this.cityList[index].title = title.name || title
          if (this.type === 'circles') {
            this.prams[index] = title
            this.prams.forEach((item, idx) => {
              if (idx > index) {
                if (idx === 1) {
                  this.cityList[idx].title = '请选择城市'
                } else if (idx === 2) {
                  this.cityList[idx].title = '请选择市区'
                } else if (idx === 3) {
                  this.cityList[idx].title = '请选择商圈'
                }
              }
            })
          } else {
            this.insId = title.id
          }
          this.page = 1
        }, 100)
      },
      infoData(res) {
        let data = {
          province: res[0],
          city: res[1],
          district: res[2],
          business_circle: res[3]
        }
        return data
      },
      setData() {
        let tip = ''
        this.type === 'circles' ? tip = '行业' : tip = '商圈'
        if (this.name === '') {
          this.$refs.order.showContent(`${tip}名称不能为空`)
          return false
        }
        if (this.type === 'circles') {
          for (let i = 0; i < this.prams.length; i++) {
            if (this.prams[i] === '') {
              this.$refs.order.showContent(`${this.cityList[i].title}`)
              return false
            }
          }
          let data = this.infoData(this.prams)
          data = Object.assign({}, data, {name: this.name})
          merchanList.addCircle(data).then((res) => {
            if (res.error === ERR_OK) {
              this.showList()
              this.hideShadeBox()
            } else {
              this.$refs.order.showContent(res.message)
            }
          })
          return false
        }
        if (this.insId === 0) {
          this.$refs.order.showContent('请选择所属行业')
          return false
        }
        let data = {parent_id: this.insId, name: this.name}
        merchanList.indestryAdd(data).then((res) => {
          if (res.error === ERR_OK) {
            this.showList()
            this.hideShadeBox()
          }
        })
      },
      hideShadeBox() {
        this.$refs.order.hideShade()
      },
      showList() {
        let data = {page: this.page}
        if (this.type === 'circles') {
          merchanList.circlesDetail(data).then((res) => {
            this.showContent = true
            if (res.error === ERR_OK) {
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
          return false
        }
        merchanList.industryDetail(data).then((res) => {
          this.showContent = true
          if (res.error === ERR_OK) {
            this.industryList = res.data
            let pages = res.meta
            this.pageDtail = [{
              total: pages.total,
              per_page: pages.per_page,
              total_page: pages.last_page
            }]
          }
        })
      },
      showDetail() {
        this.genDetail = true
        this.name = ''
        for (let i = 0; i < this.prams.length; i++) {
          this.prams[i] = ''
        }
        this.insId = 0
        this.$refs.order.showShade()
        if (this.type === 'industry') {
          this.shadeTitle = '行业'
          this.cityList = JSON.parse(JSON.stringify(isIndustrieInfo))
          return false
        }
        this.shadeTitle = '商圈'
        this.cityList = JSON.parse(JSON.stringify(cityInfo))
      },
      checkTap(index, value) {
        this.hideShadeBox()
        this.tapIndex = index
        this.type = value
        this.page = 1
        this.$refs.order.beginPage()
        this.showList()
//        console.log()
      },
      addPage(page) {
        this.page = page
        this.showList()
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
    .list-item
      color: $color-text
      flex: 1.7
      .showDetail
        box-sizing: content-box
        display: inline-block
        cursor: pointer
        font-size: $font-size-small
        padding: 2.5% 4%
        color: $color-nomal
        border-radius: 3px
        border: 1px solid $color-nomal
      &:nth-child(1)
        flex: 2.9
      &:last-child
        position: relative
        .del-box
          position: absolute
          left: -14px
          background: $color-white
          z-index: 1500
          width: 184px
          height: 113px
          bottom: 67%
          bg-image('bg-delete')
          background-color: transparent
          background-size: cover
          text-align: center
          .del-text
            display: flex
            align-items: center
            justify-content: center
            margin: 15px 0 24px 0
            .del-icon
              height: 15px
              width: 15px
              margin-right: 5px
          .del-tip
            display: flex
            padding: 0 17px
            justify-content: space-between
            .del-btn
              width: 64px
              height: 30px
              line-height: 30px
              text-align: center
              font-size: $font-size-medium14
              border-radius: 3px
            .del-cancel
              border: 0.5px solid $color-nomal
              color: $color-nomal
            .del-sure
              background: $color-nomal
              color: $color-white
              &:hover
                background: $color-hover
              &:active
                background: $color-nomal
    .list-box-active
      background: $color-background

  .list-industry
    .list-item:nth-child(2)
      flex: 2.9

  .list-header
    .list-item:last-child
      transform: translateX(9%)

  .shade-box
    .shade-border
      border-bottom: 1px solid #DADADA
      font-size: $font-size-medium14
      padding-left: 30px
      height: 5.01vh
      display: flex
      align-items: center
      color: $color-text
      position: relative
      .shade-text
        width: 52%
      .shade-title
        width: 112px
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
          &:hover
            transform: translateY(-50%) rotate(90deg)
            transform-origin: 50%
            transition: transform 0.5s
    .shade-city
      padding-left: 30px
      margin-top: 20px
      .city-name
        display: inline-block
        min-width: 56px
        font-size: $font-size-medium14
        transform: translateY(-50%)
      .input-box
        display: inline-block
        margin-left: 56px
        border: 2px solid $color-white
        width: 164px
        height: 34px
        border-radius: 5px
      .input-height
        .input-height-item
          border: 1px solid $color-text-little
      .shade-city-select
        padding-left: 10px
        font-size: $font-size-medium14
        display: inline-block
        height: 30px
        line-height: 30px
        width: 210px
        border-radius: 3px
        border: 1px solid $color-icon-line
        color: $color-text-icon
        .shade-top
          position: absolute
          right: 3px
          top: 44%
          display: inline-block
          height: 0
          border: 5px solid $color-text
          border-bottom: 5px solid transparent
          border-left: 5px solid transparent
          border-right: 5px solid transparent
          transform-origin: 1px 2px
          transform: rotate(0deg) translateX(-43%)
          transition: all 0.2s
        .shade-bottom
          right: 3px
          position: absolute
          top: 44%
          display: inline-block
          height: 0
          border: 5px solid $color-text
          border-bottom: 5px solid transparent
          border-left: 5px solid transparent
          border-right: 5px solid transparent
          transform-origin: 1px 2px
          transform: rotate(180deg) translateX(-43%)
          transition: all 0.2s
        .shade-city-box
          box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
          position: absolute
          width: 101%
          left: -1px
          top: 32px
          z-index: 1000
          max-height: 90px
          overflow-y: auto
          background: $color-white
          border: 1px solid $color-icon-line
          border-radius: 3px
          &.fade-enter, &.fade-leave-to
            opacity: 0
          &.fade-enter-to, &.fade-leave-to
            transition: all .2s
          .shade-city-tiem
            color: $color-text-little
            padding: 0 10px
            height: 26px
            line-height: 26px
            &:hover
              background: $color-big-background
          .shade-city-tiem-active
            background: $color-big-background
            color: $color-text
      .shade-after
        position: relative
        &::after
          content: ''
          position: absolute
          right: 23px
          width: 1px
          height: 100%
          top: 0
          background: $color-icon-line
        &:hover
          &::after
            background: $color-text-little
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
        &:hover
          background: $color-hover
        &:active
          background: $color-active

  .tap
    display: flex
    margin: 20px 0 10px
    .tap-first
      margin-left: 37.5px
      display: flex
      .tap-item
        cursor: pointer
        margin-right: 30px
        position: relative
        &:hover
          color: $color-nomal
        &:before
          row-center()
          bottom: 0px
          content: ''
          height: 3px
          width: 32px
          background: $color-white
      .tap-item-active
        color: $color-nomal
        &:before
          background: $color-nomal
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
          color: $color-white
          border-radius: 3px
          background: $color-nomal
          &:hover
            background: $color-hover
          &:active
            background: $color-nomal

  .form-industry
    .list-item
      .showDetail
        padding: 3.9% 14%

  .shade-del-box
    .del-header
      display: flex
      align-items: center
      flex-direction: column
      padding: 50.56px 0px
      .del-text
        color: #363547
      .shade-del-icon
        width: 60.6744px
        height: 50.562px
        margin-bottom: 21.0675px
    .del-tip
      margin-bottom: 25.281px
      display: flex
      padding: 0 7.49%
      justify-content: space-between
      .del-btn
        width: 47%
        height: 33.708px
        line-height: 33.708px
        text-align: center
        font-size: $font-size-medium14
        border-radius: 3px
      .del-cancel
        border: 0.5px solid $color-nomal
        color: $color-nomal
      .del-sure
        background: $color-nomal
        color: $color-white
        &:hover
          background: $color-hover
        &:active
          background: $color-nomal
</style>
