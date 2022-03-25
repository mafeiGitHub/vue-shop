<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img  src="../assets/logo.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login'
}
</script>
<!--scoped控制样式生效区间-->
<style lang="less" scoped>
.login_container{
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
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
</style>
