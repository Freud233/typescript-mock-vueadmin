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
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              content="修改角色"
              placement="top-start"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditEditUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              content="删除角色"
              placement="top-start"
            >
              <el-button type="danger" size="mini" @click="delUser(scope.row.id)" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              content="分配角色"
              placement="top-start"
            >
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="settingRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryUsers.pagenum"
        :page-sizes="[1, 2, 4, 10]"
        :page-size="queryUsers.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加 用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addFormClose">
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleEditUser"
      width="50%"
      @close="editUserFormClose"
    >
      <el-form
        :model="editUserInfo"
        label-width="70px"
        ref="editUserFormRef"
        :rules="addUserFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEditUser = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRoles"
      width="50%"
      @closed="clearRolesData">
      <p>当前用户: {{ selectUsersInfo.username }}</p>
      <p>当前权限: {{ selectUsersInfo.role_name }}</p>
      <p>分配角色
        <el-select v-model="selectRolesId" placeholder="请选择">
          <el-option
            v-for="item in rolesInfo"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoles = false">取 消</el-button>
        <el-button type="primary" @click="setRolesVerity">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'element-ui'
// declare module '@/views/HomeUsers' {

// }
@Component
export default class HomeUsers extends Vue {
  private queryUsers = {
    query: '',
    pagenum: 1,
    pagesize: 2
  }
  private addUserForm = {
    username: '12311',
    password: '123',
    email: '224@qq.com',
    mobile: '13575676767'
  }
  private editUserInfo = {}
  private total = 0
  private usersInfo = {}
  // 需要被分配的用户信息
  private selectUsersInfo = {}
  // 所有用户信息
  private rolesInfo = []
  private setRoles = false
  // 选中的角色 id
  private selectRolesId = ''
  // 校验邮箱正则
  private checkUserEmail = (
    rule: object,
    value: string,
    callback: any
  ): void => {
    if (!value) return callback(new Error('邮箱不能为空'))
    const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
    if (reg.test(value)) {
      return callback()
    }
    callback(new Error('邮箱不合法'))
  }
  // 手机号验证
  private checkUserMobile = (
    rule: object,
    value: string,
    callback: any
  ): void => {
    if (!value) return callback(new Error('手机号不能为空'))
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    if (reg.test(value)) {
      return callback()
    }
    callback(new Error('手机不合法'))
  }
  private addUserFormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { validator: this.checkUserEmail, trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: this.checkUserMobile, trigger: 'blur' }
    ]
  }

  private created() {
    this.getUsersList()
  }
  private dialogVisible = false
  private dialogVisibleEditUser = false
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
  private handleClose(done) {
    console.log(done)
  }
  // 添加用户 对话框 重置数据
  private addFormClose() {
    (this.$refs.addUserFormRef as Form).resetFields()
  }
  // 添加用户 确认
  private addUser() {
    (this.$refs.addUserFormRef as Form).validate(async valid => {
      if (!valid) return
      const { data } = await (this as any).$http.post(
        '/users',
        this.addUserForm
      )
      if (data.meta.status !== 201) return this.$message.error(data.meta.msg)
      this.$message.success(data.meta.msg)
      this.dialogVisible = false
      this.getUsersList()
    })
  }
  // 修改用户按钮
  private async showEditEditUser(id: number) {
    const { data } = await (this as any).$http.get(`users/${id}`)
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.editUserInfo = data.data
    this.dialogVisibleEditUser = true
  }
  // 修改用户 对话框 关闭
  private editUserFormClose() {
    (this.$refs.editUserFormRef as Form).resetFields()
  }
  // 修改用户 确认
  private  editUser() {
    (this.$refs.editUserFormRef as Form).validate(async valid => {
      if (!valid) return this.$message.error('格式错误')
      const {data} = await (this as any).$http.put(
        `users/${this.editUserInfo.id}`,
        { email: this.editUserInfo.email, mobile: this.editUserInfo.mobile }
      )
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.dialogVisibleEditUser = false;
      this.getUsersList()
      this.$message.success(data.meta.msg)
    })
  }
  // 删除用户
  private async delUser(id: number) {
    const delConfirmResult =await this.$confirm('此操作将永久该用户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err => err)
    if (delConfirmResult === 'cancel') return this.$message.info('已经取消')
    const {data} =await (this as any).$http.delete(`users/${id}`)
    console.log(data);
    
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success(data.meta.msg)
    this.getUsersList()
  }
  // 分配角色打开按钮
  private async settingRoles(role: object) {
    this.setRoles = true
    this.selectUsersInfo = role
    const {data} = await (this as any).$http.get(`roles`)
    this.rolesInfo = data.data
    console.log(this.usersInfo, 'usersInfo');
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success(data.meta.msg)
  }
  // 分配角色确定按钮
  private async setRolesVerity() {
    const { data } = await (this as any).$http.put(`users/${this.selectUsersInfo.id}/role`,{rid:this.selectRolesId})
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success(data.meta.msg)
    this.setRoles = false
    this.getUsersList()
  }
  // 分配权限按钮关闭清空角色内容
  private clearRolesData() {
    this.selectRolesId = ''
    this.selectUsersInfo = {}
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
