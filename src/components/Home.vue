<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img class="logo" src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollaspse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          active-text-color="#1C86F0"
          background-color="#353D49"
          class="el-menu-vertical-demo"
          text-color="#fff"
          unique-opened
          :collapse-transition="false"
          :collapse="isCollaspse"
          :router="true"
          :default-active='activePath'
        >
          <el-sub-menu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template #title>
              <el-icon>
                <component :is="iconObj[item.id]"></component>
              </el-icon>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path"  v-for="subItem in item.children" :key="subItem.id" >
                  <el-icon><Menu/></el-icon>
                  <span>{{subItem.authName}}</span>
              </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { UserFilled, SetUp, ShoppingBag, List, Histogram, Menu } from '@element-plus/icons-vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  components: {
    UserFilled, SetUp, ShoppingBag, List, Histogram, Menu
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menuList: [],
      isCollaspse: false,
      iconObj: {
        125: 'UserFilled',
        103: 'SetUp',
        101: 'shopping-bag',
        102: 'list',
        145: 'Histogram'
      },
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    // 退出
    logout () {
      window.sessionStorage.clear()
      this.$message.success('退出成功！')
      this.$router.push('/login')
    },
    // 获取菜单数据
    async getMenuList () {
      const res = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) this.$message.warning(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList)
    },
    // 折叠
    toggleCollapse () {
      this.isCollaspse = !this.isCollaspse
      console.log(123)
    },
    // 保存高亮
    saveNavState (activePath) {
      this.activePath = window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #363F42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  color: #ffffff;
  div{
    display: flex;
    align-items: center;
    span{
      padding-left: 10px;
      font-size: 25px;
    }
  }
}
.el-aside{
  background-color: #353D49;
  .el-menu{
    border-right:none;
  }
}
.logo{
 width: 50px;
  height: 50px;
}
.el-main{
  background-color: #fff;
}
.toggle-button{
  height: 30px;
  background-color: #353D49;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
