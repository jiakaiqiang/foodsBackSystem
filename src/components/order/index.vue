<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="orders">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="searchOrder"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchOrderHandle"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist">
        <el-table-column type="index" border></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="warning" v-show="scope.row.order_pay == 0"
              >未付款</el-tag
            >
            <el-tag type="danger" v-show="scope.row.order_pay == 1"
              >已付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" @click="editOrder">编辑</el-button>
          <el-button type="danger"  @click="dialogVisible = true">物流</el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderinfo.pagenum"
        :page-sizes="[1, 5, 7, 10]"
        :page-size="orderinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑收货地址 -->
    <el-dialog
      title="修改收货地址"
      width="50%"
      :visible="addressVis"
      @close="addClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        
         ref="fromRef"
      >
        <el-form-item label="省/市" prop="address1">
           <el-cascader
    v-model="city"
    :options="citydata"
    :props="cityprop"
    @change="handleChange" ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addClose">取 消</el-button>
        <el-button type="primary" @click="addressVis = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息 -->
    <el-dialog
  title="物流信息"
  :visible.sync="dialogVisible"
  width="50%"
 >
 <!-- 物流的时间线 -->
 <el-timeline :reverse='reverse'>
    <el-timeline-item
      v-for="(item, index) in wuLiuData"
      :key="index"
      :timestamp="item.time">
      {{item.context}}
    </el-timeline-item>
  </el-timeline>




  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
//引入省市级的数据
import citydata from './city_data2017_element'
export default {
  data() {
    return {
      reverse:true,
      dialogVisible:false,
      //选中的省市县
      city:[],
      //省市县的数据
      citydata:citydata,
      //级联选择器的规则
      cityprop:{
       expandTrigger:'hover',
       value:'value',
       label:'label',
       children:'children'



      },
      ruleForm: {
        name: [],
        address: ''
      },
      //省市县校验规则
      rules:{
        address1:[
          { required: false, message: '请选择省/市/县', trigger: 'change' },
            
        ],
        address2:[
          { required: false, message: '请填写详细的地址', trigger: 'blur' },
            
        ]
      },
      addressVis: false,
      searchOrder: '',
      orderinfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      orderlist: [],
      total: 0,
      wuLiuData:[]
    }
  },
  created() {
    this.getOrderlist();
    this.getWuLiData()
  },
  methods: {
    //获取物流信息
    async getWuLiData(){
       const {data:res}= await this.$https.get('/kuaidi/1106975712662')
       if(res.meta.status===200){
         //获取物流数据
         this.wuLiuData=res.data;
         console.log(this.wuLiuData)
       

       }
        
    },

    //级联选择框进行值改变的时候
    handleChange(val){
      console.log(val);
      console.log(this.city)
    },

    //编辑地址
    editOrder() {
      this.addressVis = true
      
    },
    //关闭dialog
    addClose() {
      this.addressVis = false;
      this.fromRef = {};
      //关闭的时候 清空表单、
      this.$refs.fromRef.resetFields();
      console.log(this.$refs)


    },
    //搜索
    async searchOrderHandle() {
      console.log(this.searchOrder)

      const { data: res } = await this.$https.get(`orders/${this.searchOrder}`)
      console.log(res)
      if (res.meta.status === 200) {
        this.orderlist = res.data.goods
        this.total = res.data.total
      }
    },

    //每页条数改变的时候
    handleSizeChange(val) {
      this.orderinfo.pagesize = val
      this.getOrderlist()
    },
    //每页页数改变的时候
    handleCurrentChange(val) {
      this.orderinfo.pagenum = val
      this.getOrderlist()
    },
    //获取订单列表数据
    async getOrderlist() {
      const { data: res } = await this.$https.get('orders', {
        params: this.orderinfo
      })
      console.log(res)
      if (res.meta.status === 200) {
        this.orderlist = res.data.goods
        this.total = res.data.total
      }
    }
  }
}
</script>
<style scoped>
.el-card {
  margin-top: 25px;
}
</style>
