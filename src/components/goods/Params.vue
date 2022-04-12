<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- 警告区域 -->
    <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

    <el-row class="cat_opt">
      <el-col>
        <span>请选择商品分类：</span>
        <el-cascader expand-tirgger="hover"
                     :options="cateList"
                     :props="cateProps"
                     v-model="selectedCateKeys"
                     @change="handleChange"
        ></el-cascader>
      </el-col>
    </el-row>
<!--tab页签-->
      <el-tabs v-model="activeName"
               @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary"
                     size="small"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible=true">
            添加参数
          </el-button>
          <el-table :data="manyTableData" row-key="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"  ref="saveTagInput" v-model="scope.row.inputValue" size="small" @keyup.enter="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="small" type="primary" :icon="Edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="small" type="danger" :icon="Delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary"
                     size="small"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible=true">
            添加参数
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" row-key="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"  ref="saveTagInput"  v-model="scope.row.inputValue"  size="small" @keyup.enter="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="small" type="primary" :icon="Edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="small" type="danger" :icon="Delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

  </el-card>
  <!-- 添加参数的对话框 -->
  <el-dialog :title="'添加' + titleText" v-model="addDialogVisible" width="50%" @close="dialogClose">
    <!-- 添加参数的对话框 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 修改参数的对话框 -->
  <el-dialog :title="'修改' + titleText" v-model="editDialogVisible" width="50%" @close="dialogClose">
    <!-- 添加参数的对话框 -->
    <el-form :model="editForm" :rules="editFormRules" ref="addFormRef" label-width="100px">
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </template>
  </el-dialog>
</template>

<script>
import { ArrowRight, Delete, Edit, Search, Setting } from '@element-plus/icons'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Params',
  setup () {
    return {
      ArrowRight,
      Search,
      Edit,
      Delete,
      Setting
    }
  },
  data () {
    return {
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // handleChange,选择商品分类
    handleChange () {
      this.getParamsData()
    },
    // 切换标签页的按钮被点击
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(this.selectedCateKeys)
      const res = await this.$http.get(`categories/${this.cateId}/attributes`, {
        sel: this.activeName
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      // 分割为字符串，如果为空，赋值为空数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 获取所有的商品分类
    async getCateList () {
      const res = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.cateList = res.data
    },

    // 监听添加对话框的关闭,清除表单中的验证和重置表单
    dialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加动态参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const res = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }

        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    async showEditDialog (attrId) {
      const res = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 提交编辑编辑参数
    async editParams () {
      const res = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
        attr_name: this.editForm.attr_name,
        attr_sel: this.editForm.attr_sel,
        attr_vals: this.editForm.attr_vals
      })
      if (res.meta.status !== 200) return this.$message.error('调教编辑信息失败！')
      this.$message.success('编辑参数成功！')
      this.editDialogVisible = false
      this.getParamsData()
    },
    // 删除参数
    async removeParams (attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户取消了删除的操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const res = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },
    // 文本框失去焦点或者摁下enter
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals (row) {
      // 需要发起请求，保存这次操作
      const res = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    showInput (row) {
      console.log(row)
      row.inputVisible = true

      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }

  },
  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // cateID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
.button-new-tag{
  margin-left: 10px;
}
</style>
