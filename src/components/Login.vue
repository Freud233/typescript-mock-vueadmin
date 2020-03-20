<template>
  <div class="login">
    <div class="login-box">
      <div class="author-logo">
        <img class="author-image" src="../assets/images/logo.png" alt="">
      </div>
      <el-form ref="form" class="login-form">
        <el-form-item>
          <el-input v-model="msg"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="msg"></el-input>
        </el-form-item>
        <el-row>
          <el-button type="primary">登录</el-button>
          <el-button type="success">注册</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class Login extends Vue {
  // @Prop() private msg!: string;
  private msg = "你好";
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

