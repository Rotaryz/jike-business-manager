<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'App',
  created() {
    console.log(process.env)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
