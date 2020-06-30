<!--  -->
<template>
  <div>
   <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="reports">数据统计</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
     <div id="main" style="width: 1000px;height:400px;"></div>
    </el-card>
</div>
</template>

<script>
//导入echarts
import echarts from 'echarts'
export default {
  data () {
    return {
       option :{
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
    };
  },
//创建的时候进行数据的获取
created(){

},
 //在dom被加载完成后进行初始化，echarts实例
  async mounted(){
   var myChart = echarts.init(document.getElementById('main'));

      const {data:res}=await this.$https.get('reports/type/1');
      console.log(res)
      
      this.option=res.data
     console.log(this.option)
     this.option.title={
       text:'用户分布'
     }
     this.option.xAxis[0].type='category';
      this.option.xAxis[0].boundaryGap=false;
      this.option.tooltip={
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.option);
 },

  methods: {
    //发送请求获取数据
    getRportData(){
      
    }
  }
}

</script>
<style  scoped>
.el-card{
margin-top:25px
}
</style>