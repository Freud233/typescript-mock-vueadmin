<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 权限列表表格 -->
      <el-table :data="rolesList" stripe highlight-current-row border="">
        <!-- 列表展开项 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              type="flex"
              align="middle"
              :class="['tag-bottom', index1 === 0 ? 'tag-top' : '']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="6">
                <el-row>
                  <el-tag
                    closable
                    @close="removeRolesRights(scope.row, item1.id)"
                  >{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-row>
              </el-col>
              <el-col :span="18">
                <!-- 二级权限 -->
                <el-row
                  type="flex"
                  align="middle"
                  :class="[index2 === 0 ? '' : 'tag-top']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      @close="removeRolesRights(scope.row, item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <!-- 三级权限 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      type="danger"
                      @close="removeRolesRights(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名字"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="roleDesc" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="success" size="mini" icon="el-icon-edit"></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-setting"
              @click="setRolesRights(scope.row)"
            >{{scope.row.id}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的dialog -->
    <el-dialog title="提示" @close="emptyDefKeys" :visible.sync="setRolesRightsDialog" width="50%">
      <!-- 树形控件 -->
      <el-tree
        :default-checked-keys="defKeys"
        default-expand-all
        node-key="id"
        :props="rolesTreeProps"
        :data="rolesTree"
        ref="rolesRightsRef"
        show-checkbox
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRolesRightsVerify()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Tree } from 'element-ui'
@Component
export default class Roles extends Vue {
  private rolesList = []
  private rolesTree = []
  private setRolesRightsDialog = false
  // 树形控件默认选中的 id
  private defKeys = []
  private roleId: number;
  // 树形控件的属性绑定
  private rolesTreeProps = {
    children: 'children',
    label: 'authName'
  }
  private created() {
    this.getRolesList()
  }
  // 获取角色列表数据
  private async getRolesList() {
    const { data } = await (this as any).$http.get('/roles')
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success(data.meta.msg)
    this.rolesList = data.data
  }
  // 删除角色权限
  private async removeRolesRights(role: any, rightId: number) {
    const removeRolesRightsResult = await this.$confirm(
      '此操作将永久删除该文件, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(err => err)
    if (removeRolesRightsResult === 'confirm') {
      const { data } = await (this as any).$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success(data.meta.msg)
      role.children = data.data
      // 不重新获取权限数据防止删除权限后页面刷新
      // this.getRolesList()
    }
  }
  // 分配权限打开
  private async setRolesRights(role: any) {
    this.roleId = role.id
    const { data } = await (this as any).$http.get('rights/tree')
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success(data.meta.msg)
    this.rolesTree = data.data
    this.setRolesRightsDialog = true
    this.setRolesRightsDialogDefCheck(role, this.defKeys)
  }
  // 获取默认选中的权限 id
  private setRolesRightsDialogDefCheck(arr: any, defKeys: any) {
    if (!arr.children) {
      // this.defKeys = []
      return defKeys.push(arr.id)
    }
    arr.children.forEach(item => {
      this.setRolesRightsDialogDefCheck(item, defKeys)
    })
  }
  // 清空默认选中id
  private emptyDefKeys() {
    this.defKeys = []
  }
  // 确定分配权限按钮
  private async setRolesRightsVerify() {
    const rids = [
      ...(this.$refs.rolesRightsRef as Tree).getHalfCheckedKeys(),
      ...(this.$refs.rolesRightsRef as Tree).getCheckedKeys()
    ].join(',')
    const { data } = await (this as any).$http.post(`roles/${this.roleId}/rights`, {rids})
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success(data.meta.msg)
    this.setRolesRightsDialog = false
    this.getRolesList()
  }
  
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.tag-top {
  border-top: 1px solid #ddd;
}

.tag-bottom {
  border-bottom: 1px solid #ddd;
}
</style>
