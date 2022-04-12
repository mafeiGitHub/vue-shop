<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          class="w-50 m-2"
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getGoodsList"
        >
          <template v-slot:append>
            <el-button  :icon="Search" circle @click="getGoodsList"/>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4"><el-button type="primary" @click="jumpAdd">添加商品</el-button></el-col>
    </el-row>
    <el-table :data="goodsList" border stripe style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column prop="goods_name" label="商品名称"  />
      <el-table-column prop="goods_price" label="商品价格（元）"/>
      <el-table-column prop="add_time" label="创建时间" >
        <template v-slot="scope">
          {{dateFormat(scope.row.add_time)}}
        </template>
      </el-table-column>
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
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const res = await this.$http.get('goods', this.queryInfo)
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 监听页码值的改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
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
    },
    // 格式化时间方法
    dateFormat (originVal) {
      const dt = new Date(originVal)

      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')

      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },
    jumpAdd () {
      this.$router.push('/add')
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  min-width:1200px ;
}
</style>
