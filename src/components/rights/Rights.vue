<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图> -->
    <el-card>
      <el-table :data="rightsList" stripe highlight-current-row border="">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="info" v-else-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level == 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component
export default class Rights extends Vue {
  private rightsList = []
  private created() {
    this.getRightsList()
  }
  // 获取权限列表
  private async getRightsList() {
    const { data } = await (this as any).$http.get('rights/list')
    this.$message.info(data.meta.msg)
    this.rightsList = data.data
    console.log(data)
  }
}
</script>

