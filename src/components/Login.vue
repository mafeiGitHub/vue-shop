<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" class="login_form" :rules="loginFormRules">
        <!--账号-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号" :prefix-icon="Avatar"/>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock"/>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Avatar, Lock } from '@element-plus/icons-vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入登录账号',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'Length should be 3 to 10',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入账号密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'Length should be 3 to 10',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) { return }
        const res = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        else {
          // 登陆成功
          this.$message.success('登录成功！')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  },
  setup () {
    return {
      Avatar,
      Lock
    }
  }
}
</script>
<!--scoped控制样式生效区间-->
<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 310px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  .btns {
    display: flex;
    justify-content: flex-end;

    /deep/ .el-form-item__content {
      flex: unset;
    }
  }
}

</style>
