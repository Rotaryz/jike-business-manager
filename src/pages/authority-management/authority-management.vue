<template>
  <form-box :pageDtail="pageDtail" ref="formBox" @addPage="_addPage">
    <div slot="form-list" class="form-list">
      <div class="tool">
        <div class="tool-search">
          <input type="text" placeholder="请输入员工姓名" class="search-input" v-model="name">
          <div class="search-box hand" @click="_search">
            <img src="./icon-search@2x.png" class="search-icon">
          </div>
        </div>
      </div>
      <div class="list-header">
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <ul class="list">
        <li class="list-box" v-for="(item, index) in userList" :key="index">
          <div class="list-item list-text">
            <img class="list-item-img" :src="item.avatar">
          </div>
          <div class="list-item list-text">{{item.name}}</div>
          <div class="list-item list-text">{{item.position}}</div>
          <div class="list-item list-text">{{item.department}}</div>
          <div class="list-item list-text">{{item.mobile}}</div>
          <div class="list-item">
            <div class="tip">
              <div :class="{move_fa:item.ai_radar_status}" @click="_aiRadarChange(item)">
                <span class="circular" :class="{move: item.ai_radar_status}"></span>
                <span class="status" :class="item.ai_radar_status ? 'status-left' : 'status-right'">{{item.ai_radar_status ? '开' : '关'}}</span>
              </div>
            </div>
          </div>
          <div class="list-item">
            <div class="tip">
              <div :class="{move_fa:item.boss_radar_status}" @click="_bossRadarChange(item)">
                <span class="circular" :class="{move: item.boss_radar_status}"></span>
                <span class="status" :class="item.boss_radar_status ? 'status-left' : 'status-right'">{{item.boss_radar_status ? '开' : '关'}}</span>
              </div>
            </div>
          </div>
          <div class="list-item underline hand">员工二维码</div>
        </li>
      </ul>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  import { ERR_OK } from 'api/config'
  import { Employee } from 'api'

  const TITLELIST = ['头像', '姓名', '职位', '部门', '手机', 'AI雷达和名片', 'Boss雷达', '操作']

  export default {
    name: 'organizational-structure',
    data () {
      return {
        isShowTip: false,
        titleList: TITLELIST,
        page: 1,
        name: '',
        userList: [],
        pageDtail: [{total: 1, per_page: 10, total_page: 1}]
      }
    },
    created () {
      this._getList()
    },
    methods: {
      _search () {
        this.page = 1
        this.$refs.formBox.beginPage()
        this._getList()
      },
      _aiRadarChange (item) {
        let status = item.ai_radar_status ? 0 : 1
        let data = {is_open: status, user_id: item.id}
        Employee.aiRadarChange(data).then((res) => {
          if (res.error === ERR_OK) {
            this._getList()
            this.$refs.formBox.showContent(status ? '成功开启' : '成功关闭')
            return
          }
          this.$refs.formBox.showContent(res.message)
        })
      },
      _bossRadarChange (item) {
        let status = item.boss_radar_status ? 0 : 1
        let data = {is_open: status, user_id: item.id}
        Employee.bossRadarChange(data).then((res) => {
          if (res.error === ERR_OK) {
            this._getList()
            this.$refs.formBox.showContent(status ? '成功开启' : '成功关闭')
            return
          }
          this.$refs.formBox.showContent(res.message)
        })
      },
      _getList () {
        let data = {name: this.name, page: this.page, limit: 10}
        Employee.userList(data).then((res) => {
          if (res.error === ERR_OK) {
            let pages = res.meta
            this.pageDtail = [{
              total: pages.total,
              per_page: pages.per_page,
              total_page: pages.last_page
            }]
            console.log(this.pageDtail)
            this.userList = res.data
            console.log(this.userList)
          }
        })
      },
      _addPage (page) {
        this.page = page
        this._getList()
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
      width: 40px
      height: 40px
      border: none
      display: block
    .check-box
      width: 85px
      .check-item
        margin-left: 30px
        display: inline-block
        width: 14px
        height: 14px
        border: 1px solid #D9D9D9
    .list-item
      color: $color-text
      flex: 1
      position: relative
      .down-icon
        width: 13px
        margin-left: 4px
      .status-box
        box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
        border-radius: 3px
        position: absolute
        z-index: 1000
        bottom: -105px
        padding: 10px 0
        background: $color-white
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
      &:nth-child(1)
        flex: 0.7
    .list-box-active
      background: $color-background

  .line
    font-family: PingFangSC-Light
    font-size: 12px
    color: $color-lineCC
    letter-spacing: 0
    line-height: 14px
    margin: 0 12.5px

  .underline
    text-decoration: underline

  .tip
    font-size: $font-size-small
    padding: $padding-all
    color: $color-text-d
    position: relative
    border-top: 1px solid $color-row-line
    margin-top: 6px
    margin-bottom: 10px
    .move_fa
      background: $color-orgin-theme
    div
      position: absolute
      height: 22px
      width: 44px
      right: $padding-all
      top: 50%
      transform: translateY(-50%)
      background: $color-lineCC
      border-radius: @height
      transition: background 1s
      .circular
        display: inline-block
        height: 18px
        width: 18px
        margin: 2px 2px
        border-radius: 50%
        background: $color-white
        transition: transform .5s
      .move
        transform: translateX(22px)
      .status
        font-size: $font-size-small12
        col-center()
        font-family: $fontFamilyRegular
        color: $color-white
      .status-right
        right: 7px
      .status-left
        left: 7px
</style>