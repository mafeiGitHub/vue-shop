<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>添加管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片视图-->
  <el-card>
<!--    提示区域-->
    <el-alert title="info alert" type="info" center show-icon  :closable="false"/>
<!--    步骤条-->
    <el-steps align-center :active="activeIndex">
      <el-step title="基本信息" />
      <el-step title="商品参数" />
      <el-step title="商品属性" />
      <el-step title="商品图片" />
      <el-step title="商品内容" />
      <el-step title="完成" />
    </el-steps>
<!--    tab栏-->
    <el-form
      ref="ruleFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
      label-position="top"
    >
    <el-tabs v-model="activeIndex" @tab-click="tabClicked" :before-leave="beforeTabLeave" tab-position="left" >
      <el-tab-pane label="基本信息" :name="0">
       <el-form-item label="商品名称" prop="goods_name">
         <el-input v-model="addForm.goods_name" ></el-input>
       </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="addForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader expand-trigger="hover"
                       :options="cateList"
                       :props="cateProps"
                       v-model="addForm.goods_cat"
                       @change="handleChange" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" :name="1">
        <!-- 渲染表单的Item项 -->
        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
          <!-- 复选框组 -->
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" :name="2">
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片" :name="3">
        <el-upload
          class="upload-demo"
          :action="uploadURL"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
          :on-success="handleSuccess"
        >
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" :name="4">
        <!-- 富文本编辑器组件 -->
        <textarea v-model="addForm.goods_introduce" cols="30" rows="10"></textarea>
<!--        <quill-editor ></quill-editor>-->
        <!-- 添加商品的按钮 -->
        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
    </el-form>
  </el-card>
<!--图片预览-->
<!--  <el-dialog title="图片预览" v-model:visible="previewVisible" width="50%">-->
<!--    <img :src="previewPath" alt="" class="previewImg">-->
<!--  </el-dialog>-->
</template>

<script>
import { ArrowRight } from '@element-plus/icons'
import _ from 'lodash'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Add',
  setup () {
    return { ArrowRight }
  },

  data () {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []

      },
      cateList: [],
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品类别', trigger: 'blur' }
        ]
      },
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数数据列表
      manyTableData: [],
      onlyTableData: [],
      // 上传图片的url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片的header请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  methods: {
    async getCateList () {
      const res = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类信息失败')
      this.cateList = res.data
      // console.log(this.cateList)
    },
    handleChange () {
      // console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, OldActiveName) {
      if (OldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked () {
      // console.log(this.activeIndex)
      if (this.activeIndex === 1) {
        const res = await this.$http.get(`categories/${this.cateId}/attributes`,
          {
            sel: 'many'
          })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
        // console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === 2) {
        const res = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            sel: 'only'
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败！')
        }
        // console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    //  处理图片预览效果
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.responseText.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      console.log(response)
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const res = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }

  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
el-steps{
  margin: 15px 0;
  font-size: 13px;
}

</style>
