<template>
  <div class="goods-list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="searchGoods" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2" class="addGoods">
          <el-button type="success" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表表格 -->
      <el-table :data="goodsListData" style="width: 100%" border="">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="日期"></el-table-column>
        <el-table-column prop="goods_price" label="价格" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">{{scope.row.add_time | date }}</template>
        </el-table-column>
        <el-table-column width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryGoodsList.pagenum"
        :page-sizes="[1, 10, 15, 20]"
        :page-size="queryGoodsList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class GoodsList extends Vue {
  // 商品搜索的值
  private searchGoods = ''
  private queryGoodsList = {
    query: '',
    pagenum: 1,
    pagesize: 10
  }
  // 商品列表数据
  private goodsListData = []
  private total = 0
  private created() {
    this.getGoodsListData()
  }
  // 获取商品列表数据
  private async getGoodsListData() {
    const { data } = await (this as any).$http('/goods', {
      params: this.queryGoodsList
    })
    this.goodsListData = data.data.goods
    this.total = data.data.total
    console.log(this.goodsListData)
  }
  // pageSize 改变
  private handleSizeChange(newPageSize: number) {
    this.queryGoodsList.pagesize = newPageSize
    this.getGoodsListData()
  }
  // 当前页改变
  private handleCurrentChange(currentPage: number) {
    this.queryGoodsList.pagenum = currentPage
    this.getGoodsListData()
  }
  // 删除商品
  private async deleteGoods(id: number) {
    const result = await this.$confirm(
      '此操作将永久删除该文件, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(err => err)
    if (result === 'confirm') {
      const { data } = await (this as any).$http.delete(`goods/${id}`)
      this.getGoodsListData()
      return
    }
    this.$message.error('取消删除')
  }
  // 添加商品 handle
  private addGoodsPage () {
    this.$router.push('/goods/add')
  }
}
</script>

<style lang="less" scoped>
</style>
