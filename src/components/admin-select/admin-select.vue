<template>
  <div class="admin-select">
    <div class="select-item" v-for="(item,index) in select" :key="index"
         @click.stop="selectType(item.type, index)">
      <span class="select-title">{{item.title}}</span>
      <div class="admin-big-box" :class="{'input-height':item.select}"
           v-for="(items,idx) in item.children" :key="idx">
        <div class="admin-select-box input-height-item"
             :class="{'admin-select-box-active': item.show}">{{items.content}}
          <div class="city-tap">
            <span class="city-tap-top"
                  :class="{'city-tap-bottom':item.show && item.select,'city-tap-top-two': item.show && !item.select}"></span>
          </div>
          <ul class="select-child" v-show="item.select"
              @mouseleave="leaveHide(index)" @mouseenter="endShow">
            <li class="select-child-item" v-for="(child, chidx) in items.data"
                :key="chidx" @click.stop="setValue(child,index,idx)">
              {{child.title}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      select: {
        type: Array,
        default: () => [{
          title: '开通方式',
          select: false,
          show: false,
          children: [{content: '全部', data: []}]
        }]
      }
    },
    created() {
      window.onclick = () => {
        this.select.forEach((item) => {
          item.select = false
        })
      }
    },
    data() {
      return {
        setTime: ''
      }
    },
    methods: {
      clickHide(index) {
        this.select[index].select = false
      },
      endShow() {
        clearTimeout(this.setTime)
      },
      leaveHide(index) {
        this.setTime = setTimeout(() => {
          this.clickHide(index)
        }, 1500)
      },
      selectType(type, index) {
        this.select[index].select = !this.select[index].select
        this.select.forEach((item, idx) => {
          if (idx !== index) {
            item.select = false
          }
        })
        this.select[index].show = true
        this.$emit('selectType', type, this.select)
      },
      setValue(value, index, idx) {
        this.select[index].select = false
        this.select[index].children[idx].content = value.title
        this.$emit('setValue', value, idx)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .admin-select
    display: flex
  .select-item
    display: flex
    margin-left: 2.6vw
    position: relative
    z-index: 50
    &:first-child
      margin-left: 0px

  .select-title
    font-size: $font-size-medium
    line-height: 17px
    no-wrap()

  .admin-big-box
    cursor: pointer
    height: 30px
    margin-left: 10px
    border: 2px solid $color-white
    border-radius: 4px
    font-size: $font-size-medium
    color: $color-text-little
    transform: translateY(-25%)
    position: relative
    .admin-select-box
      border: 1px solid $color-line
      border-radius: 2px
      padding: 0 39px 0 10px
      line-height: 25px
      height: 100%
      white-space: nowrap
      position: relative
      &:hover
        color: $color-text
        .city-tap
          border-left: 1px solid $color-text-little
      .city-tap
        position: absolute
        right: 0
        top: 0
        height: 100%
        width: 24px
        border-left: 1px solid $color-line
        .city-tap-top
          height: 0
          border: 6px solid $color-text-little
          border-bottom: 6px solid transparent
          border-left: 6px solid transparent
          border-right: 6px solid transparent
          row-center()
          top: 42%
          transform: rotate(0deg) translateX(-43%)
          transform-origin: 1px 3px
        .city-tap-top-two
          height: 0
          border: 6px solid $color-text
          border-bottom: 6px solid transparent
          border-left: 6px solid transparent
          border-right: 6px solid transparent
          row-center()
          top: 42%
          transform-origin: 1px 3px
          transform: rotate(0deg) translateX(-43%)
          transition: all 0.2s
        .city-tap-bottom
          border: 6px solid  $color-text
          border-bottom: 6px solid transparent
          border-left: 6px solid transparent
          border-right: 6px solid transparent
          row-center()
          top: 42%
          transform-origin: 1px 3px
          transform: rotate(180deg) translateX(-43%)
          transition: all 0.2s
      .select-child
        left: 0
        background: $color-white
        z-index: 100
        position: absolute
        width: 100%
        border-radius: 3px
        box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
        background: $color-white
        margin-top: 4px
        max-height: 228px
        overflow-y: auto
        &.fade-enter, &.fade-leave-to
          opacity: 0
        &.fade-enter-to, &.fade-leave-to
          transition: opacity .2s ease-in-out
        .select-child-item
          white-space: nowrap
          color: $color-text
          padding: 0 10px
          text-align: left
          height: 26px
          line-height: 26px
          font-size: $font-size-medium
          &:hover
            background: $color-big-background
    .admin-select-box-active
      color: $color-text
</style>
