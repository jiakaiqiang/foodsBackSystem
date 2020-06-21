<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="foods">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" clearable v-model="goodslist.query"
              ><el-button slot="append" icon="el-icon-search" @click="getsearch"></el-button
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" class="grid-content bg-purple"
             @click="addgoods">添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品的列表 -->
      <el-table :data="foodslist" border show-header>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="300px">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="150px"
        >
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="150px">
        </el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template slot-scope="scope">
            {{ scope.row.add_time | filterTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
                     <el-button type="primary" size="mini" @click="editorfoods(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deletefoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodslist.pagenum"
        :page-sizes="[1, 5, 7, 10]"
        :page-size="goodslist.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      foodslist: [],
      goodslist: {
        query: '',
        pagenum: 1,
        pagesize: 7
      }
    }
  },
  created() {
    this.getgoodslist()
  },

  methods: {
    //编辑商品
    editorfoods(row){
      console.log(row)
      this.$router.push({
         path:"/add",//这个path就是你在router/index.js里边配置的路径
    query:{
          id:row.goods_id
    }
      });


    },
    //添加商品
    addgoods(){
      this.$router.push('add');

    },
    //删除
  async  deletefoods(rows){
    const {data:res}=await this.$https.delete(`goods/${rows.goods_id}`);
  if(res.meta.status===200){
    this.$message.success('删除成功！')
    this.getgoodslist();
  }else{
    return this.$message.error('删除失败')
  }

    },
    //搜索
    getsearch(){
     
      this.getgoodslist()
    },
    //页面修改的时候，跟新页面
    //获取每页展示的个数
    handleSizeChange(val) {
      this.goodslist.pagesize = val
      this.getgoodslist()
    },
    //获取当前的页
    handleCurrentChange(val) {
      this.goodslist.pagenum = val
      this.getgoodslist()
    },
    //页面加载的时候获取数据
    async getgoodslist() {
      const { data: res } = await this.$https.get('goods', {
        params: this.goodslist
      })
      if (res.meta.status === 200) {
        console.log(res)
        this.total = res.data.total
        this.foodslist = res.data.goods
        this.$message.success('商品列表获取成功')
      }
    }
  },
  filters: {
    filterTime(value) {
      let timeData = new Date(value)
      //获取年
      let year = timeData.getFullYear()
      //获取月
      let months = timeData.getMonth() + 1
      if (months <= 9) {
        months = '0' + months
      } else {
        months = months
      }
      //获取日
      let day = timeData.getDate()
      if (day <= 9) {
        day = '0' + day
      } else {
        day = day
      }
      //时
      let hours = timeData.getHours()
      if (hours <= 9) {
        hours = '0' + hours
      } else {
        hours = hours
      }
      //获取分
      let mintues = timeData.getMinutes()
      if (mintues <= 9) {
        mintues = '0' + mintues
      } else {
        mintues = mintues
      }
      //获取妙
      let seconds = timeData.getSeconds()
      if (seconds <= 9) {
        seconds = '0' + seconds
      } else {
        seconds = seconds
      }
      //年月日
      let ymd = year + '-' + months + '-' + day
      return ymd
    }
  }
}
</script>
<style scoped>
.el-card,
.el-table,
el-pagination {
  margin-top: 20px;
}
</style>
