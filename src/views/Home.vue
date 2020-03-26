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
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="aside-btn" @click="toggleAside">|||</div>
          <el-menu
            :default-active="this.$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse-transition="false"
            :collapse="isCollapse"
            router
          >
            <!-- 一级菜单 -->
            <el-submenu :index="items.id + ''" v-for="items in menuList" :key="items.id">
              <template slot="title">
                <i :class="['iconfont', iconfont[items.id]]"></i>
                <span>{{ items.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="`/${item.path}`" v-for="item in items.children" :key="item.id" @click="saveRouterPath">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ item.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主题内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Home extends Vue {
  private menuList = []
  private iconfont = {
    101: 'iconshangpin',
    102: 'icontijikongjian',
    103: 'iconbaobiao',
    125: 'iconuser',
    145: 'iconuser1'
  }
  private isCollapse = false
  // 退出登录
  private signOut() {
    sessionStorage.clear()
    this.$router.push('/login')
  }
  private mounted() {
    this.getMenuList()
  }
  // 获取左侧菜单
  private async getMenuList() {
    const { data } = await (this as any).$http.get('/menus')
    if (data.meta.status !== 200) this.$message.error(data.meta.msg)
    this.menuList = data.data
  }
  // 侧边栏折叠
  private toggleAside() {
    this.isCollapse = !this.isCollapse
  }
  // 保持二级菜单的高亮
  private saveRouterPath() {
    console.log(this.$route.path);
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
    .el-menu {
      border: none;
      .iconfont {
        margin-right: 10px;
      }
      // .el-submenu__title {
      //   padding: 0 0 -10px 0;
      // }
    }
    .aside-btn {
      height: 20px;
      background: rgb(170, 119, 194);
      letter-spacing: 5px;
      font-weight: 500;
      line-height: 20px;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>

