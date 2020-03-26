<template>
  <!-- 面包屑导航 -->
  <div class="home-users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加用户区域 -->
      <el-row class="search-user">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            @clear="getUsersList()"
            clearable
            class="input-with-select"
            v-model="queryUsers.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="add-users" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-table :data="usersInfo.users" style="width: 100%" border="" stripe highlight-current-row>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="userChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="操作" width="180px">
          <template slot-scope="scope">
            {{scope.row}}
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              content="修改角色"
              placement="top-start"
            >
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              content="删除角色"
              placement="top-start"
            >
              <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              content="分配角色"
              placement="top-start"
            >
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryUsers.pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="queryUsers.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- dialog 对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form
        :model="dialogUserInfo"
  
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="dialogUserInfo.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class HomeUsers extends Vue {
  private queryUsers = {
    query: '',
    pagenum: 1,
    pagesize: 2
  }
  private dialogUserInfo = {
    name: ''
  }
  private total = 0
  private usersInfo = {}
  private created() {
    this.getUsersList()
  }
  private dialogVisible = false
  // 获取用户数据
  private async getUsersList() {
    const { data } = await (this as any).$http.get('/users', {
      params: this.queryUsers
    })
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success('获取用户数据成功')
    this.usersInfo = data.data
    this.total = data.data.total
    console.log(this.usersInfo)
  }
  // pageSize 改变
  private handleSizeChange(newPage: number) {
    this.queryUsers.pagesize = newPage
    this.getUsersList()
  }
  // 当前页改变
  private handleCurrentChange(newPage: number) {
    this.queryUsers.pagenum = newPage
    this.getUsersList()
  }
  // 用户状态改变
  private async userChange(userInfo: any) {
    const { data } = await (this as any).$http.put(
      `users/${userInfo.id}/state/${userInfo.mg_state}`
    )
    if (data.meta.status !== 200) {
      userInfo.mg_state = !userInfo.mg_state
      return this.$message.error(data.meta.msg)
    }
    this.$message.success(data.meta.msg)
    console.log(data)
  }
  // diglog 对话框确认关闭前
  private handleClose (done) {
    console.log(done);
    
  }
}
</script>
}

<style lang="less" scoped>
.home-users /deep/.box-card {
  box-shadow: 0 1px 1px rgba(235, 10, 10, 0.15);
  .el-table {
    margin: 20px 0;
  }
}
</style>
