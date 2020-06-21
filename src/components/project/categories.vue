<!--  -->
<template>
  <div>
    <el-breadcrumb separator="/" class="roles_top">
      <el-breadcrumb-item :to="{ path: '/goods' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="goods_card">
      <el-button type="primary" @click="addcategoriesEvent" class="cate_btn">
        添加分类
      </el-button>
<!-- 添加分类 -->
<el-dialog
  title="添加分类"
  :visible.sync="dialogVisible"
  width="40%"
  @close="closeDialog"
  >
<el-form :model="addCategories"   :rules="addCateRule" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称" >
    <el-input v-model="addCategories.cat_name"></el-input>
  </el-form-item>
  <!-- options是级联选择是的数据源 -->
  <!-- props是级联选择是的显示配置 -->
  
<el-form-item label="父级分类">
 <el-cascader  
    v-model="selectCate"
    :options="catelist"
    :props="cateCules"
     clearable></el-cascader>
</el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
      <el-table
        :data="categoriesData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称" align="center">
        </el-table-column>
        <el-table-column label="是否有效" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="!scope.row.cat_deleted"
              type="success"
              icon="el-icon-check"
              circle
            ></el-button>
            <el-button
              size="mini"
              v-else
              type="delete"
              icon="el-icon-close"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.cat_level == 0">
              一级
            </el-tag>
            <el-tag type="info" v-show="scope.row.cat_level == 1">
              二级
            </el-tag>
            <el-tag type="warning" v-show="scope.row.cat_level == 2">
              三级
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" algin="center">
        <template slot-scope="scope">
           <el-button type="primary" @click="changecate(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
      <!-- 编辑分类 -->
      <el-dialog
  title="编辑分类"
  :visible.sync="dialogVisibleChange"
  width="40%"
@close="closeC"
  >
  <el-form :model="obj" min-width="100px" >
    <el-form-item label="分类名称：" >
    <el-input v-model="obj.cat_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleChange= false">取 消</el-button>
    <el-button type="primary" @click="changeC">确 定</el-button>
  </span>
</el-dialog>
      <!-- 分页显示 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 5, 7, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //添加和修改队对象
      obj:{
       cat_id:'',
       cat_name:""
      },
      dialogVisibleChange:false,
      categoriesData: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      dialogVisible:false,
      addCategories:{

        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      addCateRule:{
        cat_name:[
          {required:true,message:'请输入分类名称',trigger:'blur'}
      ]},
      catelist:[],
      selectCate:[0],
      cateCules:{
        expandTrigger:'hover',
        label:'cat_name',
        value:'cat_id',
        children:'children',
        checkStrictly:true
      }
        
    
    }
  },

  created() {
    this.getCategoriesData()
  },

  methods: {
    //关闭编辑分裂
    closeC(){
    this.obj={
      cat_id:"",
      cat_name:''
    }
    this.dialogVisibleChange=false
    },
   async  changeC(){
console.log(this.obj.cat_id)
   const {data:res}=await this.$https.put('categories/'+this.obj.cat_id,{cat_name:this.obj.cat_name})
   if(res.meta.status===200){
this.dialogVisibleChange = false;
this.$message.success('分类更新成功！')
this.getCategoriesData();
   }
   
    },
    //编辑分类
    changecate(row){
      this.dialogVisibleChange=true;
     this.obj.cat_id=row.cat_id,
     this.obj.cat_name=row.cat_name
     console.log('name',this.obj.cat_name)
     console.log('id',this.obj.cat_id)

    },
    //删除分类
    async deleteCate(id){
const {data:res}=await this.$https.delete(`categories/${id}`);
if(res.meta.status===200){
  this.$message.success('删除成功！')
  this.dialogVisibleChange=false;
  this.getCategoriesData();
}else{
  this.dialogVisibleChange=false
  return this.$message.error('删除失败！')
}
    },
    //级联选择是取数据室触发,添加分类

  async  addCate(){
console.log(this.selectCate)
let addCategorie={
       cat_name:this.addCategories.cat_name,
        cat_pid:this.selectCate[0],
        cat_level:this.selectCate[1]
}
     
const {data:res}=await this.$https.post('categories',addCategorie)
     console.log(res)
     if(res.meta.status==201){
       this.$message.success('分类添加成功！')
       
     }
     this.addCategories.cat_name="",
     this.selectCate=[0],
     thsi.addCategories= {

        cat_name:'',
        cat_pid:0,
        cat_level:0
      }
      this.dialogVisible=false
    },
    closeDialog(){
  this.addCategories.cat_name="",
     this.selectCate=[0],
     thsi.addCategories= {

        cat_name:'',
        cat_pid:0,
        cat_level:0
      }
      this.dialogVisible=false
    },
    //获取分类列表
    async getCateList(){
    const {data:res}=await this.$https.get('categories',{params:{type:2}});
    console.log(res)
    this.catelist=res.data
    },




    //添加分类
    addcategoriesEvent(){
      this.getCateList();
      this.dialogVisible=true
    },
  //分页显示
  //每页显示条数改变时
 async handleSizeChange(val){
this.queryInfo.pagesize=val;
 const { data: res } = await this.$https.get('categories', {
        params: this.queryInfo
      })
      this.categoriesData = res.data.result
},
//当前页面改变时
 async handleCurrentChange(val){
  this.queryInfo.pagenum=val;
   const { data: res } = await this.$https.get('categories', {
        params: this.queryInfo
      })
      this.categoriesData = res.data.result

},
    //页面加载的时候获取分类列表的数据
    async getCategoriesData() {
      const { data: res } = await this.$https.get('categories', {
        params: this.queryInfo
      })
      this.categoriesData = res.data.result
      this.total = res.data.total
      console.log(res)
    }
  }
}
</script>
<style scoped>
.goods_card {
  margin-top: 25px;
  padding-top: 15px;
}
.cate_btn{
  margin-bottom:10px
}
.demo-ruleForm{
  padding-right:20px;
}
</style>
