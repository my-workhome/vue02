<template>
  <div class="login_container">
    <div class="login_handle">
      <img src="../assets/logo.png" alt />
      <el-input v-model="username" prefix-icon="el-icon-user-solid" placeholder="请输入用户名"></el-input>
      <el-input
        v-model="password"
        prefix-icon="el-icon-user-solid"
        type="password"
        placeholder="请输入密码"
      ></el-input>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    login() {
      this.$router.push('login')
    }
  },
  data: function() {
    return { username: 'zhangsan', password: 123456 }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: blue;
  height: 100%;
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login_handle {
  height: 50%;
  width: 30%;
  background-color: white;
  text-align: center;
  img {
    width: 50%;
    border-radius: 50%;
    box-shadow: 0 0 5px 5px red;
    transform: translate(0%, -50%);
  }
}
</style>
