<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col :span="4"><el-button type="primary" @click="showAddRoleDialog">添加角色</el-button></el-col>
    </el-row>
    <el-table
      :data="roleList"
      style="width: 100%"
      :row-key="roleList.id"
      stripe
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="expand" >
        <template v-slot="scope">
          <el-row :class="['bd-bottom',index1===0?'bd-top':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
            <!--渲染一级权限-->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
              <el-icon><caret-right /></el-icon>
            </el-col>
            <!--渲染二三级权限-->
            <el-col :span="19">
              <el-row :class="[index2===0?'':'bd-top','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success" >{{item2.authName}}</el-tag>
                  <el-icon><caret-right /></el-icon>
                </el-col>
                <el-col :span="18">
                  <el-tag @close="removeRightById(scope.row,item3.id)" type="warning" v-for="item3 in item2.children" :key="item3.id" closable >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>

            </el-col>
          </el-row>
        </template>
      </el-table-column>
<!--      索引列-->
      <el-table-column type="index" />
      <el-table-column prop="roleName" label="角色名称"/>
      <el-table-column prop="roleDesc" label="角色描述"/>
      <el-table-column label="操作" width="280px">
        <template v-slot="scope">
          <el-button @click="showEditRoleDialog(scope.row)"  type="primary" size="small" :icon="Edit" >编辑</el-button>
          <el-button @click="deleteRole(scope.row)" type="danger" size="small" :icon="Delete" >删除</el-button>
          <el-button @click="showSetRightDialog(scope.row)" type="warning" size="small" :icon="Setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog title="添加角色"
             v-model="addRoleDialogVisible"
             width="50%"
             @close="DialogClose"
             draggable>
    <el-form
      ref="ruleFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="120px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addRole">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="编辑角色"
             v-model="editRoleDialogVisible"
             width="50%"
             @close="DialogClose"
             draggable>
    <el-form
      ref="ruleFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="120px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="editRole">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="分配权限"
             v-model="setRightDialogVisible"
             width="50%"
             @close="setRightDialogClose"
             draggable>
    <el-tree
      :data="rightData"
      :props="treeProps"
      :node-key="id"
      :default-checked-keys="defKeys"
      ref="treeRef"
      show-checkbox />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="allotRights">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { ArrowRight, Edit, Delete, Setting, CaretRight } from '@element-plus/icons'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Roles',
  setup () {
    return { ArrowRight, Edit, Delete, Setting }
  },
  components: {
    CaretRight
  },
  data () {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightData: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 添加角色
      addRoleDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: 'Length should be 1 to 10', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 18, message: 'Length should be 1 to 18', trigger: 'blur' }
        ]
      },
      editRoleDialogVisible: false

    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表信息
    async getRoleList () {
      const res = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
    },
    // 根据对应的ID删除权限
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作会永久删除文件，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 展示分配权限的窗口
    async showSetRightDialog (role) {
      this.roleId = role.id
      const res = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限数据失败！')
      this.rightData = res.data
      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 分配权限
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const res = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('更新成功')
      this.setRightDialogVisible = false
    },
    // 通过递归的方式，将角色下所有的三级权限的id保存到defKeys数组中
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // setRightDialogClose
    setRightDialogClose () {
      this.defKeys = []
    },
    // 控制添加角色的弹窗
    showAddRoleDialog () {
      this.addRoleDialogVisible = true
    },
    // 添加角色
    async addRole () {
      const res = await this.$http.post('roles', {
        roleName: this.addForm.roleName,
        roleDesc: this.addForm.roleDesc
      })
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.$message.success('添加角色成功！')
      this.addRoleDialogVisible = false
      this.getRoleList()
    },
    // 关闭的时候清除表单
    DialogClose () {
      this.$refs.ruleFormRef.resetFields()
    },
    //
    showEditRoleDialog (roleInfo) {
      this.addForm = roleInfo
      this.roleId = roleInfo.id
      this.editRoleDialogVisible = true
    },
    // 提交编辑的用户
    async editRole () {
      const res = await this.$http.put('roles/' + this.roleId, {
        roleName: this.addForm.roleName,
        roleDesc: this.addForm.roleDesc
      })
      if (res.meta.status !== 200) return this.$message.error('提交角色信息失败')
      this.$message.success('提交用户信息成功')
      this.editRoleDialogVisible = false
      this.getRoleList()
    },
    // 删除角色
    async deleteRole (roleInfo) {
      const res = await this.$http.delete('roles/' + roleInfo.id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功！')
      this.getRoleList()
    }

  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bd-top{
  border-top:1px solid #eee;
}
.bd-bottom{
  border-top: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
