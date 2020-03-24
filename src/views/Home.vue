<template>
  <div class="home">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="header-logo">
          <img src="../assets/images/timg.jpg" alt="CN dota best dota">
          <span>完美世界</span>
        </div>
        <el-button @click="signOut">退出</el-button>
      </el-header>
      <!-- 主题区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
          <!-- 一级菜单 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主题内容 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Home extends Vue {
  // 退出登录
  private signOut() {
    sessionStorage.clear()
    this.$router.push('/login')
  }
  private async mounted() {
    const { data } = await (this as any).$http.get('/menus')
    console.log(data);
    if (data.meta.status === 200) this.$message.success('获取菜单数据成功')
  }
}
</script>

<style lang="less">
.home {
  background-color: #fff;
  height: 100%;
  .el-container.is-vertical {
    height: 100%;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    .header-logo {
      display: flex;
      align-items: center;
      img {
        height: 100%;
      }
    }
  }
  .el-aside {
    background-color: rgb(84, 92, 100);
  }
}
</style>

