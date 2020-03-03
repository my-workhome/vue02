<template>
  <div class="login_container">
    <div class="login_handle">
      <img src="../assets/logo.png" alt />
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prop=""
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    // 表单的重置
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单预验证
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          this.$message({
            message: '表单信息有误，请重新填写',
            type: 'warning'
          })
          return false
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return
        this.$message({
          message: res.meta.msg,
          type: 'warning'
        })
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  },
  data: function() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10位字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15位之间', trigger: 'blur' }]
      }
    }
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
  padding: 0 20px;
  img {
    width: 50%;
    border-radius: 50%;
    box-shadow: 0 0 5px 5px red;
    transform: translate(0%, -50%);
  }
}
</style>
