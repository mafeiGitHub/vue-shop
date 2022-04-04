<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-table :data="rightList" border stripe style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column prop="authName" label="权限名称"  />
      <el-table-column prop="path" label="路径"  />
      <el-table-column prop="level" label="权限等级" >
        <template v-slot="scope">
          <el-tag v-if="scope.row.level==='0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { ArrowRight } from '@element-plus/icons'

export default {
// eslint-disable-next-line vue/multi-word-component-names
  name: 'Rights',
  setup () {
    return { ArrowRight }
  },
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList () {
      const res = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightList = res.data
    }
  }
}
</script>

<style scoped>

</style>
