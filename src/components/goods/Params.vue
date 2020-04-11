<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-cascader
        :options="cateList"
        :props="cateListProps"
        v-model="selectCateKeys"
        @change="cateHandleChange"
      ></el-cascader>
      <!-- tabs 标签页 -->
      <el-tabs v-model="activeName" @tab-click="cateHandleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="success" :disabled="cateIsSelect" @click="addParamsHandle">添加参数</el-button>
          <el-table :data="goodsParamsData.many" style="width: 100%" border="" stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                {{ scope.row }}
                <el-button type="primary" icon="el-icon-delete" size="mini">删除</el-button>
                <el-button type="warning" icon="el-icon-set-+ing" size="mini">搜索</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="success" :disabled="cateIsSelect" @click="addParamsHandle">添加属性</el-button>
          <el-table :data="goodsParamsData.only" style="width: 100%" border="" stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                {{ scope.row }}
                <el-button type="primary" icon="el-icon-delete" size="mini">删除</el-button>
                <el-button type="warning" icon="el-icon-setting" size="mini">搜索</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加商品参数对话框 -->
      <el-dialog :title="addGoodsParamsTitle" :visible.sync="addParamsdialogVisible" width="50%">
        <el-form ref="addGoodsParamsForm" :model="addGoodsParamsForm" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="addGoodsParamsForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamsdialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Params extends Vue {
  // 商品分类数据
  private cateList = []
  // 商品的属性
  private goodsParamsData = {
    only: [],
    many: []
  }
  private cateListProps = {
    value: 'cat_id',
    label: 'cat_name',
    children: 'children',
    expandTrigger: 'hover'
  }
  // 添加参数对话框显示隐藏
  private addParamsdialogVisible = false
  private activeName = 'many'
  // 级联选择框选中的商品
  private selectCateKeys = []
  private created() {
    this.getGoods()
  }
  // 要添加的属性
  private addGoodsParamsForm = {
    name: ''
  }
  // 获取商品分类分类
  private async getGoods() {
    const { data } = await (this as any).$http.get('categories')
    if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
    this.$message.success(data.meta.msg)
    this.cateList = data.data
  }
  // 获取商品分类属性
  private async getGoodsParams() {
    if (this.selectCateKeys.length !== 3) {
      this.selectCateKeys = []
      this.goodsParamsData.only = this.goodsParamsData.many = []
      return 
    }
    const { data } = await (this as any).$http.get(
      `categories/${this.cateSelectId}/attributes`,
      {
        params: {
          sel: this.activeName
        }
      }
    )
    this.goodsParamsData[this.activeName] = data.data
    this.goodsParamsData[this.activeName].forEach(item => {
      item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      this.$set(item, 'inputVisible', false)
      this.$set(item, 'inputValue', '')
    })
  }
  // 级联分类改变
  private cateHandleChange() {
    this.getGoodsParams()
  }
  // 标签页点击
  private cateHandleClick() {
    this.getGoodsParams()
  }
  // 监听添加属性事件
  private addParamsHandle() {
    this.addParamsdialogVisible = true
  }
  // 文本框确认事件
  private handleInputConfirm(row: object) {
    if (row.inputValue.trim().length === 0) {
      row.inputValue = ''
      row.inputVisible = false
      return
    }
    // 发送添加标签请求 ...
    row.attr_vals.push(row.inputValue.trim())
    row.inputValue = ''
    row.inputVisible = false
  }
  // 文本框双击事件
  private showInput(row: object) {
    row.inputVisible = true
    this.$nextTick(() => {
      this.$refs.saveTagInput.$refs.input.focus()
    })
  }

  // 级联选择控制只能选择第三级分类
  get cateIsSelect() {
    if (this.selectCateKeys.length === 3) return false
    return true
  }
  // 级联选择选中的 keys
  get cateSelectId() {
    if (this.selectCateKeys.length === 3) return this.selectCateKeys[2]
    return null
  }
  // 添加属性 dialog 标题
  get addGoodsParamsTitle() {
    if (this.activeName === 'only') {
      return '添加静态属性'
    }
    return '添加动态参数'
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin:10px 10px 0 0;
}

.el-input {
  margin-top: 10px;
  width: 100px;
}
</style>
