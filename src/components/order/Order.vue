<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-card>
      <el-table :data="ordersData" border="">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_id" label="订单编号"></el-table-column>
        <el-table-column prop="is_send" label="是否付款"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | date}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              round
              size="mini"
              icon="el-icon-edit"
              @click="editAddressHandle"
            ></el-button>
            <el-button
              type="success"
              round
              size="mini"
              icon="el-icon-check"
              @click="expressageHandle(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改地址diglog -->
    <el-dialog title="提示" :visible.sync="editDialogVisible">
      <el-cascader
        v-model="selectCity"
        :options="cityData"
        @change="cityHandleChange"
        :props="cityConfig"
      ></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 快递信息查询 -->
    <el-dialog title="提示" :visible.sync="addressDialogVisible">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in expressageData"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import cityData from '@/assets/data/citydata.js'
@Component
export default class Order extends Vue {
  // 订单列表查询参数
  private queryOrderList = {
    query: '',
    pagenum: 1,
    pagesize: 10
  }
  // 订单列表总条数
  private total = 0
  private selectCity = []
  // 订单列表数据
  private ordersData = []
  private editDialogVisible = false
  private addressDialogVisible = false
  // 城市数据
  private cityData = cityData
  // 级联选择配置
  private cityConfig = {
    expandTrigger: 'hover'
  }
  // 快递信息
  private expressageData = []

  private created() {
    this.getOrderList()
  }
  // 获取订单类表
  private async getOrderList() {
    const { data } = await (this as any).$http.get('orders', {
      params: this.queryOrderList
    })
    this.ordersData = data.data.goods
    this.total = data.data.total
    console.log(data)
  }
  private editAddressHandle() {
    this.editDialogVisible = true
  }
  private expressageHandle(id: number) {
    this.getExpressageData(1106975712662)
    this.addressDialogVisible = true
  }
  // 地址城市改变
  private cityHandleChange() {
    console.log(this.selectCity)
  }
  // 获取物流信息
  private async getExpressageData(id: number) {
    this.expressageData = []
    const { data } = await (this as any).$http.get(`/kuaidi/${id}`)
    this.expressageData = data.data
    console.log(data);
    
    console.log(this.expressageData);
    
  }
}
</script>
