<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible=true">添加分类</el-button>
      </el-col>
    </el-row>
    <el-table :data="cateList"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              border
              row-key="cat_id"
              style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column prop="cat_name" label="分类名称"  />
      <el-table-column prop="cat_deleted" label="是否有效"/>
      <el-table-column prop="cat_level" label="当前层级" />
      <el-table-column label="操作" >
        <template v-slot="scope">
          <el-button @click="showEditDialog(scope.row.id)" type="primary" :icon="Edit" ></el-button>
          <el-button @click="deleteGoods(scope.row)" type="danger" :icon="Delete" />
        </template>

      </el-table-column>
    </el-table>
    <el-pagination
      :currentPage="queryInfo.pagenum"
      :page-sizes="[1, 2, 6, 12]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
import { ArrowRight, Delete, Edit, Search } from '@element-plus/icons'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'List',
  setup () {
    return {
      ArrowRight,
      Search,
      Edit,
      Delete
    }
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const res = await this.$http.get('categories', this.queryInfo)
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    // 监听页码值的改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    // 展示编辑用户的对话框
    async showEditDialog (id) {
      // console.log(id)
      const res = await this.$http.get('users/' + id)
      // console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 删除用户
    async deleteGoods (goodsInfo) {
      const confirmResult = await this.$confirm('此操作会永久删除文件，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      // console.log(goodsInfo)
      const res = await this.$http.delete('goods/' + goodsInfo.goods_id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  min-width:1200px ;
}
</style>
