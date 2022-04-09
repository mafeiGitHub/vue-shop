<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getOrderList"
        >
          <template v-slot:append>
            <el-button  :icon="Search" circle @click="getOrderList"/>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="orderList" border stripe style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column prop="order_number" label="订单编号"  />
      <el-table-column prop="order_price" label="订单价格"  />
      <el-table-column label="是否付款" >
        <template v-slot="scope">
          <el-button type="success" v-if="scope.row.pay_status === '1'">已付款</el-button>
          <el-button type="danger" v-else>未付款</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" />
      <el-table-column prop="create_time" label="下单时间" >
        <template v-slot="scope">
          {{dateFormat(scope.row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template v-slot="scope">
          <el-button @click="showEditDialog(scope.row.id)" type="primary" size="small" :icon="Edit" ></el-button>
          <el-button @click="deleteUser(scope.row)" type="success" size="small" :icon="Location" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :currentPage="queryInfo.pagenum"
      :page-sizes="[1,2, 5, 10,15,20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>

</template>

<script>
import { ArrowRight, Edit, Search, Location } from '@element-plus/icons'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Order',
  setup () {
    return {
      ArrowRight,
      Search,
      Edit,
      Location

    }
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0

    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList () {
      const res = await this.$http.get('orders', this.queryInfo)
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      // console.log(res)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    // 监听页码值的改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
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
    }
  },
  // 计算属性
  computed: {

  }
}
</script>

<style lang="less" scoped>
.el-card{
  min-width:1200px ;
}
</style>
