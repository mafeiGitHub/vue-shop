<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
        class="w-50 m-2"
        placeholder="请输入内容"
        v-model="queryInfo.query"
        clearable
        @clear="getUserList"
        >
          <template v-slot:append>
            <el-button  :icon="Search" circle @click="getUserList"/>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4"><el-button type="primary" @click="addDialogVisible=true">添加用户</el-button></el-col>
    </el-row>
    <el-table :data="userList" border stripe style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column prop="username" label="姓名"  />
      <el-table-column prop="email" label="邮件"  />
      <el-table-column prop="mobile" label="电话" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column  label="状态" >
        <template v-slot="scope">
          <el-switch @change="userDataChanged(scope.row)" v-model="scope.row.mg_state" ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template v-slot="scope">
          <el-button @click="showEditDialog(scope.row.id)" type="primary" size="small" :icon="Edit" ></el-button>
          <el-button @click="deleteUser(scope.row)" type="danger" size="small" :icon="Delete" />
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="true"
          >
            <el-button @click="showSetRoleDialog(scope.row)" type="warning" size="small" :icon="Setting"/>
          </el-tooltip>
        </template>

      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <el-dialog title="添加用户"
             v-model="addDialogVisible"
             width="50%"
             @close="addDialogClose"
             draggable>
    <el-form
      ref="ruleFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addUser">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="编辑用户"
             v-model="editDialogVisible"
             width="50%"
             @close="editDialogClose"
             draggable>
    <el-form
      ref="ruleFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" disabled />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="editUser()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="分配用户角色"
             v-model="setRoleDialogVisible"
             width="50%"
             @close="setRoleDialogClosed"
             draggable>
<div>
  <p>当前的用户：{{userInfo.username}}</p>
  <p>当前的角色：{{userInfo.role_name}}</p>
  <p>分配新角色：<el-select v-model="selectedRoleId"   placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id"
    />
  </el-select></p>
</div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="setRole">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ArrowRight, Delete, Edit, Search, Setting } from '@element-plus/icons'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Users',
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
    // 验证邮箱的正则表达式
    const checkEmail = (rule, value, cb) => {
    //  验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的正则表达式
    const checkMobile = (rule, value, cb) => {
      //  验证手机号的正则表达式
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: 'Length should be 6 to 18', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        username: [
          { message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色
      setRoleDialogVisible: false,
      setRoleDialogClose: false,
      userInfo: {},
      roleList: [],
      selectedRoleId: '',
      selectedRoleRef: ''

    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const res = await this.$http.get('users', this.queryInfo)
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听页码值的改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 更改用户状态
    async userDataChanged (userInfo) {
      const res = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 添加用户
    addUser () {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return
        // 发起网络请求
        const res = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.addDialogVisible = true
          return this.$message.error(res.meta.msg)
        } else {
          this.addDialogVisible = false
          return this.$message.success(res.meta.msg)
        }
      })
      this.getUserList()
    },
    // 监听添加对话框的关闭,清除表单中的验证和重置表单
    addDialogClose () {
      this.$refs.ruleFormRef.resetFields()
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      // console.log(id)
      const res = await this.$http.get('users/' + id)
      // console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听编辑对话框的关闭
    editDialogClose () {
      this.$refs.ruleFormRef.resetFields()
    },
    // 编辑用户
    editUser () {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return
        const res = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    // 删除用户
    async deleteUser (userInfo) {
      const res = await this.$http.delete('users/' + userInfo.id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 展示分配角色的对话框
    async showSetRoleDialog (userInfo) {
      this.userInfo = userInfo
      this.setRoleDialogVisible = true
      const res = await this.$http.get('roles')
      this.roleList = res.data
      // console.log(this.roleList)
    },
    // setRole分配角色
    async setRole () {
      const res = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.$message.success('分配新角色成功')
      this.setRoleDialogVisible = false
      this.getUserList()
    },
    // 监听分配角色窗口关闭
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }

  }
}
</script>

<style lang="less" scoped>
.el-card{
  min-width:1200px ;
}
</style>
