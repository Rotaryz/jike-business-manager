<template>
  <form-box ref="formBox" :pageDtail="pageDtail" @addPage="_addPage">
    <div slot="form-list" class="form-list">
      <div class="tool">
        <router-link to="addEmployees" class="tool-add hand">+ 添加成员</router-link>
        <div class="up hand" @click="_syncUser">同步</div>
        <div class="up hand" @click="_delAll">删除</div>
        <div class="tool-search">
          <input type="text" placeholder="请输入员工姓名" class="search-input" v-model="name">
          <div class="search-box hand" @click="_search">
            <img src="./icon-search@2x.png" class="search-icon">
          </div>
        </div>
      </div>
      <div class="list-header">
        <div class="check-box">
          <span class="check-item hand" :class="{'check-ok': checkAll}" @click="_getAll(checkAll)"></span>
        </div>
        <div class="list-item" v-for="(item, index) in titleList" :key="index">
          {{item}}
        </div>
      </div>
      <ul class="list">
        <li class="list-box" v-for="(item, index) in userList" :key="index">
          <div class="check-box">
            <span class="check-item hand" :class="{'check-ok': item.check}" @click="_checkItem(index)"></span>
          </div>
          <div class="list-item list-text">
            <img class="list-item-img" :src="item.avatar">
          </div>
          <div class="list-item list-text">{{item.name}}</div>
          <div class="list-item list-text">{{item.position}}</div>
          <div class="list-item list-text">{{item.department}}</div>
          <div class="list-item list-text">{{item.mobile}}</div>
          <div class="list-item"><span class="showDetail"><span @click="_upProduct(item.id)">编辑<span class="line">|</span></span><span class="audit" @click="_delItem(item.id)">删除</span></span></div>
        </li>
      </ul>
    </div>
    <div slot="shade-box" class="shade">
      <p class="shade-title">提示<span class="close" @click="_hideShade">&times;</span></p>
      <p class="shade-tip">是否删除选员工</p>
      <div class="shade-btn">
        <div class="share-btn-item hare-btn-white hand" @click="_hideShade">取消</div>
        <div class="share-btn-item hare-btn-orgin hand" @click="_doubelCheck">删除</div>
      </div>
    </div>
  </form-box>
</template>

<script>
  import FormBox from 'components/form-box/form-box'
  import { Employee } from 'api'
  import { ERR_OK } from 'api/config'
  import Toast from 'components/toast/toast'

  const TITLELIST = ['头像', '姓名', '职位', '部门', '手机', '操作']

  export default {
    name: 'organizational-structure',
    data () {
      return {
        pageDtail: [{total: 1, per_page: 10, total_page: 1}],
        titleList: TITLELIST,
        name: '',
        userList: [],
        upList: [],
        page: 1,
        delId: null
      }
    },
    created () {
      this._getList()
    },
    methods: {
      _showShade () {
        this.$refs.formBox.showShade()
      },
      _hideShade () {
        this.delId = null
        this.$refs.formBox.hideShade()
      },
      _delItem (id) {
        this.delId = id
        this.$refs.formBox.showShade()
      },
      _doubelCheck () {
        let string = this.delId ? this.delId : this.upList.join(',')
        Employee.deleteUser({user_ids: string}).then((res) => {
          if (res.error === ERR_OK) {
            this._getList()
            this._hideShade()
          }
          this.$refs.formBox.showContent(res.message)
        })
      },
      _delAll () {
        this.delId = null
        this._showShade()
      },
      _search () {
        this.page = 1
        this.$refs.formBox.beginPage()
        this._getList()
      },
      _upProduct (id) {
        this.$router.push({path: 'addEmployees', query: {id}})
      },
      _getAll (status) {
        this.userList.map((item) => {
          if (!status) {
            this.upList.push(item.id)
          } else {
            this.upList = []
          }
          item.check = !status
        })
      },
      _checkItem (index) {
        let item = this.userList[index]
        item.check = !item.check
        if (item.check) {
          this.upList.push(item.id)
        } else {
          let idIndex = this.upList.findIndex((items) => items === item.id)
          this.upList.splice(idIndex, 1)
        }
        this.userList.splice(index, 1, item)
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
            let json = res.data.map((item) => {
              item.check = false
              return item
            })
            this.userList = json
            console.log(this.userList)
          }
        })
      },
      _syncUser () {
        Employee.syncUser().then((res) => {
          this.$refs.formBox.showContent(res.message)
          if (res.error === ERR_OK) {
            this._getList()
          }
        })
      },
      _addPage (page) {
        this.page = page
        this._getList()
      }
    },
    computed: {
      checkAll () {
        if (!this.userList.length) {
          return false
        }
        let index = this.userList.findIndex((item) => item.check === false)
        let status = index === -1
        return status
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