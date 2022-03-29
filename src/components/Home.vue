<template>
首页
  <el-button type="info" @click="logout">退出</el-button>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  methods: {
    // 退出
    logout () {
      window.sessionStorage.clear()
      this.$message.success('退出成功！')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
