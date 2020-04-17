<template>
  <div class="report">
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import echarts from 'echarts'
@Component
export default class Report extends Vue {
  private options = {
    title: {
      text: '用户来源'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#E9EEF3'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        boundaryGap: false
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ]
  }
  private option = {}
  private created() {
    this.getReportsData()
  }
  private mounted() {
    const myChart = echarts.init(document.getElementById('main'))
    myChart.setOption(this.option)
  }
  // 获取报表数据
  private async getReportsData() {
    const { data } = await (this as any).$http.get('reports/type/1')
    console.log(data)
    this.option = Object.assign(this.options, data.data)
    console.log(this.option)
  }
}
</script>
