<template>
  <div class="login">
    <div class="login-box">
      <!-- 用户头像 -->
      <div class="author-logo">
        <img class="author-image" src="../assets/images/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-s-home" show-password></el-input>
        </el-form-item>
        <el-row>
          <el-button type="primary" @click="login" name="login">登录</el-button>
          <el-button type="success" @click="resetLoginForm" name="reset">重置</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Form } from "element-ui";
@Component
export default class Login extends Vue {
  // @Prop() private msg!: string;
  private loginForm = {
    username: "admin",
    password: "123456"
  };
  private loginFormRules = {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
    ]
  };
  private resetLoginForm() {
    (this.$refs.loginFormRef as Form).resetFields();
  }
  // 登录
  private login() {
    (this.$refs.loginFormRef as Form).validate(async val => {
      if (!val) return;
      const { data } = await (this as any).$http.post("login", this.loginForm);
      if (data.meta.status !== 200)
        return this.$message({ message: "登陆失败", type: "error" });
      this.$message({
        message: "登陆成功",
        type: "success"
      });
      sessionStorage.setItem('token', data.data.token)
      this.$router.push("/home");
    });
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: rgb(90, 202, 150);
  .login-box {
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background: rgb(189, 176, 176);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .author-logo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 10px;
      background-color: rgb(255, 255, 255);
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      .author-image {
        width: 100%;
        border-radius: 50%;
        background-color: rgb(90, 202, 150);
        box-shadow: 0 0 5px;
      }
    }
    .login-form {
      margin-top: 100px;
      padding: 0 20px;
    }
  }
}
</style>

