<template>
  <div class="cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="cate">
      <el-button class="cate-btn" type="primary" @click="addCate">添加分类</el-button>
      <!-- 商品分类表格 -->
      <zk-table
        :data="categoriesData"
        :columns="columns"
        :selection-type="false"
        show-index
        index-text="#"
        :expand-type="false"
      >
        <template slot="isDelete" scope="scope">
          <i
            :class="[scope.row.cat_deleted ? 'el-icon-error' : 'el-icon-success']"
            style="color: lightgreen"
          ></i>
        </template>
        <template slot="level" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="settings" scope="scope">
          {{scope.row.cat_name}}
          <el-button type="primary" size="mini" icon="el-icon-search">搜索</el-button>
          <el-button type="warning" size="mini" icon="el-icon-search">设置</el-button>
        </template>
      </zk-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCate.pagenum"
        :page-sizes="[2, 5, 10, 30]"
        :page-size="queryCate.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类 diglog -->
      <el-dialog title="提示" :visible.sync="addCateDialog" width="30%" @close="addCateDialogClose">
        <!-- 添加分类表单 -->
        <el-form ref="addCateForm" :model="addCateForm" :rules="addCateRules" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- optins 指定数据源,  props 指定配置对象 -->
            <el-cascader
              v-model="parentCateIdArr"
              :options="praentCateData"
              :props="parentsOptions"
              clearable
              stripe
              show-all-levels
              change-on-select
              :show-row-hover="false"
              @change="parentCateChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialog = false">取 消</el-button>
          <el-button type="primary" @click="addCateVerity">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Form } from 'element-ui'
@Component
export default class Cate extends Vue {
  // 所有分类商品数据
  private categoriesData = []
  // 父级分类商品数据
  private praentCateData = []
  private queryCate = {
    type: [3],
    pagenum: 1,
    pagesize: 10
  }
  private total = 0
  private columns = [
    {
      label: '分类',
      prop: 'cat_name'
    },
    {
      label: '是否有效',
      type: 'template',
      template: 'isDelete'
    },
    {
      label: '排序',
      type: 'template',
      template: 'level'
    },
    {
      label: '操作',
      type: 'template',
      template: 'settings'
    }
  ]
  private created() {
    this.getCategoriesList()
  }
  private addCateDialog = false
  // 要添加的分类数据
  private addCateForm = {
    cat_name: 'asd',
    cat_pid: 0,
    cat_level: 0
  }
  private addCateRules = {
    cat_name: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ]
  }
  private parentsOptions = {
    value: 'cat_id',
    label: 'cat_name',
    children: 'children'
  }

  // 级联选择器选中的父类 id 数组
  private parentCateIdArr = []
  // 获取分类商品
  private async getCategoriesList() {
    const { data } = await (this as any).$http.get('categories', {
      params: this.queryCate
    })
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success(data.meta.msg)
    this.categoriesData = data.data.result
    this.total = data.data.total
  }
  private handleSizeChange(newPagSize: number) {
    this.queryCate.pagesize = newPagSize
    this.getCategoriesList()
  }
  private handleCurrentChange(newPageNum: number) {
    this.queryCate.pagenum = newPageNum
    this.getCategoriesList()
  }
  // 获取父级分类
  private async getParentsList() {
    const { data } = await (this as any).$http.get('categories', {
      params: { type: 2 }
    })
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success(data.meta.msg)
    this.praentCateData = data.data
  }
  // 添加分类dialog打开
  private addCate() {
    this.getParentsList()
    this.addCateDialog = true
  }
  // 监听添加分类选中属性改变
  private parentCateChange() {
    this.addCateForm.cat_pid =
      this.parentCateIdArr[this.parentCateIdArr.length - 1] || 0
    this.addCateForm.cat_level = this.parentCateIdArr.length
  }
  // 清空添加分类对话框的属性
  private addCateDialogClose() {
    (this.$refs.addCateForm as Form).resetFields()
    this.parentCateIdArr = []
    this.addCateForm.cat_pid = 0
    this.addCateForm.cat_level = 0
  }
  // 确认添加分类
  private addCateVerity() {
    (this.$refs.addCateForm as Form).validate(async valid => {
      if (!valid) return
      console.log(this.addCateForm, 'addCateForm')
      const { data } = await (this as any).$http.post(
        'categories',
        this.addCateForm
      )
      if (data.meta.status !== 201) return this.$message.error(data.meta.msg)
      this.$message.success(data.meta.msg)
      this.getCategoriesList()
      this.addCateDialog = false
    })
  }
}
</script>

<style lang="less" scoped>
.cate-btn {
  float: left;
  margin: 0 0 10px 0;
}

.el-pagination {
  float: left;
  margin: 20px 0;
}

.el-cascader {
  width: 100%;
}
</style>


